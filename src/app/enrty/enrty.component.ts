import { Component, HostListener } from '@angular/core';
import { TimesheetapiService } from '../timesheetapi.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CloseProjectComponent } from '../close-project/close-project.component';
import { FlagService } from '../flag.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { IActiveProjects, IWeeklyData, IWeeklyStatus, IWeeklyStatusProjects, IWorkHours } from '../interfaces/interfaces';

@Component({
  selector: 'app-enrty',
  templateUrl: './enrty.component.html',
  styleUrls: ['./enrty.component.css'],
})
export class EnrtyComponent {
  apiResponse: Array<IWeeklyData> = [];
  weeklyStatus:Array<IWeeklyStatus> = [];
  weeklydata!: IWeeklyData;
  holidaydata: Array<IWorkHours> =[];
  miscellaneous: Array<IWorkHours> =[];
  vacation: Array<IWorkHours> =[];
  activeprojects!: Array<IActiveProjects>;
  project0Name!: string;
  days: Array<Date> = [];
  weekNumber!: number;
  isSaveAndSubmit: boolean = true;
  gross_working_hours: Array<IWorkHours>=[];
  net_working_hours:  Array<IWorkHours>=[];
  initialProjectDetails:  Array<IWorkHours>=[];
  allProjectDetails: Array<IWorkHours> = [];
  defaultprojectDetails:  Array<IWorkHours>=[];
  netTotalDaysHours!:number;
  netTotalDaysMinutes!:number;
  projectName!: string;
  cummilativeProject1Hours!:number;
  cummilativeProject1Minutes!:number;
  cummilativeProject0Hours!:number;
  cummilativeProject0Minutes!:number;

  showRow: any;
  buttonClicked: any;

  generalTextAreaData!:IWeeklyStatusProjects;
  activeprojectData:Array<IWeeklyStatusProjects>=[];

  totaltextAreaLength!:number;

  constructor(
    public flag: FlagService,
    private api: TimesheetapiService,
    public dialog: MatDialog,
    private datepipe:DatePipe,
    private _snackBar:MatSnackBar
  ) {
    this.settingValues();
  }

  settingValues() {
    this.api.getweeklydata().subscribe((res) => {
      this.apiResponse = res;
      console.log(this.apiResponse);
      
      this.weeklydata = this.apiResponse[0];
      console.log(this.weeklydata);
      this.holidaydata = this.weeklydata.HOLIDAY.work_hours;
      this.miscellaneous = this.weeklydata.MISCELLANEOUS.work_hours;
      this.activeprojects = this.weeklydata.active_projects;
      this.vacation = this.weeklydata.VACATION.work_hours;
      this.weeklydata.days.forEach((item: any) => {
        this.days.push(new Date(item));
      });
      this.isSaveAndSubmit = this.weeklydata.enableSaveSubmit;

      this.gross_working_hours = this.weeklydata.gross_working_hours;
      this.net_working_hours = this.weeklydata.net_working_hours;
      this.weekNumber = this.weeklydata.week_number;
      this.projectName = this.activeprojects[1].project_name;
      this.cummilativeProject1Hours = this.activeprojects[1].cumulative.h;
      this.cummilativeProject1Minutes = this.activeprojects[1].cumulative.m;
      this.initialProjectDetails = this.activeprojects[0].work_hours;
      this.activeprojects.forEach((element: any, index: number) => {
        if (index == 1) {
          this.defaultprojectDetails = element.work_hours;
        } else {
          this.allProjectDetails.push(element);
          console.log("yoyyo .. ..",element);
          
        }
      });
      this.project0Name = this.activeprojects[0].project_name;
      this.cummilativeProject0Hours = this.activeprojects[0].cumulative.h;
      this.cummilativeProject0Minutes = this.activeprojects[0].cumulative.m;

      this.calculateproject0data();
      this.calculateProject1Data();
      this.calculateMiscellaneousData();
      this.calculateHolidayData();
      this.calculateVacationData();
      this.calculateByDay();
    });
    this.api.getweeklystatus().subscribe((res) => {
      this.weeklyStatus = res;
      console.log("Before post",this.weeklyStatus);
      
      this.generalTextAreaData = this.weeklyStatus[0].GENERAL;
      this.activeprojectData = this.weeklyStatus[0].active_projects;
      let a = 0;
      this,this.activeprojectData.forEach((element:any) => {
         a =a + element.work_report.length;
      });
      this.totaltextAreaLength =
        this.generalTextAreaData.work_report.length + a;
    });
  }

