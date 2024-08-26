import time
from fastapi import FastAPI
from env import *  # Ensure you have these variables defined correctly
from aiokafka import AIOKafkaConsumer
import asyncio

app = FastAPI()

consumer: AIOKafkaConsumer = None

@app.on_event("startup")
async def startup_event():
    global consumer
    consumer = AIOKafkaConsumer(
        IMAGE_RESOLUTION_MB_TOPIC,
        bootstrap_servers=IMAGE_RESOLUTION_MB_BOOTSTRAP_SERVERS,
        auto_offset_reset='earliest',  # or 'latest' depending on your needs
        enable_auto_commit=True,
        group_id=IMAGE_RESOLUTION_MB_GROUP_ID
    )
    await consumer.start()
    print("Kafka consumer started")

    async def consume():
        try:
            # Consume messages
            async for msg in consumer:
                time.sleep(1)
                print("consumed: ", msg.topic, msg.partition, msg.offset,
                      msg.key, msg.value, msg.timestamp)
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
