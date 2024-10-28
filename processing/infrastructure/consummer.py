from aiokafka import AIOKafkaConsumer

"""
Consummer connection to kafka
"""
class ProcessorConsumer():
  consumer: AIOKafkaConsumer = None
  
  def __init__(self, topic, bootstrap_servers, group_id):
    self.consumer = AIOKafkaConsumer(
      topic,
      bootstrap_servers=bootstrap_servers,
      group_id=group_id,
      auto_offset_reset='latest',
      enable_auto_commit=True,
    )

  async def start(self):
    await self.consumer.start()
    
  async def stop(self):
    await self.consumer.stop()
    