import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeTimestampInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.map(item => this.excludeTimestamp(item));
        }
        return this.excludeTimestamp(data);
      }),
    );
  }

  private excludeTimestamp(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Remove timestamp fields
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;

    // Recursively remove timestamp fields from nested objects
    for (const key in data) {
      if (data.hasOwnProperty(key) && typeof data[key] === 'object') {
        data[key] = this.excludeTimestamp(data[key]);
      }
    }

    return data;
  }
}
