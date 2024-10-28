
from infrastructure.consummer import ProcessorConsumer
from infrastructure.producer import ProcessorProducer
from infrastructure.minio import S3Minio
from .resolution import ResolutionImage
from utils.logger import logger
import asyncio
from env import IMAGE_PROCESSING_MB_TOPIC, IMAGE_PROCESSING_MB_BOOTSTRAP_SERVERS, IMAGE_PROCESSING_MB_GROUP_ID, IMAGE_RESOLUTION_PROCESSED_TOPIC
import json

"""
Handle flow image processing
"""
class ImageProcessingHandler:
  consummer: ProcessorConsumer = None
  procuder: ProcessorProducer = None
  minio: S3Minio = None
  resolution_image: ResolutionImage = None
  
  def __init__(self):
    self.consumer = ProcessorConsumer(
      topic=IMAGE_PROCESSING_MB_TOPIC,
      bootstrap_servers=IMAGE_PROCESSING_MB_BOOTSTRAP_SERVERS,
      group_id=IMAGE_PROCESSING_MB_GROUP_ID
    )
    
    self.producer = ProcessorProducer(
      bootstrap_servers=IMAGE_PROCESSING_MB_BOOTSTRAP_SERVERS,
      topic=IMAGE_RESOLUTION_PROCESSED_TOPIC
    )
    
    self.minio = S3Minio()
    
    self.resolution_image = ResolutionImage()

  async def create_task(self, task):
    asyncio.create_task(task())
    
  async def resolution(self):
    try:
      async for msg in self.consumer:
        logger.info(f"consumed: {msg.topic}, {msg.partition}, {msg.offset}, {msg.key}, {msg.value}, {msg.timestamp}")
        
        resolutions, bucketName, fileName, fileId = json.loads(msg.value.decode('utf-8'))

        try:
          image_content, file_name = self.minio.download_image(
              bucket_name=bucketName, 
              object_name=fileName,
          )

          # 4 Image
          if image_content and file_name:
            qualities = [85, 20, 50, 10]
            images = []

            for quality in qualities:
                image, _ = self.resolution_image.scale(image_content, file_name, quality=quality)
                images.append({ 
                  'quality': quality,
                  'image': image,
                  'preSignURL': ''
                })

            for img in images:
              await self.minio.save_image(
                  bucket_name=bucketName, 
                  object_name=img['preSignURL'],
                  file_data=img['image']
              )
              
              ## Push message to queue when image processed
              await self.procuder.send_message(fileId, 'success')
            
        except Exception as e:
          logger.error(f"Error Download: {e}")
          
    except Exception as e:
      logger.error(f"Error consuming messages: {e}")
      
    finally:
      await self.consumer.stop()
          


  async def start(self):
    await self.consumer.start()
    await self.producer.start()
    await self.create_task(self.resolution())
    
    
  async def stop(self):
    if self.consumer is not None:
      await self.consumer.stop()
    