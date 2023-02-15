import { Injectable } from '@nestjs/common'
import { RedisClientType } from '@redis/client'
import { createClient } from '@redis/client'

@Injectable()
export class RedisService {
  client: RedisClientType

  constructor() {
    this.client = createClient({
      socket: {
        host: 'localhost',
      },
    })
    this.client.connect()
  }

  async getJSON<T>(key: string) {
    const result = await this.client.get(key)
    if (!result) return null

    return JSON.parse(result) as T
  }

  async setJSON(key: string, json: any) {
    await this.client.set(key, JSON.stringify(json))
  }
}
