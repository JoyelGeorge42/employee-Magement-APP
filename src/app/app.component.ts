import { Component, OnChanges, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { FlagService } from './services/flag.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'atwork';

  constructor(public loginService: LoginService, public flagService:FlagService) {
    loginService.isUserLogined();
}


}
