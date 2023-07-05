import { ApiService } from './../api.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  selctedButton: string = 'firsthalf';
  holidays: any[] = [];
  currentleavebalance!: number;
  empGender: string = '';
  halfdayformcontrol = new FormControl('firsthalf');
  multipledayssecondhalfformcontrol = new FormControl('');
  multipledaysfirsthalfformcontrol = new FormControl('');
  fontStyle?: string;
  selectedIndex = 1;
  leavetytpes: any[] = [];
  empType: string = '';
  parameters: any;
  sotredTypes: any[] = [];
  selectedType!: string;
  selectnumberofleaves: number = 0;
  diffrence: any;
  startDate: any;
  endate: any;
  count!: number;
  start: any;
  halfdays: number = 0;
  firsthalf: number = 0;
  secondhalf: number = 0;

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

  halfday = new FormGroup({
    halfstart: new FormControl<Date | null>(null, [Validators.required]),
  });

  singleday = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
  });

  multipledays = new FormGroup({
    startdate: new FormControl<Date | null>(null, [Validators.required]),
    enddate: new FormControl<Date | null>(null, [Validators.required]),
  });

  // applyleaveform = new FormGroup({
  //   halfday: new FormGroup({
  //     halfstart: new FormControl(),
  //   }),
  //   singleday: new FormGroup({
  //     start: new FormControl(),
  //   }),
  //   multipledays: new FormGroup({
  //     startdate: new FormControl(),
  //     enddate: new FormControl(),
  //   }),
  //   submitbtn: new FormControl(),
  // });

  closeall() {
    this.dialog.closeAll();
  }

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

  multipledayscount() {
    if (this.multipledays.value.enddate != null) {
      this.endate = this.multipledays.value.enddate;
      this.startDate = this.multipledays.value.startdate;
      this.diffrence = this.endate - this.startDate;
      console.log('diffrence ...........', this.startDate);

      this.count = this.diffrence / (1000 * 3600 * 24) + 1;
      this.start = this.multipledays.value.startdate;
      if (this.selectedType != 'Maternity') {
        while (this.start <= this.multipledays.value.enddate!) {
          var b = this.filterDays(this.start);
          if (b == false) {
            this.count = this.count - 1;
          }
          this.start.setDate(this.start.getDate() + 1);
          console.log('Count .....', this.count);
        }
      }
      this.selectnumberofleaves = this.count;
      if (this.firsthalf != 0 || this.secondhalf != 0) {
        console.log('working');
        this.selectnumberofleaves =
          this.count - (this.firsthalf + this.secondhalf);
      }
    }
  }

  updatefirsthalF() {
    if (this.firsthalf == 0) {
      this.firsthalf = 0.5;
      if (this.endate != null) {
        this.selectnumberofleaves = this.selectnumberofleaves - this.firsthalf;
      }
    } else {
      this.firsthalf = 0;
      if (this.endate != null) {
        this.selectnumberofleaves = this.selectnumberofleaves + 0.5;
      }
    }
  }

  updatesecondhalf() {
    if (this.secondhalf == 0) {
      this.secondhalf = 0.5;
      if (this.endate != null) {
        this.selectnumberofleaves = this.selectnumberofleaves - this.secondhalf;
      }
    } else {
      this.secondhalf = 0;
      if (this.endate != null) {
        this.selectnumberofleaves = this.selectnumberofleaves + 0.5;
      }
    }
  }

  autoupdatedate() {
    console.log(this.selectedType);
    let start = this.multipledays.value.startdate;
    this.multipledays.get('startdate')?.setValue(new Date(start!));
    console.log('start .......', start);

    if (this.selectedType == 'Maternity' || this.selectedType == 'Paternity') {
      console.log('maternity leave', this.leavetytpes[2].leave_credits);
      let latestdate = start!.setDate(
        start!.getDate() + this.leavetytpes[2].leave_credits - 1
      );
      this.multipledays.get('enddate')?.setValue(new Date(latestdate));
      this.multipledayscount();
    } else if (this.selectedType === 'Marriage') {
      console.log(this.leavetytpes[1].leave_credits);
      let latestdate = start!.setDate(
        start!.getDate() + this.leavetytpes[1].leave_credits - 1
      );
      this.multipledays.get('enddate')?.setValue(new Date(latestdate));
      this.multipledayscount();
    } else {
    }
  }

  applyleave() {
    if (this.selectedIndex == 1) {
      console.log(this.halfday.value.halfstart);
      console.log(this.selectedIndex);
      console.log(this.selectedType);
      this.closeall();
    } else if (this.selectedIndex == 2) {
      console.log(this.selectedIndex);
      console.log(this.selectedType);
      this.closeall();
    } else {
      console.log(this.selectedIndex);
      console.log(this.selectedType);
      this.closeall();
    }
  }
}