  calculateLength() {
    let a = 0;
    this,this.activeprojectData.forEach((element:any) => {
       a =a + element.work_report.length;
    });
    this.totaltextAreaLength =
      this.generalTextAreaData.work_report.length + a;
    this.enablingSaveangsubmit();
  }

  flag0: boolean = false;
  flag1: boolean = false;
  flag2: boolean = false;
  project0nettotalHours!: number;
  project0nettotalMinutes!: number;

  calculateproject0data(i = 7) {
    if (i != 7) {
      if (this.initialProjectDetails[i].h > 24) {
        this.currentTootltip = i;
        this.currentTooltipRow = 2;
        this.numberGreaterThan24 = true;
        setTimeout(() => {
          this.numberGreaterThan24 = false;
          this.currentTootltip = 7;
          this.currentTooltipRow = 0;
          this.initialProjectDetails[i].h = 0;
        }, 2000);
      }
      this.calculateByDay(i, 2);
    } else {
      this.calculateByDay(i, 2);
    }
    if (!this.exceedsTwentyFourHours) {
      this.project0nettotalHours = 0;
      this.project0nettotalMinutes = 0;
      var a = 0;
      var b = 0;
      var minutes = 0;
      var hours = 0;
      if (this.flag.deleteProject0Dta == true) {
        this.initialProjectDetails.forEach((item: any) => {
          item.h = 0;
          item.m = 0;
          a = 0;
          b = 0;
        });
        this.flag.deleteProject0Dta = false;
      } else {
        this.initialProjectDetails.forEach((item: any) => {
          a = item.h + a;
          b = Number(item.m) + b;
        });
      }
      minutes = b % 60;
      hours = Math.floor(b / 60);
      hours = hours + a;
      this.project0nettotalHours = hours;
      this.project0nettotalMinutes = minutes;
      if (hours || minutes !== 0) {
        this.flag0 = true;
      } else {
        this.flag0 = false;
      }
      this.calculateByDay();
    }
  }

  currentTootltip: number = 7;
  currentTooltipRow: number = 0;
  project1nettotalHours!: number;
  project1nettotalMinutes!: number;
  calculateProject1Data(i = 7, c = false) {
    if (i != 7) {
      if (this.defaultprojectDetails[i].h > 24) {
        this.currentTootltip = i;
        this.currentTooltipRow = 1;
        this.numberGreaterThan24 = true;
        setTimeout(() => {
          this.numberGreaterThan24 = false;
          this.currentTootltip = 7;
          this.currentTooltipRow = 0;
          this.defaultprojectDetails[i].h = 0;
        }, 2000);
      }
      this.calculateByDay(i, 1, c);
    } else {
      this.calculateByDay(i, 1, c);
    }

    this.defaultprojectDetails.forEach((item: any) => {
      if (item.h == ' ') {
        item.h = 0;
      }
    });
    if (!this.exceedsTwentyFourHours) {
      this.project1nettotalHours = 0;
      this.project1nettotalMinutes = 0;
      var a = 0;
      var b = 0;
      var minutes = 0;
      var hours = 0;
      this.defaultprojectDetails.forEach((item: any) => {
        a = item.h + a;
        b = Number(item.m) + b;
      });
      minutes = b % 60;
      hours = Math.floor(b / 60);
      hours = hours + a;
      this.project1nettotalHours = hours;
      this.project1nettotalMinutes = minutes;
      if (hours || minutes !== 0) {
        this.flag1 = true;
      } else {
        this.flag1 = false;
      }
      this.calculateByDay();
    }
  }

  day0NetHours!: number;
  day0NetMinutes!: number;
  day1NetHours!: number;
  day1NetMinutes!: number;
  day2NetHours!: number;
  day2NetMinutes!: number;
  day3NetHours!: number;
  day3NetMinutes!: number;
  day4NetHours!: number;
  day4NetMinutes!: number;
  day5NetHours!: number;
  day5NetMinutes!: number;
  day6NetHours!: number;
  day6NetMinutes!: number;

