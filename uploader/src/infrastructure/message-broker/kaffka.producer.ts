import { Injectable } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  private shouldConnectedToKaffka: boolean;

  constructor() {
    const kaffkaClientId = process.env.KAFFKA_CLIENT_ID;
    const kaffkaService = process.env.KAFFKA_SERVICE;

    console.log(
      `KafkaClientID: ${kaffkaClientId} - KafkaService: ${kaffkaService}`,
    );
    if (kaffkaClientId && kaffkaService) {
      // TOTO: Load in environment
      this.producer = new Kafka({
        brokers: [kaffkaService], // Update with your Kafka broker's address
        retry: { retries: 1 },
        clientId: 'kaf-kafka-client-prodcer',
      }).producer();

      this.producer
        .connect()
        .then(() => {
          this.shouldConnectedToKaffka = true;
          console.log(`Connected to Kafka ${new Date()}`);
        })
        .catch((err) => {
          console.error(err);
          this.shouldConnectedToKaffka = false;
        });
    } else {
      this.shouldConnectedToKaffka = false;
      console.log(`Unable to connect with kaffka logs`);
    }
  }

  produceMessage(topic: string, message: string) {
    try {
      if (this.shouldConnectedToKaffka) {
        const producerRecord: ProducerRecord = {
          topic,
          messages: [{ value: message }],
          acks: 1,
        };
        console.log(
          `=> Send message to kafka... ${JSON.stringify(producerRecord)}`,
        );
        return this.producer.send(producerRecord);
      } else {
        console.log(`=> Send message to kafka but not connected yet`);
      }
    } catch (error) {
      console.log(`=> Send message to kafka but not connected yet`);
    }
  }
}
