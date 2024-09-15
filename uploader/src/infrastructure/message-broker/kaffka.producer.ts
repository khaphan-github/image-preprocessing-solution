import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Partitioners, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;
  private shouldConnectedToKaffka: boolean;

  private readonly logger = new Logger(KafkaProducerService.name);

  constructor(private readonly config: ConfigService) {}

  async connectToKafka() {
    const kaffkaClientId = this.config.get<string>('KAFKA_CLIENT_ID');
    const kaffkaService = this.config.get<string>('KAFKA_SERVICE');
    this.logger.log(
      `KafkaClientID: ${kaffkaClientId} - KafkaService: ${kaffkaService}`,
    );
    if (kaffkaClientId && kaffkaService) {
      // TOTO: Load in environment
      this.producer = new Kafka({
        brokers: [kaffkaService], // Update with your Kafka broker's address
        clientId: kaffkaClientId,
        retry: {
          retries: 3,
        },
      }).producer({
        createPartitioner: Partitioners.LegacyPartitioner,
      });

      try {
        await this.producer.connect();
        this.shouldConnectedToKaffka = true;
        this.logger.log(`Connected to Kafka ${new Date()}`);
      } catch (err) {
        this.logger.error(err);
        this.shouldConnectedToKaffka = false;
      }
    } else {
      this.shouldConnectedToKaffka = false;
      this.logger.log(`Unable to connect with kaffka logs`);
    }
  }

  async produceMessage(topic: string, message: string) {
    if (!this.shouldConnectedToKaffka) {
      await this.connectToKafka();
    }
    try {
      const producerRecord: ProducerRecord = {
        topic,
        messages: [{ value: message }],
        acks: 1,
      };
      this.logger.log(
        `=> Send message to kafka... ${JSON.stringify(producerRecord)}`,
      );
      return this.producer.send(producerRecord);
    } catch (error) {
      this.logger.log(
        `=> Send message to kafka but not connected yet ${error}`,
      );
      return Promise.resolve(false);
    }
  }
}
