import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetapiService {

  constructor(private http:HttpClient) {  
  }

  weeklydataurl:string = "http://172.16.120.39:8000/api/weeklydata/";

  getweeklydata():Observable<any>{
    return this.http.get(this.weeklydataurl)
  }
}
