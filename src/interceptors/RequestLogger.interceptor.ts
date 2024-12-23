import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const UUID = 'LOGGER:' + new Date().getTime();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const body = request.body;

    console.log(
      `${UUID} Incoming Request: Method: ${method}, URL: ${url}, Body:`,
      body,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        console.log(
          `${UUID} time: ${Date.now() - now}ms  Response: Status Code: ${statusCode}, Body:`,
          responseBody,
        );
      }),
    );
  }
}
