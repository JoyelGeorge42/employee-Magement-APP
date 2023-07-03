import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {

  constructor(private apiService:ApiService){
    this.apiService.reportingDetails().subscribe((res) => {
      this.empid = res.results.emp_id;
      this.empName = res.results.emp_name;
    });

    this.apiService.unavailableReportDate().subscribe((res=> {
      console.log(res)
      this.data = res.msg.msg;
    })
    )
    this.apiService.reportingDetails().subscribe((res =>{
    this.empid = res.results.emp_id;
    }))
  }

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  data:string ="";
  empid!:number;
  empName:string ="";
  params:any;


  downloadreport(){
  if(this.range.value.start != null||this.range.value.end != null){
    const c = this.convertToCustomFormat(this.range.value.start!);
    const d = this.convertToCustomFormat(this.range.value.end!);
    this.params = new HttpParams()
    .set('from', c)
    .set('to', d)
    .set('emp_id', this.empid);
    this.apiService.reportDownload(this.params).subscribe((res =>{
      let myBlob:Blob = res.body as Blob;
      let downloadUrl = URL.createObjectURL(myBlob);
  
      let a = document.createElement('a');
      a.href = downloadUrl;
      a.download = ''+this.empName+' Report.xlsx';
  
      a.click();
  setTimeout( ()=> {
          URL.revokeObjectURL(downloadUrl);
      }, 100);    
    }))
  }else{
    this.params = new HttpParams()
    .set('emp_id', this.empid);
    this.apiService.reportDownload(this.params).subscribe((res =>{
      let myBlob:Blob = res.body as Blob;
      let downloadUrl = URL.createObjectURL(myBlob);
  
      let a = document.createElement('a');
      a.href = downloadUrl;
      a.download = ''+this.empName+' Report.xlsx';
  
      a.click();
  setTimeout( ()=> {
          URL.revokeObjectURL(downloadUrl);
      }, 100);    
    }))
  }
  }

  convertToCustomFormat(date: Date): string {
    const year = date.getFullYear();
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Month is zero-based

    return `${year}-${month}-${day}`;
  }
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
