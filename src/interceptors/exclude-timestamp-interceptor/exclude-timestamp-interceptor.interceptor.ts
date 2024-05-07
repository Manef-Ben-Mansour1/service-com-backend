import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeTimestampInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const seen = new WeakSet();
    return next.handle().pipe(
      map(data => {
        if (Array.isArray(data)) {
          return data.map(item => this.excludeTimestamp(item, seen));
        }
        return this.excludeTimestamp(data, seen);
      }),
    );
  }

  private excludeTimestamp(data: any, seen: WeakSet<object>): any {
    if (!data || typeof data !== 'object' || data instanceof Date) {
      return data;
    }

    if (seen.has(data)) {
      // This object has already been processed, avoid infinite recursion
      return data;
    }
    seen.add(data);

    // Remove timestamp fields
    const { createdAt, updatedAt, deletedAt, ...restData } = data;

    // Recursively remove timestamp fields from nested objects
    Object.keys(restData).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(restData, key) && typeof restData[key] === 'object') {
        restData[key] = this.excludeTimestamp(restData[key], seen);
      }
    });

    return restData;
  }
}
