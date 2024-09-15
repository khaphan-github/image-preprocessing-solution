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
        response = minio_client.get_object(bucket_name, object_name)
        file_content = response.read()
        response.close()
        response.release_conn()
        return file_content
    except S3Error as e:
        logging.info(f"An error occurred: {e}")
        return None