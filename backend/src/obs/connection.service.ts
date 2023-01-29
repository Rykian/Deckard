import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis.service';
import { OBSAPI } from './_.service';

@Injectable()
export class OBSConnectionService {
  currentURL: string;
  currentPassword: string;

  constructor(private api: OBSAPI, private redis: RedisService) {
    this.reconnectLastSession();
  }

  async connect(url?: string, password?: string, identificationParams?: any) {
    this.api.once('ConnectionOpened', () => {
      this.currentURL = url;
      this.currentPassword = password;

      this.redis.client.set('last_connection_url', url);
      if (password) this.redis.client.set('last_connection_password', password);
    });

    this.api.once('ConnectionClosed', (error) => {
      console.error(error);
    });
    return this.api.connect(url, password, identificationParams);
  }

  async reconnectLastSession() {
    const url = await this.redis.client.get('last_connection_url');
    const password = await this.redis.client.get('last_connection_password');
    if (url) {
      this.connect(url, password);
    }
  }
}
