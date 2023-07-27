import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  constructor(private loginService:LoginService , private router:Router, private apiservice:ApiService){
    this.apiservice.weekDataStatus().subscribe(
      (res)=>{
        this.weekdata = res.results;
        console.log(this.weekdata);
        
      }
    )
  }

  weekdata:any;

  logout(){
    this.loginService.changeflag();
    localStorage.clear();
    this.router.navigate(["/login"]);
  }
}
