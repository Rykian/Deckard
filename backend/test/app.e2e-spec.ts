import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('GraphQL', () => {
    it('should respond to health check query', () => {
      const query = `
        query {
          __typename
        }
      `

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data')
          expect(res.body.data).toHaveProperty('__typename')
        })
    })

    it('should return introspection schema', () => {
      const query = `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data')
          expect(res.body.data.__schema).toBeDefined()
          expect(res.body.data.__schema.queryType).toBeDefined()
        })
    })

    it('should handle invalid queries', () => {
      const query = `
        query {
          invalidField
        }
      `

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(400)
    })
  })
})
