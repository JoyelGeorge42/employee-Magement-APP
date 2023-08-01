import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { FlagService } from './services/flag.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private FlagService:FlagService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = window.localStorage.getItem("token");
    request = request.clone({
      setHeaders:{
        Authorization : 'Bearer ' + token
      }
    });
    this.FlagService.loaderShow = true;
    return next.handle(request).pipe(
      finalize(() => {       
        this.FlagService.loaderShow = false;
      })
    );
  }
}
