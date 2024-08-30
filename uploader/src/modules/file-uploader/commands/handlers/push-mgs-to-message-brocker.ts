import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PushMgsToMessageBrockerCommand } from '../impl/push-mgs-to-message-broker.command';
import { KafkaProducerService } from 'src/infrastructure/message-broker/kaffka.producer';
import { UPLOADER_CONFIG } from '../../const';

@CommandHandler(PushMgsToMessageBrockerCommand)
export class PushMgsToMessageBrockerCommandHandler
  implements ICommandHandler<PushMgsToMessageBrockerCommand>
{
  constructor(private readonly messageBroker: KafkaProducerService) {}

  TOPIC = UPLOADER_CONFIG.MGS_BROKER.IMAGE_RESOLUTION_TOPIC;

  execute(command: PushMgsToMessageBrockerCommand): Promise<any> {
    const { file } = command;
    const mgs = JSON.stringify(file.getMgsBrockerMessage());
    return this.messageBroker.produceMessage(this.TOPIC ?? 'upload-image-resolution', mgs);
  }
}
