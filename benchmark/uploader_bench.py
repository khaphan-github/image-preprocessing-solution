from locust import HttpUser, task, between, LoadTestShape
import os
import random

# Define the class for user behavior
class FileUploadUser(HttpUser):
    wait_time = between(0.001, 1)  # Minimize wait time to achieve high request rate

    @task
    def upload_files(self):
        # Replace 'your_bucket_name' with the appropriate bucket name
        bucket_name = 'test'

        # Get all image files from the 'image' directory
        image_dir = './images'
        images = os.listdir(image_dir)
        if not images:
            print("No images found in the directory.")
            return
        
        # Randomly select an image file to upload
        image_file = random.choice(images)
        image_path = os.path.join(image_dir, image_file)

        # Open the file in binary mode
        with open(image_path, 'rb') as file:
            # Upload file to the /uploader/files/:bucket endpoint
            files = {'files': (image_file, file, 'multipart/form-data')}
            response = self.client.post(f"/api/v1/uploader/files/{bucket_name}", files=files)
            
            # Print the response for debugging purposes
            print(f"Response status code: {response.status_code}")
            print(f"Response text: {response.text}")

# Define custom load test shape to achieve 1000 requests per second
class CustomShape(LoadTestShape):
    def tick(self):
        # Target 1000 requests per second
        user_count = 1200
        spawn_rate = 1200
        return user_count, spawn_rate
