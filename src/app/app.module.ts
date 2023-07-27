import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {JsonPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { LoginService } from './services/login.service';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import { LeaveInDetailComponent } from './leave-in-detail/leave-in-detail.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { CancelLeaveComponent } from './cancel-leave/cancel-leave.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CloseProjectComponent } from './close-project/close-project.component';
import { DatePipe } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';


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
    ApplyLeaveComponent,
    LeaveInDetailComponent,
    CancelLeaveComponent,
    CloseProjectComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    JsonPipe,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatInputModule,
    MatButtonToggleModule,
    NgFor,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],
  providers: [
    LoginService,
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true 
    },
    DatePipe,
    DecimalPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
