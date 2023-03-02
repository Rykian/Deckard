import { Injectable } from '@nestjs/common'
import { RedisClientType } from '@redis/client'
import { createClient } from '@redis/client'

@Injectable()
export class RedisService {
  #client: RedisClientType

  get client() {
    return this.#client
  }

  constructor() {
    this.#client = createClient({
      socket: {
        host: 'localhost',
      },
    })
    this.#client.connect()
  }

  async getJSON<T>(key: string) {
    const result = await this.#client.get(key)
    if (!result) return null

    return JSON.parse(result) as T
  }

  async setJSON(key: string, json: any) {
    await this.#client.set(key, JSON.stringify(json))
  }
  set: RedisClientType['set'] = (...args) => this.#client.set(...args)
  get: RedisClientType['get'] = (...args) => this.#client.get(...args)
  exists: RedisClientType['exists'] = (...args) => this.#client.exists(...args)
}
