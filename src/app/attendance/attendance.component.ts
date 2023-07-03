import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  title = 'Attendance';

  constructor(private apiService: ApiService, private http: HttpClient) {
    this.apiService.reportingDetails().subscribe((res) => {
      this.empid = res.results.emp_id;
      this.empName = res.results.emp_name;
    });
    this.apiService.attendancedetails().subscribe((res) => {
      this.attendance = res.results;
    });
  }

  empName:string ="";
  empid!: number;
  param: any;

  @ViewChild('myTestDiv') table!: ElementRef;

  daterange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  fileName = 'Attendance.xlsx';

  convertToCustomFormat(date: Date): string {
    const year = date.getFullYear();
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Month is zero-based

    return `${year}-${month}-${day}`;
  }

  getAttendanceByDate() {
    const c = this.convertToCustomFormat(this.daterange.value.start!);
    const d = this.convertToCustomFormat(this.daterange.value.end!);
    this.param = new HttpParams()
      .set('from', c)
      .set('to', d)
      .set('emp_id', this.empid);
    this.apiService.changeparam(this.param);
    this.apiService.attendancedetails().subscribe((res) => {
      this.attendance = res.results;
    });
  }

  downloadAttendance(){
    this.apiService.attendanceDownload().subscribe((res =>{
      let myBlob:Blob = res.body as Blob;
      let downloadUrl = URL.createObjectURL(myBlob);
  
      let a = document.createElement('a');
      a.href = downloadUrl;
      a.download = ''+this.empName+' AttendanceReport.xlsx';
  
      a.click();
  setTimeout( ()=> {
          URL.revokeObjectURL(downloadUrl);
      }, 100);    
    }))
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  attendance: any[] = [];
}
