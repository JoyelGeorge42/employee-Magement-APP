import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { FlagService } from './services/flag.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'atwork';
  isShowLoader:boolean =false;
  isSidebarHidden:boolean = false;
  constructor(public loginService: LoginService, private flagService:FlagService,private cdRef:ChangeDetectorRef) {
    loginService.isUserLogined();
}
  ngOnInit(): void {
    this.isShowLoader = this.flagService.loaderShow;
    this.cdRef.detectChanges();
  }

  hideSidebar(){
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
