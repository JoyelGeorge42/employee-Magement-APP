import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FlagService } from '../services/flag.service';

@Component({
  selector: 'app-close-project',
  templateUrl: './close-project.component.html',
  styleUrls: ['./close-project.component.scss']
})
export class CloseProjectComponent {
  constructor(public dialog: MatDialogRef<CloseProjectComponent>,private flag:FlagService){}
  closeall() {
    this.dialog.close('Cancel');
  }
  changeflag(){
    this.flag.showRow = 4;
    this.flag.deleteProject0Dta = true;
    this.dialog.close('Cleared');
  }

  close:string = "Yo";
}
