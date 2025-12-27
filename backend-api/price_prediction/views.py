from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PricePredictionInputSerializer
import joblib
import pandas as pd
import os
from django.conf import settings
import datetime

import requests
import io
import pytesseract
from PIL import Image 
from pdf2image import convert_from_bytes
from .serializers import CertificateAnalysisInputSerializer

import cv2  # The OpenCV library
import numpy as np # OpenCV uses this

# (Your Tesseract path line, if you need it)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# (Your model loading code is all fine, no changes)
MODEL_PATH = os.path.join(settings.BASE_DIR, 'price_prediction', 'price_model.joblib')
ENCODERS_PATH = os.path.join(settings.BASE_DIR, 'price_prediction', 'label_encoders.joblib')

try:
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
    print("AI Model and Encoders loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model or encoders file not found.")
    model = None
    encoders = None
except Exception as e:
    print(f"Error loading model/encoders: {e}")
    model = None
    encoders = None

FSSAI_TEMPLATE_PATH = os.path.join(settings.BASE_DIR, 'price_prediction', 'templates', 'fssai_logo.png')
LOGO_THRESHOLD = 0.7 # Confidence threshold (70%)

# (Your PredictPriceAPIView is all fine, no changes)
class PredictPriceAPIView(APIView):
    def post(self, request, *args, **kwargs):
        if not model or not encoders:
            return Response(
                {"error": "Model not loaded. Check server logs."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        serializer = PricePredictionInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            commodity = data['commodity']
            district = data['district']
            state = "Gujarat"
            try:
                state_encoded = encoders['state'].transform([state])[0]
                district_encoded = encoders['district'].transform([district])[0]
                commodity_encoded = encoders['commodity'].transform([commodity])[0]
                now = datetime.datetime.now()
                month = now.month
                day_of_week = now.weekday()
                input_df = pd.DataFrame([[
                    state_encoded,
                    district_encoded,
                    commodity_encoded,
                    month,
                    day_of_week
                ]], columns=['state_encoded', 'district_encoded', 'commodity_encoded', 'month', 'day_of_week'])
                prediction = model.predict(input_df)
                predicted_price = round(prediction[0], 2)
                return Response({"predicted_price": predicted_price}, status=status.HTTP_200_OK)
            except ValueError as e:
                 print(f"Encoding Error: {e}")
                 return Response(
                     {"error": f"Could not process input: {e}."},
                     status=status.HTTP_400_BAD_REQUEST
                 )
            except Exception as e:
                print(f"Prediction Error: {e}")
                return Response(
                    {"error": "An error occurred during prediction."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- [!! THIS CLASS IS UPDATED with the Safety Check !!] ---

class AnalyzeCertificateAPIView(APIView):
    """
    API endpoint to analyze a certificate from a URL.
    Uses a hybrid logo-detection and OCR approach.
    """
    
    def bytes_to_cv2_gray(self, image_bytes):
        """
        Helper function to convert raw bytes into a grayscale OpenCV image.
        """
        print("--- Converting bytes to OpenCV Grayscale... ---")
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            print("!!! OpenCV Error: Could not decode image. !!!")
            return None 
            
        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        return img_gray

    def post(self, request, *args, **kwargs):
        serializer = CertificateAnalysisInputSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file_url = serializer.validated_data['certificate_url']
        
        try:
            # --- 1. Load the FSSAI logo template ---
            try:
                template_logo = cv2.imread(str(FSSAI_TEMPLATE_PATH), cv2.IMREAD_GRAYSCALE)
                if template_logo is None:
                    raise FileNotFoundError
                w, h = template_logo.shape[::-1]
                print(f"--- Loaded FSSAI template logo: {w}x{h} pixels ---")
            except Exception as e:
                print(f"!!! CRITICAL: Could not load template logo at {FSSAI_TEMPLATE_PATH} !!!")
                print("!!! Make sure the file exists. Proceeding with OCR only. !!!")
                template_logo = None

            # --- 2. Download and prep the certificate file ---
            print(f"--- Downloading file from: {file_url} ---")
            response = requests.get(file_url)
            response.raise_for_status()
            
            file_bytes = response.content
            content_type = response.headers.get('Content-Type', '')
            print(f"--- File downloaded. Content-Type: {content_type} ---")
            
            # --- 3. Initialize Variables ---
            text = ""
            cert_type = "Unknown"
            cert_status = "Pending Review"
            logo_match_found = False

            # --- 4. Process the Certificate (Hybrid Approach) ---
            if 'application/pdf' in content_type:
                # PDF: We must use OCR, logo matching is too complex for pages
                print("--- PDF detected. Running OCR only... ---")
                images = convert_from_bytes(file_bytes)
                for i, image in enumerate(images):
                    pil_bytes = io.BytesIO()
                    image.save(pil_bytes, format='PNG')
                    cert_gray = self.bytes_to_cv2_gray(pil_bytes.getvalue())
                    
                    if cert_gray is not None:
                        # Binarize for better OCR
                        _, cert_bw = cv2.threshold(cert_gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                        text += pytesseract.image_to_string(cert_bw, lang='eng') + "\n"
                
            elif 'image' in content_type:
                # Image: We can use both logo matching and OCR
                print("--- Image detected. Running Hybrid Analysis... ---")
                cert_gray = self.bytes_to_cv2_gray(file_bytes)
                
                if cert_gray is not None:
                    # --- 4a. Try Logo Matching First ---
                    if template_logo is not None:
                        print("--- Running Template Matching for FSSAI logo... ---")
                        
                        # --- [!! THIS IS THE FIX !!] ---
                        # Get dimensions
                        cert_h, cert_w = cert_gray.shape[:2]
                        logo_h, logo_w = template_logo.shape[:2]

                        # Check if certificate is smaller than the template
                        if cert_h < logo_h or cert_w < logo_w:
                            print(f"--- Certificate ({cert_w}x{cert_h}) is smaller than logo template ({logo_w}x{logo_h}). Skipping logo match. ---")
                        else:
                            # Certificate is big enough, run the match
                            result = cv2.matchTemplate(cert_gray, template_logo, cv2.TM_CCOEFF_NORMED)
                            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
                            print(f"--- Logo Match Confidence: {max_val:.4f} ---")
                            
                            if max_val >= LOGO_THRESHOLD:
                                print("--- SUCCESS: FSSAI Logo match found! ---")
                                cert_type = "FSSAI (Logo Match)"
                                cert_status = "Verified"
                                logo_match_found = True
                        # --- [!! END OF FIX !!] ---
                    
                    # --- 4b. Run OCR (either as fallback or for other certs) ---
                    if not logo_match_found:
                        print("--- Logo not found (or threshold not met). Running OCR... ---")
                        _, cert_bw = cv2.threshold(cert_gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
                        text = pytesseract.image_to_string(cert_bw, lang='eng')
                    
            else:
                print(f"!!! ERROR: Unsupported file type: {content_type} !!!")
                return Response({'error': f'Unsupported file type: {content_type}'}, status=400)

            # --- 5. Analyze Results ---
            print("==========================================")
            print(f"--- AI IS READING THIS TEXT (if any) ---\n{text}")
            print("-------------------------------")

            # Final check. This logic runs if logo matching was skipped or failed.
            if not logo_match_found:
                text_lower = text.lower()
                # Using the expanded list of keywords
                if "fssai" in text_lower or "ssal" in text_lower or "food license" in text_lower:
                    cert_type = "FSSAI (Text Match)"
                    cert_status = "Verified"
                elif "npop" in text_lower or "national programme" in text_lower or "organic" in text_lower:
                    cert_type = "NPOP Organic"
                    cert_status = "Verified"

            print(f"--- AI DECISION: Type={cert_type}, Status={cert_status} ---")
            print("==========================================")

            # 6. Send the results back
            return Response({
                'certificate_type': cert_type,
                'certificate_status': cert_status
            }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            print(f"!!! ERROR: Failed to download file: {str(e)} !!!")
            return Response({'error': f'Failed to download file: {str(e)}'}, status=500)
        except Exception as e:
            print(f"!!! CERTIFICATE ANALYSIS ERROR: {str(e)} !!!")
            return Response({'error': f'An error occurred during analysis: {str(e)}'}, status=500)