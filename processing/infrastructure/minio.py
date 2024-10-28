from minio import Minio
from minio.error import S3Error
from env import *
from utils.logger import logger
from io import BytesIO

"""
Create connection to minio server
"""
class S3Minio:
    minio: Minio = None
    def __init__(self):
        self.minio = Minio(
        endpoint=f"{MINIO_ENDPOINT}:{MINIO_PORT}",
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_USE_SSL
    )
        
    def download_image(self, bucket_name, object_name):
        """
        Download image from minio by bucket and object name
        """
        try:
            object_stat = self.minio.stat_object(bucket_name, object_name)
            file_name = object_stat.object_name

            response = self.minio.get_object(bucket_name, object_name)
            file_content = response.read()

            response.close()
            response.release_conn()

            return file_content, file_name

        except S3Error as e:
            logger.error(f"An error occurred: {e}")
            return None, None

    def save_image(self, bucket_name, object_name, file_data):
        """
        Save image to minio by bucket and object name
        """
        try:
            if not self.minio.bucket_exists(bucket_name):
                self.minio.make_bucket(bucket_name)
                
            logger.info(f"Created bucket: {bucket_name}")

            file_stream = BytesIO(file_data)  
            file_size = len(file_data) 

            self.minio.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=file_stream,
                length=file_size,
                content_type="application/octet-stream"
            )
            logger.info(f"File is successfully saved to MinIO as '{object_name}' in bucket '{bucket_name}'.")
        except S3Error as e:
            logger.error(f"An error occurred: {e}")

