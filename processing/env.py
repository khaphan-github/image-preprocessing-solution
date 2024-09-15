from dotenv import load_dotenv
import os

load_dotenv()

# FASTAPI
FAST_API_APP_PORT=os.getenv("FAST_API_APP_PORT")

# MESSAGE BROKERS
IMAGE_RESOLUTION_MB_TOPIC = os.getenv("IMAGE_RESOLUTION_MB_TOPIC")
IMAGE_RESOLUTION_MB_BOOTSTRAP_SERVERS = os.getenv("IMAGE_RESOLUTION_MB_BOOTSTRAP_SERVERS")
IMAGE_RESOLUTION_MB_GROUP_ID = os.getenv("IMAGE_RESOLUTION_MB_GROUP_ID")

# OBJECT STORAGE

# MinIO configuration from environment variables
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_PORT = os.getenv("MINIO_PORT")
MINIO_USE_SSL = os.getenv("MINIO_USE_SSL").lower() in ['true', '1', 't', 'y', 'yes']
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
