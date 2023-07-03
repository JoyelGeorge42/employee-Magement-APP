import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from './../api.service';
import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent {

constructor(private apiService:ApiService){
  this.apiService.getleaveHistory().subscribe((res =>{
    this.history = res.results;
  }))

  this.apiService.getleavebalance().subscribe((res=>{
    this.leavebalance = res.results[0].outstanding_leave_bal;
  }))

  this.apiService.getpendingleave().subscribe((res =>{
    this.pending = res.results;
    console.log(res);
  }))

  this.apiService.reportingDetails().subscribe((res) => {
    this.empid = res.results.emp_id;
    this.empName = res.results.emp_name;
  });
}

history:any[]=[];
pending:any[]=[];
leavebalance!:number;  
empid!:number;
param:any;
empName:string ="";

historydate = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null)
})

getLeaveHistoryByDate() {
  const c = this.convertToCustomFormat(this.historydate.value.start!);
  const d = this.convertToCustomFormat(this.historydate.value.end!);
  this.param = new HttpParams()
    .set('filter', 'history')
    .set('start_date', c+"T00:00:00")
    .set('end_date', d+"T00:00:00");
  this.apiService.changeleavehistoryparam(this.param);
  this.apiService.getleaveHistory().subscribe((res) => {
    if(res != null){
    this.history = res.results;
  }else{
    this.history = [];
  }
  console.log(res)
  },
  (error=>{
    this.history!;
  }));
}

convertToCustomFormat(date: Date): string {
  const year = date.getFullYear();
  const day = this.padZero(date.getDate());
  const month = this.padZero(date.getMonth() + 1); 

  return `${year}-${month}-${day}`;
}

downloadLeaveHistoryByDate(){
  console.log(this.historydate.value);
  if(this.historydate.value.start != null || this.historydate.value.end != null){
    console.log("Yo mahn workig");
  const c = this.convertToCustomFormat(this.historydate.value.start!);
  const d = this.convertToCustomFormat(this.historydate.value.end!);
  this.param = new HttpParams()
    .set('filter', 'history')
    .set('emp_id', this.empid)
    .set('start_date', c+"T00:00:00")
    .set('end_date', d+"T00:00:00");
  this.apiService.downloadLeaveHistory(this.param).subscribe((res =>{
    let myBlob:Blob = res.body as Blob;
    let downloadUrl = URL.createObjectURL(myBlob);

    let a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'LeaveHistoryReport.xlsx';// you can take a custom name as well as provide by server
    a.click();
setTimeout( ()=> {
        URL.revokeObjectURL(downloadUrl);
    }, 100);    
console.log(res);

  }));
  }
  else{
    console.log("not working")
    this.param =""
    this.param = new HttpParams()
    .set("filter", "history")
    .set("emp_id", this.empid);
    console.log(this.param)
    this.apiService.downloadLeaveHistory(this.param).subscribe((res =>{
      let myBlob:Blob = res.body as Blob;
      let downloadUrl = URL.createObjectURL(myBlob);
  
      let a = document.createElement('a');
      a.href = downloadUrl;
      a.download = ''+this.empName +' LeaveHistoryReport.xlsx';// you can take a custom name as well as provide by server
  
      a.click();
  setTimeout( ()=> {
          URL.revokeObjectURL(downloadUrl);
      }, 100);    
  console.log(res);
    }));
  }
}

padZero(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

}
