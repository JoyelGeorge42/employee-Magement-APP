import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from './../api.service';
import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ApplyLeaveComponent } from '../apply-leave/apply-leave.component';
import { DialogRef } from '@angular/cdk/dialog';
import { LeaveInDetailComponent } from '../leave-in-detail/leave-in-detail.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
})
export class LeaveComponent {
  constructor(private apiService: ApiService, public dialog: MatDialog ,private _snackBar:MatSnackBar) {
    this.apiService.getleaveHistory().subscribe((res) => {
      if (res != null) {
        this.history = res.results;
      } else {
        this.history = [];
      }
    });

    this.apiService.getleavebalance().subscribe((res) => {
      this.leavebalance = res.results[0].outstanding_leave_bal;
    });

    this.apiService.getpendingleave().subscribe((res) => {
      if (res != null) {
        this.pending = res.results;
      } else {
        this.pending = [];
      }
    });

    this.apiService.reportingDetails().subscribe((res) => {
      this.empid = res.results.emp_id;
      this.empName = res.results.emp_name;
    });
  }

  history: any[] = [];
  pending: any[] = [];
  leavebalance!: number;
  empid!: number;
  param: any;
  empName: string = '';

  historydate = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  getLeaveHistoryByDate() {
    const c = this.convertToCustomFormat(this.historydate.value.start!);
    const d = this.convertToCustomFormat(this.historydate.value.end!);
    this.param = new HttpParams()
      .set('filter', 'history')
      .set('start_date', c + 'T00:00:00')
      .set('end_date', d + 'T00:00:00');
    this.apiService.changeleavehistoryparam(this.param);
    this.apiService.getleaveHistory().subscribe(
      (res) => {
        if (res != null) {
          this.history = res.results;
        } else {
          this.history = [];
        }
      },
      (error) => {
        this.history!;
      }
    );
  }

  convertToCustomFormat(date: Date): string {
    const year = date.getFullYear();
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);

    return `${year}-${month}-${day}`;
  }

  downloadLeaveHistoryByDate() {
    if (
      this.historydate.value.start != null ||
      this.historydate.value.end != null
    ) {
      const c = this.convertToCustomFormat(this.historydate.value.start!);
      const d = this.convertToCustomFormat(this.historydate.value.end!);
      this.param = new HttpParams()
        .set('filter', 'history')
        .set('emp_id', this.empid)
        .set('start_date', c + 'T00:00:00')
        .set('end_date', d + 'T00:00:00');
      this.apiService.downloadLeaveHistory(this.param).subscribe((res) => {
        let myBlob: Blob = res.body as Blob;
        let downloadUrl = URL.createObjectURL(myBlob);

        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '' + this.empName + ' LeaveHistoryReport.xlsx';
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 100);
      });
    } else {
      this.param = '';
      this.param = new HttpParams()
        .set('filter', 'history')
        .set('emp_id', this.empid);
      this.apiService.downloadLeaveHistory(this.param).subscribe((res) => {
        let myBlob: Blob = res.body as Blob;
        let downloadUrl = URL.createObjectURL(myBlob);

        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '' + this.empName + ' LeaveHistoryReport.xlsx';
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(downloadUrl);
        }, 100);      });
    }
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  opendialouge() {
    const dialogref = this.dialog.open(ApplyLeaveComponent);
    dialogref.disableClose = true;
  }

  deleteLeaveRequest(id:number){
    this.apiService.deleteRequest(id).subscribe((res=>{
    }))
    this.openSnackBar()
  }

  viewleaverequests(id:number){
    this.apiService.viewleavedetails(id).subscribe((res=>{
    }))
  }

  openviewDialog(id:number) {
    const dialogRef = this.dialog.open(LeaveInDetailComponent, { data: id});
    dialogRef.disableClose = true
  }
  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.panelClass=["background-red"];
    config.duration = 500;
    config.horizontalPosition = "right";
    config.verticalPosition ="top"
    this._snackBar.open("Leave Request Deleted Successfully !!","",config);
  }
}
