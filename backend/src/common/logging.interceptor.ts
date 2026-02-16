import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType()

    if (contextType === 'http') {
      const request = context.switchToHttp().getRequest()
      const { method, url, ip } = request
      const now = Date.now()

      return next.handle().pipe(
        tap(() => {
          const response = context.switchToHttp().getResponse()
          const { statusCode } = response
          const duration = Date.now() - now
          this.logger.log(
            `${method} ${url} ${statusCode} - ${duration}ms - ${ip}`,
          )
        }),
      )
    }

    return next.handle()
  }
}
