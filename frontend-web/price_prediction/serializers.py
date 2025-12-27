from rest_framework import serializers

class PricePredictionInputSerializer(serializers.Serializer):
    """
    Validates the input data coming from the farmer app.
    """
    commodity = serializers.CharField(max_length=100)
    # Assuming district is enough for location in the simple model
    district = serializers.CharField(max_length=100)
    # We might add 'state' later if needed by the model

    # Add any other features your model expects that the user provides
    # e.g., quality_grade = serializers.CharField(max_length=10, required=False)
