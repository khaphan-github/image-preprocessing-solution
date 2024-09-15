import time
from fastapi import FastAPI
from env import *  # Ensure you have these variables defined correctly
from aiokafka import AIOKafkaConsumer
import asyncio
import logging
import json
from infrastructure.minio import *
from image_processing.resolution import *

app = FastAPI()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("kafka_consumer.log"),  # Log to file
        logging.StreamHandler()  # Log to console
    ]
)

consumer: AIOKafkaConsumer = None

@app.on_event("startup")
async def startup_event():
    global consumer
    consumer = AIOKafkaConsumer(
        IMAGE_RESOLUTION_MB_TOPIC,
        bootstrap_servers=IMAGE_RESOLUTION_MB_BOOTSTRAP_SERVERS,
        group_id=IMAGE_RESOLUTION_MB_GROUP_ID,
        auto_offset_reset='latest',  # or 'latest' depending on your needs
        enable_auto_commit=True,
    )
    await consumer.start()
    print("Kafka consumer started")

    async def consume():
        try:
            # Consume messages
            async for msg in consumer:
                message_info = f"consumed: {msg.topic}, {msg.partition}, {msg.offset}, {msg.key}, {msg.value}, {msg.timestamp}"
                logging.info(message_info)
                
                data = json.loads(msg.value.decode('utf-8'))
                try:
                    
                    image_content, file_name = download_image(
                        bucket_name=data['bucketName'], 
                        object_name=data['fileName']
                    )
    
                    if image_content and file_name:
                        save_scaled_images(image_content, file_name, quality=85, scale_factor=0.75, output_format='jpeg')
                        save_scaled_images(image_content, file_name, quality=20, scale_factor=0.75, output_format='jpeg')
                        save_scaled_images(image_content, file_name, quality=50, scale_factor=0.75, output_format='jpeg')
                        save_scaled_images(image_content, file_name, quality=10, scale_factor=0.75, output_format='jpeg')
                        
                except Exception as e:
                    logging.error(f"Error Download: {e}")
                
        except Exception as e:
            logging.error(f"Error consuming messages: {e}")
        finally:
            await consumer.stop()

    # Start the consume task
    asyncio.create_task(consume())

@app.on_event("shutdown")
async def shutdown_event():
    if consumer is not None:
        await consumer.stop()
    print("Kafka consumer stopped")

@app.get("/")
async def root():
    return {"message": "Hello World"}

# uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=FAST_API_APP_PORT)
