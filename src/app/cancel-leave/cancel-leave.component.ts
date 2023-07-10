import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-cancel-leave',
  templateUrl: './cancel-leave.component.html',
  styleUrls: ['./cancel-leave.component.scss']
})
export class CancelLeaveComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:number, private apiService:ApiService,public dialog: MatDialog,private _snackBar:MatSnackBar) {
  }

  deletedleave(){
    // this.apiService.deleteRequest(this.data).subscribe((res=>{
    // }))
    this.openSnackBar();
    this.dialog.closeAll();
  }
  closeall() {
    this.dialog.closeAll();
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
