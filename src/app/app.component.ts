import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'atwork';
  isLogedIn:boolean=false;
  a:string|null="";

  constructor(public loginService:LoginService){}

}
