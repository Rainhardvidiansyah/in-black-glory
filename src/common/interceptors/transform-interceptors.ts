import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {

  constructor(private reflector: Reflector){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    
    // Priority: custom @ResponseMessage() decorator > message from returned data > default 'Success'
    const customMessage = this.reflector.get<string>(
      'response_message',
      context.getHandler(),
    );

    //If @ResponseMessage is used in controller methods, then customMessage will appear.
    //If not, the OK from below variable will be used
    
    return next.handle().pipe(
      map((data) => {
        const message = data?.message || response.statusMessage || 'OK';
      
        const responseData = data?.isPaginated
        ? { data: data.data, meta: data.meta }
        : data?.data !== undefined
        ? data.data : data;

        return{ 
          metadata: {
          message: customMessage || message,
          path: request.url,
          requestId: request.requestId ?? request.headers['x-request-id'] ?? randomUUID(),
          status: response.statusCode,
          timestamp: new Date().toISOString(),
        },
        data: responseData
      }
      }));


        
        //   // instanceToPlain(data), 
        // };
    
  }

}
