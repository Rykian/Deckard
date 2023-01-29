import { Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { setTimeout } from 'timers/promises';
import { OBSAPI } from './_.service';

@Injectable()
export class OBSStreamService {
  logger = new Logger(OBSStreamService.name);
  readonly IS_STREAMING = 'IS_STREAMING';

  #streaming = false;

  get isStreaming() {
    return this.#streaming;
  }

  private set isStreaming(streaming: boolean) {
    if (this.#streaming == streaming) return;

    this.#streaming = streaming;
    this.pubsub.publish(this.IS_STREAMING, streaming);
  }

  constructor(private api: OBSAPI, private pubsub: PubSub) {
    api.on('StreamStateChanged', (data) => {
      this.logger.debug(`Stream state change: ${JSON.stringify(data)}`);
      this.isStreaming = data.outputActive;
    });
    if (api.identified) {
      this.checkCurrentState();
    } else {
      api.on('Hello', async () => {
        await setTimeout(1000);
        this.checkCurrentState();
      });
    }
  }

  async checkCurrentState() {
    const data = await this.api.call('GetStreamStatus');
    this.logger.debug(`Current stream state: ${JSON.stringify(data)}`);
    this.isStreaming = data.outputActive;
  }
}
