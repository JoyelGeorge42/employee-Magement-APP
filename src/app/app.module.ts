import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HolidaysComponent } from './holidays/holidays.component';
import { ReportComponent } from './report/report.component';
import { EnrtyComponent } from './enrty/enrty.component';
import { RejectedTimesheetComponent } from './rejected-timesheet/rejected-timesheet.component';
import { LeaveComponent } from './leave/leave.component';
import { PolicyComponent } from './policy/policy.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    AttendanceComponent,
    HolidaysComponent,
    ReportComponent,
    EnrtyComponent,
    RejectedTimesheetComponent,
    LeaveComponent,
    PolicyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
