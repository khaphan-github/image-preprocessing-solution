#!/bin/bash
echo "Waiting for 20 seconds to ensure Kafka is ready..."
sleep 24  # Delay for 20 seconds

# Now start the FastAPI application
uvicorn main:app --host 0.0.0.0 --port 8000
