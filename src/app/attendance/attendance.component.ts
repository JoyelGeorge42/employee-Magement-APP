import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
  
})
export class AttendanceComponent {

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

attendance:any[] = [];

dateform= new FormGroup({
  from :new FormControl('2023-05-29'),
  to : new FormControl('2023-06-27')
})

constructor(private apiService:ApiService, private http:HttpClient){ 
  this.apiService.reportingDetails().subscribe((res =>{
    console.log(res);
  }))
  this.apiService.attendancedetails().subscribe((res=>{
    this.attendance = res.results;

  }))
}

parameter:any  = new HttpParams().set("from","2023-05-29").set("to","2023-06-27").set("emp_id",2068);
param:any;

getattendance(){
  const fromvalue = this.dateform.get('from')?.value;
  const a :string = fromvalue!;
  const tovalue =this.dateform.get('to')?.value;
  const b = tovalue!
  this.param = new HttpParams().set("from",a).set("to",b).set("emp_id",2068);
  this.apiService.changeparam(this.param);
  this.apiService.attendancedetails().subscribe((res=>{
    this.attendance = res.results;
  }))
}
}

