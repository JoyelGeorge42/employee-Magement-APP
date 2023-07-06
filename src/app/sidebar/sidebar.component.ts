import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

username?:string;
empGender:string;

  constructor(private apiService:ApiService){
    var token = localStorage.getItem('token');
    var decodedToken: any = jwt_decode(token!);
    this.empGender = decodedToken.gender;
    
    this.apiService.reportingDetails().subscribe((res =>{
      this.username = res.results.emp_name;
      console.log("Reporting Details of",res.results.emp_name);
    }))
  }



}


