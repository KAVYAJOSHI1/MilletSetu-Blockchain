from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PricePredictionInputSerializer
import joblib
import pandas as pd
import os
from django.conf import settings # To build file paths safely
import datetime

# --- Load Model and Encoders ONCE when Django starts ---
MODEL_PATH = os.path.join(settings.BASE_DIR, 'price_prediction', 'price_model.joblib')
ENCODERS_PATH = os.path.join(settings.BASE_DIR, 'price_prediction', 'label_encoders.joblib')

try:
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
    print("AI Model and Encoders loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model or encoders file not found. Make sure 'price_model.joblib' and 'label_encoders.joblib' are in the 'price_prediction' app directory.")
    model = None
    encoders = None
except Exception as e:
    print(f"Error loading model/encoders: {e}")
    model = None
    encoders = None
# --------------------------------------------------------

class PredictPriceAPIView(APIView):
    """
    API endpoint to predict millet price based on commodity and location.
    Expects POST data: {"commodity": "Bajra", "district": "Ahmedabad"}
    """
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
            # Assuming 'Gujarat' for now, as our sample data only had that.
            # In a real app, you might get state from user input or profile.
            state = "Gujarat"

            # --- Prepare features for the model ---
            try:
                # 1. Encode categorical features using loaded encoders
                state_encoded = encoders['state'].transform([state])[0]
                district_encoded = encoders['district'].transform([district])[0]
                commodity_encoded = encoders['commodity'].transform([commodity])[0]

                # 2. Get current date features
                now = datetime.datetime.now()
                month = now.month
                day_of_week = now.weekday() # Monday=0, Sunday=6

                # Create a DataFrame in the same order as training features
                # features = ['state_encoded', 'district_encoded', 'commodity_encoded', 'month', 'day_of_week']
                input_df = pd.DataFrame([[
                    state_encoded,
                    district_encoded,
                    commodity_encoded,
                    month,
                    day_of_week
                ]], columns=['state_encoded', 'district_encoded', 'commodity_encoded', 'month', 'day_of_week'])

                # --- Make Prediction ---
                prediction = model.predict(input_df)

                # The model returns an array, get the first element
                predicted_price = round(prediction[0], 2) # Round to 2 decimal places

                return Response({"predicted_price": predicted_price}, status=status.HTTP_200_OK)

            except ValueError as e:
                 # Handle cases where the input (e.g., district) wasn't seen during training
                 print(f"Encoding Error: {e}")
                 return Response(
                     {"error": f"Could not process input: {e}. Was '{district}' or '{commodity}' in the training data?"},
                     status=status.HTTP_400_BAD_REQUEST
                 )
            except Exception as e:
                print(f"Prediction Error: {e}")
                return Response(
                    {"error": "An error occurred during prediction."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        else:
            # Input data was invalid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
