import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

attendance:any[] = [];


constructor(private apiService:ApiService){ 
  this.apiService.reportingDetails().subscribe((res =>{
    console.log(res);
  }))

  this.apiService.attendancedetails().subscribe((res=>{
    this.attendance = res.results;
    console.log("Attennldbc ......",this.attendance)
  }))
}



}
