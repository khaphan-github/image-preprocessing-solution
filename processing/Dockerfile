# Use the latest official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI app and startup script into the container
COPY . .

# Make sure the start script is executable
RUN chmod +x /app/start.sh

# Use the start script to start the FastAPI app with a delay
CMD ["/app/start.sh"]
