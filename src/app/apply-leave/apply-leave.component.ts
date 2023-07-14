import { Moment } from 'moment';
import { ApiService } from './../api.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import jwt_decode from 'jwt-decode';
import {
  MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { MatStartDate } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss'],
})
export class ApplyLeaveComponent {
  constructor(private dialog: MatDialog, private apiService: ApiService, private _snackBar: MatSnackBar) {
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

  holidays: any[] = [];
  currentleavebalance!: number;
  empGender: string = '';
  multipledayssecondhalfformcontrol = new FormControl<boolean[]|null>([false]);
  multipledaysfirsthalfformcontrol = new FormControl<boolean[]|null>([false]);
  fontStyle?: string;
  selectedIndex = 1;
  leavetytpes: any[] = [];
  empType: string = '';
  parameters: any;
  sotredTypes: any[] = [];
  selectedType: string = 'Paid';
  selectnumberofleaves: number = 0;
  diffrence: any;
  startDate: any;
  selectedReason:string ="null";
  endate: any;
  count!: number;
  start: any;
  halfdays: number = 0;
  firsthalf = new FormControl(0);
  secondhalf = new FormControl(0);
  btnvalue!: string;

  reasons: any[] = [
    { value: 'Sick', viewValue: 'Sick' },
    { value: 'Casual', viewValue: 'Casual' },
    { value: 'Travel', viewValue: 'Travel' },
    { value: 'Other', viewValue: 'Other' },
  ];

  halfday = new FormGroup({
    halfstart: new FormControl<Date | null>(null, [Validators.required]),
    halfdayformcontrol: new FormControl('FIRST', Validators.required),
    halfdayreasontextarea: new FormControl('', [
      Validators.minLength(1),
      Validators.required,
    ]),
  });

  singleday = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    singledaytextarea: new FormControl('', [
      Validators.minLength(1),
      Validators.required,
    ]),
  });

  multipledays = new FormGroup({
    starteddate: new FormControl<Date | null>(null, [Validators.required]),
    enddate: new FormControl<Date | null>(null, [Validators.required]),
    multipledaytextarea: new FormControl('', [
      Validators.minLength(1),
      Validators.required,
    ]),
    file: new FormControl(''),
  });

  resetForm() {      
    if (this.selectedIndex == 1) {
    this.singleday.markAsUntouched();
  } else if (this.selectedIndex == 2) {
    this.multipledays.markAsUntouched();
  } else {
    this.halfday.markAsUntouched();
  }
    this.selectnumberofleaves = 0;
    this.multipledays.get('starteddate')?.reset();
    this.multipledays.get('enddate')?.reset();
    this.multipledayscount();
  }

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

  validate(): boolean {
    if (this.selectedIndex == 0) {
      if (this.halfday.invalid) {
        return false;
      } else {
        return true;
      }
    } else if (this.selectedIndex == 1) {
      if (this.singleday.invalid) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.multipledays.invalid) {
        return false;
      } else {
        return true;
      }
    }
  }

  multipledayscount() {
    this.endate = null;
    this.startDate = null;
    this.diffrence = null;
    this.count = 0;
    let startDate = this.multipledays.controls.starteddate.value;
    if (this.multipledays.value.enddate != null) {
      let testdate: any = new Date(startDate!);
      this.endate = new Date(this.multipledays.controls.enddate.value!);
      var diffDays: any = Math.floor(
        (this.endate - testdate) / (1000 * 60 * 60 * 24)
      );

      this.count = diffDays + 1;
      if (this.selectedType != 'Maternity') {
        while (testdate <= this.endate) {
          var b = this.filterDays(testdate);
          if (b == false) {
            this.count = this.count - 1;
          }
          testdate.setDate(testdate.getDate() + 1);
        }
      }
      this.selectnumberofleaves = this.count;
      if (this.selectedType != 'Paid') {
      if (this.firsthalf.value != 0 || this.secondhalf.value != 0) {
        this.selectnumberofleaves =
          this.count - (this.firsthalf.value! + this.secondhalf.value!);
      }
    }
    }
  }

  testvar:boolean = false;
  tesvar2:boolean = false;



  updatefirsthalF() {
    if(this.testvar == false){
      if (this.endate != null) {
        this.selectnumberofleaves  = this.selectnumberofleaves - 0.5;
      }
      this.testvar = true;
      this.firsthalfvalue = "true";
    }else{
      if (this.endate != null) {
        this.selectnumberofleaves = this.selectnumberofleaves + 0.5;
      }
      this.testvar = false;
      this.firsthalfvalue = "";
    }
  }

  firsthalfvalue: string = "";
  secondhalfvalue: string = "";

  updatesecondhalf() {
    if(this.tesvar2 == false){
      if (this.endate != null) {
        this.selectnumberofleaves  = this.selectnumberofleaves - 0.5;
      }
      this.tesvar2 = true;
      this.secondhalfvalue = "true";
    }else{
      if (this.endate != null) {
        this.selectnumberofleaves = this.selectnumberofleaves + 0.5;
      }      
      this.tesvar2 = false;
      this.secondhalfvalue = "";
    }
  }

  autoupdatedate() {
    let start = new Date(this.multipledays.get('starteddate')?.value!);

    if (this.selectedType == 'Maternity' || this.selectedType == 'Paternity') {
      let latestdate = start!.setDate(
        start!.getDate() + this.leavetytpes[2].leave_credits - 1
      );
      this.multipledays.get('enddate')?.setValue(new Date(latestdate));
      this.multipledayscount();
    } else if (this.selectedType == 'Marriage') {      
      let latestdate = start!.setDate(
        start!.getDate() + this.leavetytpes[1].leave_credits - 1
      );
      for (let i = 0; i < 3; i++) {
        if (this.filterDays(new Date(latestdate)) == false) {
          latestdate = +latestdate + 24 * 60 * 60 * 1000;
        } else {
          this.multipledays.get('enddate')?.setValue(new Date(latestdate));
          this.multipledayscount();
          break;
        }
      }
    } else {
    }
  }

  checkbutton(param: string) {
    if (param == 'first') {
      this.btnvalue = 'FIRST';
    } else {
      this.btnvalue = 'SECOND';
    }
  }

  filename: string = '';
  filedetails: any;
  body = new FormData();
  invitaionfile!: File;
  onFileChange(event: any) {
    this.invitaionfile = event.target.files[0];
    this.multipledays.get('file')?.setValue(event.target.files[0]);
    this.filedetails = this.multipledays.get('file')?.value;
    this.filename = this.filedetails.name;
  }

  applyleave() {
    if (this.validate() == true) {
      if (this.selectedIndex == 1) {
        const c = this.convertToCustomFormat(this.singleday.value.start!);
        this.body.append('day_leave_type', 'Single Day');
        this.body.append('hour', '');
        this.body.append(
          'emp_comments',
          this.singleday.get('singledaytextarea')?.value!
        );
        this.body.append('startdate', c + 'T00:00:00');
        this.body.append('enddate', c + 'T00:00:00');
        this.body.append('start_date_second_half', '');
        this.body.append('end_date_first_half', '');
      } else if (this.selectedIndex == 2) {
        const c = this.convertToCustomFormat(
          this.multipledays.value.starteddate!
        );
        const d = this.convertToCustomFormat(this.multipledays.value.enddate!);
        this.body.append('day_leave_type', 'Multiple Days');
        this.body.append('hour', '');
        this.body.append(
          'emp_comments',
          this.multipledays.get('multipledaytextarea')?.value!
        );
        this.body.append('startdate', c + 'T00:00:00');
        this.body.append('enddate', d + 'T00:00:00');
        this.body.append('start_date_second_half', this.firsthalfvalue);
        this.body.append('end_date_first_half', this.secondhalfvalue);
        if (this.selectedType == 'Marriage') {
          this.body.append('invitation_files', this.invitaionfile);
        }
      } else {
        const c = this.convertToCustomFormat(this.halfday.value.halfstart!);
        this.body.append('day_leave_type', 'Half Day');
        this.body.append(
          'hour',
          this.halfday.get('halfdayformcontrol')?.value!
        );
        this.body.append(
          'emp_comments',
          this.halfday.get('halfdayreasontextarea')?.value!
        );
        this.body.append('startdate', c + 'T00:00:00');
        this.body.append('enddate', c + 'T00:00:00');
        this.body.append('start_date_second_half', '');
        this.body.append('end_date_first_half', '');
      }
      this.body.append('leave_reason', this.selectedReason);
      if (this.selectedType == 'Marriage') {
        this.body.append('leave_type', '3');
      } else if (this.selectedType == 'Maternity') {
        this.body.append('leave_type', '5');
      } else {
        this.body.append('leave_type', '1');
      }

      this.apiService.postleave(this.body).subscribe((res) => {
        this.closeall();
        setTimeout(() => { window.location.reload(); },2000);
        this.openSnackBar();
      },
      (err)=>{
        var errormsg;
        var data ="Oops! Preexisting Leave Found on this Date";
        if(err.status == 409){
          errormsg = data ; 
        }
        this.closeall();
        this.openSnackBar2(errormsg);
      }
      );

    } else {
      if (this.selectedIndex == 1) {
        this.singleday.markAllAsTouched();
      } else if (this.selectedIndex == 2) {
        this.multipledays.markAllAsTouched();
      } else {
        this.halfday.markAllAsTouched();
      }
      var test = "Please Fill The Details !!"
      this.openSnackBar2(test);
    }
  }

  convertToCustomFormat(date: Date): string {
    const year = date.getFullYear();
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);

    return `${year}-${month}-${day}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.panelClass = ['background-green'];
    config.duration = 2500;
    config.horizontalPosition = "right";
    config.verticalPosition ="top"
    this._snackBar.open("Leave Request Submitted Successfully !!","",config);
  }

  openSnackBar2(data:any) {
    const config = new MatSnackBarConfig();
    config.panelClass=["background-red"];
    config.duration = 2500;
    config.horizontalPosition = "right";
    config.verticalPosition ="top"
    this._snackBar.open(data+" !!","",config);
  }
}

