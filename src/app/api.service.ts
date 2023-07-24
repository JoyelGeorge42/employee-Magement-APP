import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  reportingAPi: string = 'http://172.16.120.39:8000/api/mgr-reporters/';

  reportingparams: any = new HttpParams().set('indirect', 'true');

  reportingDetails(): Observable<any> {
    return this.http.get(this.reportingAPi, { params: this.reportingparams });
  }

  attendanceApi: string = 'http://172.16.120.39:8000/api/attendance/';

  attendanceparam: any = new HttpParams();

  changeparam(data: any) {
    this.attendanceparam = data;
  }

  attendancedetails(): Observable<any> {
    return this.http.get(this.attendanceApi, { params: this.attendanceparam });
  }

  attendanceDownload(): Observable<any> {
    let attendanceDownloadParam = this.attendanceparam;
    attendanceDownloadParam.set('download', true);
    return this.http.get(this.reportDownloadUrl, {
      params: attendanceDownloadParam,
      observe: 'response',
      responseType: 'blob',
    });
  }

  reportMsgUrl: string =
    'http://172.16.120.39:8000/api/reportdatesavailability/';

  unavailableReportDate(): Observable<any> {
    return this.http.get(this.reportMsgUrl);
  }

  reportDownloadUrl: string = 'http://172.16.120.39:8000/api/report/';

  reportDownload(parameters:any): Observable<any> {

    return this.http.get(this.reportDownloadUrl, {
      params: parameters,
      observe: 'response',
      responseType: 'blob',
    });
  }


  leaveHistoryUrl:string = "http://172.16.120.39:8000/api/leave/request/";

  leavehistoryparams = new HttpParams().set("filter","history");

  changeleavehistoryparam(data: any) {
    this.leavehistoryparams = data;
  }

  getleaveHistory():Observable<any>{
    return this.http.get(this.leaveHistoryUrl,{params:this.leavehistoryparams});
  }

  leaveBallanceUrl:string = "http://172.16.120.39:8000/api/leave/balance/";

  getleavebalance():Observable<any>{
    return this.http.get(this.leaveBallanceUrl);
  }

  leavependingparams = new HttpParams().set("filter","pending");

  changeleavependingparam(data: any) {
    this.leavehistoryparams = data;
  }

  getpendingleave():Observable<any>{
    return this.http.get(this.leaveHistoryUrl,{params:this.leavependingparams});
  }

  downloadLeaveHistoryUrl = "http://172.16.120.39:8000/api/leave/export-resolved/";

  downloadLeaveHistory(parameters:any){
    return this.http.get(this.downloadLeaveHistoryUrl,{params:parameters,
      observe:'response',
      responseType: 'blob'})
  }

  leaveTypesUrl:string="http://172.16.120.39:8000/api/leave/config/category/";

  getLeaveTypes(parameters:any):Observable<any>{  
    return this.http.get(this.leaveTypesUrl,{params:parameters});
  }

  holidayUrl:string ="http://172.16.120.39:8000/api/holiday/";

  getHolidays(param:any):Observable<any>{
    return this.http.get(this.holidayUrl,{params:param});
  }

  postLeaveUrl:string = "http://172.16.120.39:8000/api/leave/request/";

  postleave(body:any):Observable<any>{
    return this.http.post(this.postLeaveUrl,body)
  }

  deleteRequestUrl:string = "http://172.16.120.39:8000/api/leave/request/"

  deleteRequest(id:number):Observable<any>{
    return this.http.delete(this.deleteRequestUrl+id);
  }

  viewleavedetailsparams = new HttpParams().set("is_manager","false").set("leaves_in_last_n_days",60)

  viewleavedetails(id:number):Observable<any>{
    return this.http.get(this.deleteRequestUrl+id,{params:this.viewleavedetailsparams})
  }

  weekDataStatusUrl:string = "http://172.16.120.39:8000/api/compliance/"
  
  weekDataStatus():Observable<any>{
    return this.http.get(this.weekDataStatusUrl);
  }
}
