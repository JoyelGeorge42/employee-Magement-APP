import { ApiService } from './../api.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { MatStartDate } from '@angular/material/datepicker';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss'],
})
export class ApplyLeaveComponent {
  constructor(private dialog: MatDialog, private apiService: ApiService) {
    var token = localStorage.getItem('token');
    var decodedToken: any = jwt_decode(token!);
    var empid = decodedToken.emp_id;
    this.empGender = decodedToken.gender;
    this.empType = decodedToken.category;

    this,
      apiService.getleavebalance().subscribe((res) => {
        this.currentleavebalance = res.results[0].outstanding_leave_bal;
      });

    this.parameters = new HttpParams().set('category', this.empType);

    this.apiService.getLeaveTypes(this.parameters).subscribe((res) => {
      this.leavetytpes = res.results;
      this.leavetytpes = this.filterTypes();
    });

    var holidayparam = new HttpParams().set('emp_id', empid);

    this.apiService.getHolidays(holidayparam).subscribe((res) => {
      res.forEach((element: { holiday_date: Date; '': any }) => {
        this.holidays.push(new Date(element.holiday_date).toLocaleDateString());
      });
    });
  }

  closeall() {
    this.dialog.closeAll();
  }


  selctedButton:string='firsthalf';
  holidays: any[] = [];
  currentleavebalance!: number;
  empGender: string = '';
  fontStyleControl = new FormControl('firsthalf');
  fontStyle?: string;
  selectedIndex = 1;
  leavetytpes: any[] = [];
  empType: string = '';
  parameters: any;
  sotredTypes: any[] = [];
  selectedType!: string;
  selectnumberofleaves:number=0;
  

  daterange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  reasons: any[] = [
    { value: 'sick-0', viewValue: 'Sick' },
    { value: 'casual-1', viewValue: 'Casual' },
    { value: 'travel-2', viewValue: 'Travel' },
    { value: 'other-3', viewValue: 'Other' },
  ];

  filterTypes() {
    if (this.empGender == 'Male') {
      this.leavetytpes.splice(1, 1);
      this.leavetytpes.splice(3, 1);
    } else {
      this.leavetytpes.splice(1, 1);
      this.leavetytpes.splice(2, 1);
    }
    return this.leavetytpes;
  }

  filterDays = (d: Date | null): boolean => {
    if (this.selectedType != 'Maternity') {
      const date = d || new Date();
      const dayNo = date.getDay();
      const dateformat = date.toLocaleDateString();      
      return (
        dayNo !== 0 &&
        dayNo !== 6 &&
        !this.holidays.find((x) => x == dateformat)
      );
    } else {
      return true;
    }
  };


  singleday = new FormGroup({
    start: new FormControl()
  })

  multipledays = new FormGroup({
    startdate : new FormControl(),
    enddate : new FormControl()
  })

  multipledayscount(){
    var diffrence = this.multipledays.value.enddate - this.multipledays.value.startdate;
    var count = (diffrence / (1000 * 3600 * 24)) + 1;
    let start = this.multipledays.value.startdate
    while (start <= this.multipledays.value.enddate) {
      var b = this.filterDays(start);
      if(b == false){
        count = count - 1; 
      }
      start.setDate(start.getDate() + 1);
    }
    this.selectnumberofleaves = count;
    this.multipledays.value.enddate =  "";
    this.multipledays.value.startdate =  "";
  }

  applyleave(){
    console.log(this.selectedType);

    
  }
}
