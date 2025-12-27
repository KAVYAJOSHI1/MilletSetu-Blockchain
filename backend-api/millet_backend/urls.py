from django.contrib import admin
from django.urls import path, include # Add 'include'

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add this line to include your app's URLs
    path('api/v1/prices/', include('price_prediction.urls')),
]
