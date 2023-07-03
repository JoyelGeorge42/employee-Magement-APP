import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance/attendance.component';
import { ReportComponent } from './report/report.component';
import { EnrtyComponent } from './enrty/enrty.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { RejectedTimesheetComponent } from './rejected-timesheet/rejected-timesheet.component';
import { LeaveComponent } from './leave/leave.component';
import { PolicyComponent } from './policy/policy.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard, AuthGuard2 } from './auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/entry', pathMatch: 'full'},
  {path:'login' , component:LoginComponent , canActivate:[AuthGuard2]},  
  {path:'attendance', component:AttendanceComponent, canActivate:[AuthGuard]},
  {path:'report', component:ReportComponent, canActivate:[AuthGuard]},
  {path:'entry',component:EnrtyComponent, canActivate:[AuthGuard]},
  {path:'holidays',component:HolidaysComponent, canActivate:[AuthGuard]},
  {path:'rejected-timesheet',component:RejectedTimesheetComponent, canActivate:[AuthGuard]},
  {path:'leave',component:LeaveComponent, canActivate:[AuthGuard]},
  {path:'policy', component:PolicyComponent, canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
