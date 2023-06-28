import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  reportingAPi:string = "http://172.16.120.39:8000/api/mgr-reporters/"

  params:any = new HttpParams().set("indirect","true")

  reportingDetails():Observable<any>{
    return this.http.get(this.reportingAPi,{params:this.params})
  }

  attendanceApi:string ="http://172.16.120.39:8000/api/attendance/"

  param:any  = new HttpParams().set("from","2023-05-29").set("to","2023-06-27").set("emp_id",2068);


  changeparam(data:any){
    this.param = data;
  }

  attendancedetails():Observable<any>{
    return this.http.get(this.attendanceApi,{params:this.param});
  }

}
