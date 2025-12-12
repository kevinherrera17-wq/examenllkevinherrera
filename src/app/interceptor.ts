import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { PreferencesService } from './preferences.service';

const _DateFormat1: RegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const _DateFormat2: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/;
const _DateFormat3: RegExp = /^\d{4}-\d{2}-\d{2}$/;

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const preferencesService: PreferencesService = inject(PreferencesService);
  const router: Router = inject(Router);

  return from(preferencesService.get<string>('authToken')).pipe(
    switchMap((authToken) => {
      const isApiUrl: boolean = request.url.startsWith(environment.API_URL);
      if (authToken && isApiUrl)
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer Token ${authToken}`,
          },
        });

      return next(request).pipe(
        map((val: HttpEvent<any>) => {
          if (val instanceof HttpResponse) convert(val.body);
          return val;
        }),
        catchError((error) => {
          const CODES_STATUS: number[] = [401, 403];
          if (CODES_STATUS.includes(error.status)) {
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    })
  );
};

function convert(body: any) {
  if (body === null || body === undefined) return body;

  if (typeof body !== 'object') return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(value);
    else if (typeof value === 'object') convert(value);
  }
}

function isIsoDateString(value: any): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string')
    return (
      _DateFormat1.test(value) ||
      _DateFormat2.test(value) ||
      _DateFormat3.test(value)
    );
  return false;
}
