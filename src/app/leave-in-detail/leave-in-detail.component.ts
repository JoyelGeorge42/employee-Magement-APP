import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-leave-in-detail',
  templateUrl: './leave-in-detail.component.html',
  styleUrls: ['./leave-in-detail.component.css']
})
export class LeaveInDetailComponent {
  details:any = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: number, private apiService:ApiService) {
    this.apiService.viewleavedetails(data).subscribe(
      (response) =>{
        this.details = response.results
      }
    )
  }
}
