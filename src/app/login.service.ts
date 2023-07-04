import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient:HttpClient) {
    this.jwt_token = localStorage.getItem("token");
    if(this.jwt_token?.length == undefined){
      this.isUserAuthenticated = false;    
      this.isUserLogined();
    }
    else{
      this.isUserAuthenticated = true;
      this.isUserLogined();
    }
   }

  jwt_token:string|null = '';

  isUserAuthenticated:boolean =false;

   changeflag(){
    this.isUserAuthenticated = !this.isUserAuthenticated
   }

  isUserLogined(){
    return this.isUserAuthenticated;
   }

  loginApi:string = "http://172.16.120.39:8000/api/login/";

  authenticateUser(data:any):Observable<any>{
    return this.httpClient.post(this.loginApi,data);
  }

}
