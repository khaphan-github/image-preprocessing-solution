import time
from fastapi import FastAPI
from env import *  # Ensure you have these variables defined correctly
from aiokafka import AIOKafkaConsumer
import asyncio
import logging

app = FastAPI()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("kafka_consumer.log"),  # Log to file
        logging.StreamHandler()  # Log to console
    ]
)

def cpu_intensive_task():
    import multiprocessing
    """A simple function to consume CPU by performing calculations."""
    print(f"Starting CPU-intensive task on process {multiprocessing.current_process().name}")
    start_time = time.time()
    
    # Perform some heavy computations
    result = 0
    for i in range(10**7):
        result += i ** 2

    end_time = time.time()
    print(f"Task completed in {end_time - start_time:.2f} seconds")
    
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
                cpu_intensive_task()
        except Exception as e:
            print(f"Error consuming messages: {e}")
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
