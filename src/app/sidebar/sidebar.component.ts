import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

username?:string;

  constructor(private apiService:ApiService){
    this.apiService.reportingDetails().subscribe((res =>{
      this.username = res.results.emp_name;
      console.log("Reporting Details",res.results.emp_name);
    }))
  }

}
