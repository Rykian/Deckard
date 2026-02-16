import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvironmentService } from './env.service'
import { LoggingInterceptor } from './common/logging.interceptor'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  })
  const env = app.get(EnvironmentService)

  // Enable REST endpoint logging
  app.useGlobalInterceptors(new LoggingInterceptor())

  await app.listen(env.PORT)
  Logger.log(`Application listening on port ${env.PORT}`, 'Bootstrap')
}
bootstrap()