  calculateMiscellaneousData(i = 7) {
    if (i != 7) {
      if (this.miscellaneous[i].h > 24) {
        this.currentTootltip = i;
        this.currentTooltipRow = 3;
        this.numberGreaterThan24 = false;
        this.numberGreaterThan24 = true;
        setTimeout(() => {
          this.numberGreaterThan24 = false;
          this.currentTootltip = 7;
          this.currentTooltipRow = 0;
          this.miscellaneous[i].h = 0;
          this.calculateByDay(i, 3);
        }, 2000);
      }
      this.calculateByDay(i, 3);
    } else {
      this.calculateByDay(i, 3);
    }
    if (!this.exceedsTwentyFourHours) {
      this.cummilativenettotalHours = 0;
      this.cummilativenettotalMinutes = 0;
      var a = 0;
      var b = 0;
      var minutes = 0;
      var hours = 0;
      this.miscellaneous.forEach((item: IWorkHours) => {
        a = item.h + a;
        b = Number(item.m) + b;
      });
      minutes = b % 60;
      hours = Math.floor(b / 60);
      hours = hours + a;
      this.cummilativenettotalHours = hours;
      this.cummilativenettotalMinutes = minutes;
      if (hours || minutes != 0) {
        this.flag2 = true;
      } else {
        this.flag2 = false;
      }
      this.calculateByDay();
    }
  }
  cummilativenettotalHours!: number;
  cummilativenettotalMinutes!: number;
  holidaynettotalHours!: number;
  holidaynettotalMinutes!: number;

  calculateHolidayData() {
    this.calculateByDay();
    if (!this.exceedsTwentyFourHours) {
      this.holidaynettotalHours = 0;
      this.holidaynettotalMinutes = 0;
      var a = 0;
      var b = 0;
      var minutes = 0;
      var hours = 0;
      this.holidaydata.forEach((item: any) => {
        a = item.h + a;
        b = Number(item.m) + b;
      });
      minutes = b % 60;
      hours = Math.floor(b / 60);
      hours = hours + a;
      this.holidaynettotalHours = hours;
      this.holidaynettotalMinutes = minutes;
      this.calculateByDay();
    }
  }

  vacationnettotalHours!: number;
  vacationnettotalMinutes!: number;
  calculateVacationData() {
    this.calculateByDay();
    if (!this.exceedsTwentyFourHours) {
      this.calculateByDay();
      this.vacationnettotalHours = 0;
      this.vacationnettotalMinutes = 0;
      var a = 0;
      var b = 0;
      var minutes = 0;
      var hours = 0;
      this.vacation.forEach((item: any) => {
        a = item.h + a;
        b = item.m + b;
      });
      minutes = b % 60;
      hours = Math.floor(b / 60);
      hours = hours + a;
      this.vacationnettotalHours = hours;
      this.vacationnettotalMinutes = minutes;
      this.calculateByDay();
    }
  }

  exceedsTwentyFourHours: boolean = false;
  errorplacevalue: number = 7;
  errorplacevalue1: number = 7;
  errorplacevalue2: number = 7;
  halfDayTaken: boolean = false;
  vacationTaken: boolean = false;

  calculateHoliday(index: number, row: number, i: number) {
    if (this.vacation[i].h == 5) {
      if (this.defaultprojectDetails[i].h > 5) {
        this.halfDayTaken = true;
        this.errorplacevalue1 = index;
        this.currentTooltipRow = row;
        setTimeout(() => {
          this.halfDayTaken = false;
          this.errorplacevalue1 = 7;
          this.currentTooltipRow = 0;
        }, 2000);
      } else if (this.defaultprojectDetails[i].h == 5) {
        if (this.defaultprojectDetails[i].m > 0) {
          this.halfDayTaken = true;
          this.errorplacevalue1 = index;
          this.currentTooltipRow = row;
          setTimeout(() => {
            this.halfDayTaken = false;
            this.errorplacevalue1 = 7;
            this.currentTooltipRow = 0;
          }, 2000);
        }
      } else {
      }
    } else if (this.vacation[i].h == 8) {
      this.vacationTaken = true;
      this.errorplacevalue2 = index;
      this.currentTooltipRow = row;
      setTimeout(() => {
        this.vacationTaken = false;
        this.errorplacevalue2 = 7;
        this.currentTooltipRow = 0;
      }, 2000);
    } else {
    }
  }

