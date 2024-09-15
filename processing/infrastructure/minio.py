from minio import Minio
from minio.error import S3Error
from env import *

import logging

minio_client = Minio(
    endpoint=f"{MINIO_ENDPOINT}:{MINIO_PORT}",
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=MINIO_USE_SSL
)

# TODO: How download image to processing then save to minoi then push message 
# Contain callback url
# resolution
# file info.

def download_image(bucket_name, object_name):
    try:
        # Get object metadata (file size, content type, etc.)
        object_stat = minio_client.stat_object(bucket_name, object_name)
        file_size = object_stat.size  # File size in bytes
        file_name = object_stat.object_name

        logging.info(f"File Name: {file_name}")
        logging.info(f"File Size: {file_size / (1024 * 1024):.2f} MB")

        # Download the file content
        response = minio_client.get_object(bucket_name, object_name)
        file_content = response.read()

        # Always close the response after reading
        response.close()
        response.release_conn()

        return file_content, file_name

    except S3Error as e:
        logging.error(f"An error occurred: {e}")
        return None, None