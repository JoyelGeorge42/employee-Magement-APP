import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  title = 'Attendance';

  constructor(private apiService: ApiService, private http: HttpClient) {
  }

  reporters: any[] = [];
  options: any[]=[];

  update(){
    this.apiService.reportingDetails().subscribe((res) => {
      this.reporters = res.results.reporters;
      this.reporters.push(res.results);
      this.empid = res.results.emp_id;
      this.getAttendanceByDate();
      this.empName = res.results.emp_name;
      console.log(this.reporters);
      this.selectedvalue = res.results.emp_name;
      this.reporters.forEach((element)=>{
      this.options.push(element.emp_name);
      });
    });
  }

  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.update();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value || "")),
    );
    console.log(this.options);
    
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  empName?: string;
  empid: number = 0;
  param: any;
  selectedvalue: string = '';


  myControl = new FormControl('');


  daterange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  fileName = 'Attendance.xlsx';

  convertToCustomFormat(date: Date): string {
    const year = date.getFullYear();
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);

    return `${year}-${month}-${day}`;
  }

  getAttendanceByDate() {
    if (this.daterange.value.start != null) {
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
    } else {
        const now = new Date();
        const lastday = new Date();
        lastday.setDate(lastday.getDate()-30);
        const c = this.convertToCustomFormat(lastday);
        const d = this.convertToCustomFormat(now);
        this.param = new HttpParams()
          .set('from', c)
          .set('to', d)
          .set('emp_id', this.empid);
        this.apiService.changeparam(this.param);
        this.apiService.attendancedetails().subscribe((res) => {
          this.attendance = res.results;
        });
  }
}

  downloadAttendance() {
    this.apiService.attendanceDownload().subscribe((res) => {
      let myBlob: Blob = res.body as Blob;
      let downloadUrl = URL.createObjectURL(myBlob);

      let a = document.createElement('a');
      a.href = downloadUrl;
      a.download = '' + this.empName + ' AttendanceReport.xlsx';

      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 100);
    });
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  attendance: any[] = [];
}
