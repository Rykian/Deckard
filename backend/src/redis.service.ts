import { Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';
import { createClient } from '@redis/client';

@Injectable()
export class RedisService {
  client: RedisClientType;

  constructor() {
    this.client = createClient({
      socket: {
        host: 'localhost',
      },
    });
    this.client.connect();
  }
}