  calculateByDay(index = 0, row = 0, check = false) {
    let totalHour = 0;
    let totalMinute = 0;
    for (let i = 0; i < 7; i++) {
      var a = 0;
      var b = 0;
      a =
        Number(this.defaultprojectDetails[i].h) +
        Number(this.vacation[i].h) +
        Number(this.initialProjectDetails[i].h) +
        Number(this.holidaydata[i].h) +
        Number(this.miscellaneous[i].h);
      b =
        Number(this.defaultprojectDetails[i].m) +
        Number(this.vacation[i].m) +
        Number(this.initialProjectDetails[i].m) +
        Number(this.holidaydata[i].m) +
        Number(this.miscellaneous[i].m);
      if (i == index && check == true) {
        this.calculateHoliday(index, row, i);
      }
      let c = 0;
      let d = 0;
      c = b % 60;
      d = Math.floor(b / 60);
      d = d + a;
      if ((d == 24 && c !== 0) || d > 24) {
        this.exceedsTwentyFourHours = true;
        switch(row){
          case 1:
            setTimeout(() => {
              this.defaultprojectDetails[i].h = 0;
              this.defaultprojectDetails[i].m = 0;
              this.calculateProject1Data();
              if(d>24){
              this.hourGreaterThan24 = true;              
              }else{
              this.minGreaterThan24 = true;
              }
              this.errorplacevalue = index;
              this.currentTooltipRow = row;
              setTimeout(() => {
                this.hourGreaterThan24 = false;
                this.minGreaterThan24 = true;
                this.errorplacevalue = 7;
                this.currentTooltipRow = 0;
              }, 2000);
            }, 100);
            a = Number(this.vacation[i].h) + Number(this.holidaydata[i].h) + Number(this.initialProjectDetails[i].h) + Number(this.miscellaneous[i].h);
            b = Number(this.vacation[i].m) + Number(this.holidaydata[i].m) + Number(this.initialProjectDetails[i].m) + Number(this.miscellaneous[i].m);
            break;

            case 2:
              setTimeout(() => {
                this.initialProjectDetails[i].h = 0;
                this.initialProjectDetails[i].m = 0;
                this.calculateproject0data();
                if(d>24){
                  this.hourGreaterThan24 = true;              
                  }else{
                  this.minGreaterThan24 = true;
                  }
                this.errorplacevalue = index;
                this.currentTooltipRow = row;
                setTimeout(() => {
                  this.hourGreaterThan24 = false;
                  this.minGreaterThan24 = false;
                  this.errorplacevalue = 7;
                  this.currentTooltipRow = 0;
                }, 2000);
              }, 100);
              a = Number(this.vacation[i].h) + Number(this.holidaydata[i].h) + Number(this.miscellaneous[i].h) + Number(this.defaultprojectDetails[i].h);
              b = Number(this.vacation[i].m) + Number(this.holidaydata[i].m) + Number(this.miscellaneous[i].m) + Number(this.defaultprojectDetails[i].m);
              break;

              case 3:
                setTimeout(() => {
                  this.miscellaneous[i].h = 0;
                  this.miscellaneous[i].m = 0;
                  this.calculateMiscellaneousData();
                  if(d>24){
                    this.hourGreaterThan24 = true;              
                    }else{
                    this.minGreaterThan24 = true;
                    }
                  this.errorplacevalue = index;
                  this.currentTooltipRow = row;
                  setTimeout(() => {
                    this.hourGreaterThan24 = false;
                    this.minGreaterThan24 = false;
                    this.errorplacevalue = 7;
                    this.currentTooltipRow = 0;
                  }, 2000);
                }, 100);
                a = Number(this.vacation[i].h) + Number(this.holidaydata[i].h) + Number(this.initialProjectDetails[i].h) + Number(this.defaultprojectDetails[i].h);
                b = Number(this.vacation[i].m) + Number(this.holidaydata[i].m) + Number(this.initialProjectDetails[i].m) + Number(this.defaultprojectDetails[i].m);
                break;
        }
      } else {
        this.exceedsTwentyFourHours = false;
        totalHour = totalHour + a;
        totalMinute = totalMinute + b;
      }
      let daytotalmin = 0;
      let daytotalhour = 0;
      daytotalmin = b % 60;
      daytotalhour = Math.floor(b / 60);
      daytotalhour = daytotalhour + a;
      switch (i) {
        case 0:
          this.day0NetHours = daytotalhour;
          this.day0NetMinutes = daytotalmin;
          break;

        case 1:
          this.day1NetHours = daytotalhour;
          this.day1NetMinutes = daytotalmin;
          break;

        case 2:
          this.day2NetHours = daytotalhour;
          this.day2NetMinutes = daytotalmin;
          break;

        case 3:
          this.day3NetHours = daytotalhour;
          this.day3NetMinutes = daytotalmin;
          break;

        case 4:
          this.day4NetHours = daytotalhour;
          this.day4NetMinutes = daytotalmin;
          break;

        case 5:
          this.day5NetHours = daytotalhour;
          this.day5NetMinutes = daytotalmin;
          break;

        case 6:
          this.day6NetHours = daytotalhour;
          this.day6NetMinutes = daytotalmin;
          break;
      }
    }
    this.enablingSaveangsubmit();
    let netTotalMinute = 0;
    let netTotalhour = 0;
    netTotalMinute = totalMinute % 60;
    netTotalhour = Math.floor(totalMinute / 60);
    netTotalhour = netTotalhour + totalHour;
    this.netTotalDaysHours = netTotalhour;
    this.netTotalDaysMinutes = netTotalMinute;
  }

