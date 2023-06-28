import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient:HttpClient) {
    this.jwt_token = localStorage.getItem("key");
    if((this.jwt_token?.length) == 0){
      this.isUserAuthenticated = false;
    }
    else{
      this.isUserAuthenticated = true;
    }
   }

  jwt_token:string|null = '';
  isUserAuthenticated:boolean =false;


  loginApi:string = "http://172.16.120.39:8000/api/login/";

  authenticateUser(data:any):Observable<any>{
    return this.httpClient.post(this.loginApi,data);
  }

}
