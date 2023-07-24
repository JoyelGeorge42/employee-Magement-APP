import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlagService } from '../flag.service';

@Component({
  selector: 'app-close-project',
  templateUrl: './close-project.component.html',
  styleUrls: ['./close-project.component.scss']
})
export class CloseProjectComponent {
  constructor(public dialog: MatDialog,private flag:FlagService){}
  closeall() {
    this.dialog.closeAll();
  }
  changeflag(){
    this.flag.buttonClicked = false;
    this.flag.showRow = false;
    this.flag.deleteProject0Dta = true;
    this.dialog.closeAll();
  }
}
