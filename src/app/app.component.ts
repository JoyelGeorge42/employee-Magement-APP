import { Component, OnChanges, OnInit } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'atwork';

  constructor(public loginService: LoginService) {
    loginService.isUserLogined();
}


}
