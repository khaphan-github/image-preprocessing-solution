from aiokafka import AIOKafkaProducer
import asyncio

class ProcessorProducer:
    producer: AIOKafkaProducer = None
    topic: str = None

    def __init__(self, bootstrap_servers, topic):
        self.producer = AIOKafkaProducer(
            bootstrap_servers=bootstrap_servers
        )
        self.topic = topic

    async def start(self):
        await self.producer.start()

    async def stop(self):
        await self.producer.stop()

    async def send_message(self, key=None, value=None):
        await self.producer.send_and_wait(self.topic, key=key, value=value)

# Example of usage:
# producer = ProcessorProducer(bootstrap_servers='localhost:9092')
# await producer.start()
# await producer.send_message("topic_name", value=b"Hello, Kafka!")
# await producer.stop()
