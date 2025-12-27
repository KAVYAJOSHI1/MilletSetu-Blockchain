from django.urls import path
from . import views

urlpatterns = [
    # This is your existing path
    path('predict-price/', views.PredictPriceAPIView.as_view(), name='predict_price'),
    
    # --- ADD THIS NEW LINE ---
    path('analyze_certificate/', views.AnalyzeCertificateAPIView.as_view(), name='analyze_certificate'),
]