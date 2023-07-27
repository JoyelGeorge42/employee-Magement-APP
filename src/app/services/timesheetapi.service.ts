import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimesheetapiService {

  constructor(private http:HttpClient) {  
  }

  weeklydataurl:string = "http://testvedika.atai.ai/api/weeklydata/";

  getweeklyData():Observable<any>{
    return this.http.get(this.weeklydataurl)
  }

  postWeeklyData(bodyData:any):Observable<any>{
    return this.http.post(this.weeklydataurl,bodyData)
  }

  weeklystatusurl:string = "http://testvedika.atai.ai/api/weeklystatus/";

  getweeklystatus():Observable<any>{
    return this.http.get(this.weeklystatusurl);
  }

  postWeeklystatus(bodyValues:any):Observable<any>{
    return this.http.post(this.weeklystatusurl,bodyValues);
  }


}