  weekendSat: boolean = false;
  weekendSun: boolean = false;
  numberGreaterThan24: boolean = false;
  hourGreaterThan24: boolean = false;
  minGreaterThan24:boolean = false;
  showTextarea: boolean = false;
  entered: boolean = false;
  entered1: boolean = false;

  maketooltipshow(i: number, a = 0) {
    switch (i) {
      case 0:
        if (this.entered == false) {
          this.entered = true;
          this.weekendSat = true;
          this.weekendSun = false;
          this.currentTooltipRow = a;
          setTimeout(() => {
            this.weekendSat = false;
            this.currentTooltipRow = 0;
          }, 2000);
        }
        break;

      case 1:
        if (this.entered1 == false) {
          this.entered1 = true;
          this.weekendSun = true;
          this.weekendSat = false;
          this.currentTooltipRow = a;
          setTimeout(() => {
            this.weekendSun = false;
            this.currentTooltipRow = 0;
          }, 2000);
        }
        break;
    }
  }

  saveAndSubmitButtonEnable: boolean = false;

  enablingSaveangsubmit() {
    if (
      (this.day2NetHours != 0 || this.day2NetMinutes != 0) &&
      (this.day3NetHours != 0 || this.day4NetMinutes != 0) &&
      (this.day4NetHours != 0 || this.day4NetMinutes != 0) &&
      (this.day5NetHours != 0 || this.day5NetMinutes != 0) &&
      (this.day6NetHours != 0 || this.day6NetMinutes != 0) &&
      this.totaltextAreaLength != 0
    ) {
      this.saveAndSubmitButtonEnable = true;
    } else {
      this.saveAndSubmitButtonEnable = false;
    }
  }

  saveData() {
    this.api.postWeeklyData(this.apiResponse).subscribe((res) => {
      this.openSnackBar("Successfully saved the timesheet !!");
      console.log(res);
      setTimeout(() => {
        this.api.postWeeklystatus(postdata).subscribe((res)=>{
          this.openSnackBar2("Successfully saved the weekly status report");
          console.log(res);    setTimeout(() => {
            window.location.reload();
          }, 3000);
        })  
      }, 2500);

    });
    let a = [];
    a.push({project_id:this.generalTextAreaData.project_id ,report:this.generalTextAreaData.work_report});
    this.activeprojectData.forEach(element => {
      if(element.work_report.length != 0){
        a.push({project_id:element.project_id ,report:element.work_report})
      }
    });
    let wsrDate = this.datepipe.transform(this.days[6],'yyyy-MM-dd') ;
    let postdata = {
      is_final_submit:false,
      weekly_status:a,
      wsr_date:wsrDate
    }
  }

  finalSaveData() {    
    this.api.postWeeklyData(this.apiResponse).subscribe((res) => {
      this.openSnackBar("Successfully saved the timesheet !!");
      console.log(res);
      setTimeout(() => {
        this.api.postWeeklystatus(postdata).subscribe((res)=>{
          this.openSnackBar2("Successfully saved the weekly status report");
          console.log(res);    setTimeout(() => {
            window.location.reload();
          }, 3000);
        })  
      }, 2500);

    });
    let a = [];
    a.push({project_id:this.generalTextAreaData.project_id ,report:this.generalTextAreaData.work_report});
    this.activeprojectData.forEach(element => {
      if(element.work_report.length != 0){
        a.push({project_id:element.project_id ,report:element.work_report})
      }
    });
    let wsrDate = this.datepipe.transform(this.days[6],'yyyy-MM-dd') ;
    let postdata = {
      is_final_submit:true,
      weekly_status:a,
      wsr_date:wsrDate
    }
  }

  openSnackBar(data:string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['background-green1'];
    // config.duration = 2500;
    config.horizontalPosition = "right";
    config.verticalPosition ="top"
    let a = data;
    this._snackBar.open(a,"",config);
  }

  openSnackBar2(data:string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['background-green2'];
    config.duration = 2500;
    config.horizontalPosition = "right";
    config.verticalPosition ="top"
    let a = data;
    this._snackBar.open(a,"",config);
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    if (this.flag.buttonClicked != false) {
      this.flag.buttonClicked = false;
    } else if (this.flag.buttonClicked1 != false) {
      this.flag.buttonClicked1 = false;
    }
  }

  openDialog() {
    this.dialog
      .open(CloseProjectComponent)
      .afterClosed()
      .subscribe((res) => {
        this.calculateproject0data();
      });
  }


}
