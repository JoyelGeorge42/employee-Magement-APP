import { Component, HostListener, OnInit } from '@angular/core';
import { TimesheetapiService } from '../services/timesheetapi.service';
import { MatDialog } from '@angular/material/dialog';
import { CloseProjectComponent } from '../close-project/close-project.component';
import { FlagService } from '../services/flag.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  IActiveProjects,
  ICumulative,
  IWeeklyData,
  IWeeklyStatus,
  IWeeklyStatusProjects,
  IWorkHours,
} from '../interfaces/interfaces';

@Component({
  selector: 'app-enrty',
  templateUrl: './enrty.component.html',
  styleUrls: ['./enrty.component.css'],
})
export class EnrtyComponent implements OnInit {
  apiResponse: Array<IWeeklyData> = [];
  weeklyStatus: Array<IWeeklyStatus> = [];
  weeklyData!: IWeeklyData;
  holidayData: Array<IWorkHours> = [];
  miscellaneous: Array<IWorkHours> = [];
  vacation: Array<IWorkHours> = [];
  activeProjects!: Array<IActiveProjects>;
  // project0Name!: string;
  days: Array<Date> = [];
  weekNumber!: number;
  isSaveAndSubmit: boolean = true;
  grossWH: Array<IWorkHours> = [];
  netWH: Array<IWorkHours> = [];
  inActiveProjectsList: Array<IActiveProjects> = [];
  activeProjectsList: Array<IActiveProjects> = [];
  totalPriorityLength!: number;
  generalTextAreaData!: IWeeklyStatusProjects;
  activeprojectData: Array<IWeeklyStatusProjects> = [];
  totaltextAreaLength!: number;

  /*
  * these variable is reesponsible to showing the tooltip
  */
  hourGreaterThan24: boolean = false;
  minGreaterThan24: boolean = false;
  halfDay: boolean = false;
  onVacation: boolean = false;
  isHoliday: boolean = false;
  weekendSat: boolean = false;
  weekendSun: boolean = false;
  numberGreaterThan24: boolean = false;
  currentRow!: number | undefined;
  currentColumn!: number | undefined;
  left: boolean = false;
  entered1: boolean = false;
  entered: boolean = false;


  totalHoursColumn: Array<ICumulative> = [
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
    {
      h: 0,
      m: 0,
    },
  ];

  constructor(
    public flag: FlagService,
    private api: TimesheetapiService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
    private _snackBar: MatSnackBar,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.settingValues();
  }

  visiblityTrueTextArea: Array<IWeeklyStatusProjects> = [];
  visiblityFalseTextArea: Array<IWeeklyStatusProjects> = [];

  /*
   * this function is using to initialize the data in entry timesheet 
   */
  settingValues() {
    this.api.getweeklyData().subscribe((res) => {
      this.apiResponse = res;
      this.weeklyData = this.apiResponse[0];
      console.log(this.weeklyData);
      this.holidayData = this.weeklyData.HOLIDAY.work_hours;
      this.miscellaneous = this.weeklyData.MISCELLANEOUS.work_hours;
      this.activeProjects = this.weeklyData.active_projects;
      this.vacation = this.weeklyData.VACATION.work_hours;
      this.weeklyData.days.forEach((item: any) => {
        this.days.push(new Date(item));
      });
      this.isSaveAndSubmit = this.weeklyData.enableSaveSubmit;
      this.grossWH = this.weeklyData.gross_working_hours;
      this.netWH = this.weeklyData.net_working_hours;
      this.weekNumber = this.weeklyData.week_number;
      this.activeProjects.forEach((element: IActiveProjects, index: number) => {
        if (element.visibilityFlag == false) {
          this.inActiveProjectsList.push(element);
        } else {
          this.activeProjectsList.push(element);
        }
      });
      this.totalPriorityLength = this.activeProjects.length + 1;
      this.test();
      this.addingAllColoumns();
    });

    this.api.getweeklystatus().subscribe((res) => {
      this.weeklyStatus = res;
      console.log('Before post', this.weeklyStatus);

      this.generalTextAreaData = this.weeklyStatus[0].GENERAL;
      this.activeprojectData = this.weeklyStatus[0].active_projects;

      let totalActiveWorkReportLength = 0;
      this.activeprojectData.forEach((element: IWeeklyStatusProjects) => {
        if (element.visibilityFlag == true) {
          this.visiblityTrueTextArea.push(element);
        } else {
          this.visiblityFalseTextArea.push(element);
        }
        totalActiveWorkReportLength = totalActiveWorkReportLength + element.work_report.length;
      });
      this.totaltextAreaLength =
        this.generalTextAreaData.work_report.length + totalActiveWorkReportLength;
    });
  }

  closeSelect: boolean = false;

  calculateLength() {
    let totalWorkReportLength = 0;
    this,
      this.activeprojectData.forEach((element: any) => {
        totalWorkReportLength = totalWorkReportLength + element.work_report.length;
      });
    this.totaltextAreaLength = this.generalTextAreaData.work_report.length + totalWorkReportLength;
    this.enablingSaveangsubmit();
  }

  addingRowValue(project: Array<IWorkHours>): string {
    let totalHours = 0;
    let totalMinutes = 0;

    project.forEach((element) => {
      totalHours += element.h;
      totalMinutes += Number(element.m);
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
    this.addingAllColoumns();
    return `${this._decimalPipe.transform(
      totalHours,
      '2.'
    )} : ${this._decimalPipe.transform(totalMinutes, '2.')}`;
  }

  addingAllColoumns(i?: number): any {
    if (i != undefined) {
      this.addingAllColoumns()
      if (this.totalHoursColumn[i].h > 24 || (this.totalHoursColumn[i].h == 24 && this.totalHoursColumn[i].m != 0)) {
        return 0;
      }
    } else {
      let netTotalHours = 0;
      let netTotalMinutes = 0;
      this.totalHoursColumn.forEach((element: ICumulative, index) => {
        if (index == 7) {
          element.m = netTotalMinutes % 60;
          element.h = Math.floor(netTotalMinutes / 60);
          element.h = netTotalHours + element.h;
        } else {
          let currentNetHours = 0;
          let currentNetMinutes = 0;
          let convertedNetHours = 0;
          let convertedNetMinutes = 0;
          this.inActiveProjectsList.forEach((item: IActiveProjects) => {
            currentNetHours = currentNetHours + item.work_hours[index].h;
            currentNetMinutes = currentNetMinutes + Number(item.work_hours[index].m);
          });
          this.activeProjectsList.forEach((item: IActiveProjects) => {
            if (item.visibilityFlag == true) {
              convertedNetHours = convertedNetHours + item.work_hours[index].h;
              convertedNetMinutes = convertedNetMinutes + Number(item.work_hours[index].m);
            }
          });
          let totalHours =
          currentNetHours +
          convertedNetHours +
            Number(this.vacation[index]?.h) +
            Number(this.miscellaneous[index]?.h) +
            Number(this.holidayData[index]?.h);
          let totalMInutes =
          currentNetMinutes +
          convertedNetMinutes +
            Number(this.vacation[index]?.m) +
            Number(this.miscellaneous[index]?.m) +
            Number(this.holidayData[index]?.m);

          element.m = totalMInutes % 60;
          element.h = Math.floor(totalMInutes / 60);
          element.h = totalHours + element.h;
          netTotalHours = element.h + netTotalHours;
          netTotalMinutes = element.m + netTotalMinutes;
        }
      });
      this.enablingSaveangsubmit();
    }
  }

  test(index?: number) {
    let count = 0;
    if (index != undefined) {
      this.inActiveProjectsList[index!].visibilityFlag = true;
    }
    this.activeProjects.forEach((element) => {
      if (element.visibilityFlag == true) {
        count = count + 1;
      }
    });
    if (this.activeProjects.length == count) {
      this.closeSelect = true;
    } else {
      this.closeSelect = false;
    }
  }

  isGreaterThan24(hourOrMinute: string,
    i: number,
    arr: Array<IWorkHours>,
    column?: number,
    priority?: number
  ) {
    if (i == 0 || i == 1) {

    }
    if (arr[i].h > 24 || arr[i].h == null) {
      setTimeout(() => {
        arr[i].h = 0;
      }, 10);
      this.numberGreaterThan24 = true;
      this.currentRow = i;
      if (priority != undefined) {
        this.currentColumn = priority;
      } else {
        this.currentColumn = column;
      }
      setTimeout(() => {
        this.numberGreaterThan24 = false;
        this.currentRow = undefined;
        this.currentColumn = undefined;
      }, 2000);
    }
    if (this.addingAllColoumns(i) == 0) {
      console.log(this.addingAllColoumns(i));
      if (hourOrMinute == 'h') {
        setTimeout(() => {
          arr[i].h = 0;
          this.addingRowValue(arr);
          this.hourGreaterThan24 = true;
          this.currentRow = i;
          if (priority != undefined) {
            this.currentColumn = priority;
          } else {
            this.currentColumn = column;
          }
        }, 1);
        setTimeout(() => {
          this.hourGreaterThan24 = false;
          this.currentColumn = undefined;
          this.currentRow = undefined;
        }, 2000);
      } else {
        setTimeout(() => {
          arr[i].m = 0;
          this.addingRowValue(arr);
          this.minGreaterThan24 = true;
          this.currentRow = i;
          if (priority != undefined) {
            this.currentColumn = priority;
          } else {
            this.currentColumn = column;
          }
        }, 1);
        setTimeout(() => {
          this.minGreaterThan24 = false;
          this.currentColumn = undefined;
          this.currentRow = undefined;
        }, 2000);
      }
    }
    if (this.vacation[i].h != 0) {
      if (this.vacation[i].h == 5) {
        if (arr[i].h > 5 || arr[i].h == 5 && arr[i].m != 0)
          setTimeout(() => {
            this.addingRowValue(arr);
            this.halfDay = true;
            this.currentRow = i;
            if (priority != undefined) {
              this.currentColumn = priority;
            } else {
              this.currentColumn = column;
            }
            if (hourOrMinute == 'h') {
              this.left = true
            }
          }, 1);
        setTimeout(() => {
          this.halfDay = false;
          this.currentColumn = undefined;
          this.currentRow = undefined;
          this.left = false;
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.addingRowValue(arr);
          this.onVacation = true;
          this.currentRow = i;
          if (priority != undefined) {
            this.currentColumn = priority;
          } else {
            this.currentColumn = column;
          }
          if (hourOrMinute == 'h') {
            this.left = true
          }
        }, 1);
        setTimeout(() => {
          this.onVacation = false;
          this.currentColumn = undefined;
          this.currentRow = undefined;
          this.left = false;
        }, 2000);
      }
    }
    if (this.holidayData[i].h != 0) {
      setTimeout(() => {
        this.addingRowValue(arr);
        this.isHoliday = true;
        this.currentRow = i;
        if (priority != undefined) {
          this.currentColumn = priority;
        } else {
          this.currentColumn = column;
        }
        if (hourOrMinute == 'h') {
          this.left = true
        }
      }, 1);
      setTimeout(() => {
        this.isHoliday = false;
        this.currentColumn = undefined;
        this.currentRow = undefined;
        this.left = false;
      }, 2000);
    }
  }

  maketooltipshow(index: number, column?: number, priority?: number) {
    if (index == 0 || index == 1) {
      if (index == 0) {
        if (!this.entered) {
          this.weekendSat = true;
          this.currentRow = index;
          if (priority != undefined) {
            this.currentColumn = priority;
          } else {
            this.currentColumn = column;
          }
          setTimeout(() => {
            this.weekendSat = false;
            this.currentRow = undefined;
            this.currentColumn = undefined;
          }, 2000);
          this.entered = true
        }
      }
      else {
        if (!this.entered1) {
          this.weekendSun = true;
          this.currentRow = index;
          if (priority != undefined) {
            this.currentColumn = priority;
          } else {
            this.currentColumn = column;
          }
          setTimeout(() => {
            this.weekendSun = false;
            this.currentRow = undefined;
            this.currentColumn = undefined;
          }, 2000);
          this.entered1 = true;
        }
      }
    }
  }

  saveAndSubmitButtonEnable: boolean = false;

  enablingSaveangsubmit() {
    let count = 0;
    if (this.totaltextAreaLength != 0) {
      this.totalHoursColumn.forEach((element, index) => {
        if (index >= 2 && index < 7) {
          if (element.h != 0 || element.m != 0) {
            count = count + 1;
          }
        }
      });
      if (count == 5) {
        this.saveAndSubmitButtonEnable = true;
      } else {
        this.saveAndSubmitButtonEnable = false;
      }
    } else {
      this.saveAndSubmitButtonEnable = false;
    }
  }

  saveData() {
    let toBepushedProjects = [];
    toBepushedProjects.push({
      project_id: this.generalTextAreaData.project_id,
      report: this.generalTextAreaData.work_report,
    });
    this.activeprojectData.forEach((element) => {
      if (element.visibilityFlag == true) {
        toBepushedProjects.push({ project_id: element.project_id, report: element.work_report });
      }
    });

    let wsrDate = this.datepipe.transform(this.days[6], 'yyyy-MM-dd');
    let postdata = {
      is_final_submit: false,
      weekly_status: toBepushedProjects,
      wsr_date: wsrDate,
    };
    this.api.postWeeklyData(this.apiResponse).subscribe((res) => {
      this.openSnackBar('Successfully saved the timesheet !!');
      if(res.success==true){
        this.AfterSave();
       }else{

       }
    });
    this.api.postWeeklystatus(postdata).subscribe((res) => {
      if(res.success==true){
       this.AfterSave();
      }else{

      }
    });
 
  }
AfterSave(){
    this.api.getweeklyData().subscribe((res) => {
      console.log("ress................",res[0].active_projects);
      this.isSaveAndSubmit = res[0].enableSaveSubmit;

        this.activeProjects = [];
        this.activeProjects = res[0].active_projects;
        this.inActiveProjectsList = [];
        this.activeProjectsList = [];
        this.activeProjects.forEach((element: IActiveProjects) => {
          if (element.visibilityFlag == true) {
            this.activeProjectsList.push(element);
          }
          else{
            this.inActiveProjectsList.push(element);
          }
      });
    });

    this.openSnackBar('Successfully saved the weekly status report',true);
}
  finalSaveData() {
    let toBePushedProjects = [];
    toBePushedProjects.push({
      project_id: this.generalTextAreaData.project_id,
      report: this.generalTextAreaData.work_report,
    });
    this.activeprojectData.forEach((element) => {
      if (element.work_report.length != 0) {
        toBePushedProjects.push({ project_id: element.project_id, report: element.work_report });
      }
    });
    let wsrDate = this.datepipe.transform(this.days[6], 'yyyy-MM-dd');
    let postdata = {
      is_final_submit: true,
      weekly_status: toBePushedProjects,
      wsr_date: wsrDate,
    };
    this.api.postWeeklyData(this.apiResponse).subscribe((res) => {
      this.openSnackBar('Successfully saved the timesheet !!');
      console.log(res);
    });
    this.api.postWeeklystatus(postdata).subscribe((res) => {
      console.log(res);
    });
    this.api.getweeklyData().subscribe((res) => {
      this.apiResponse = res;
      this.isSaveAndSubmit = this.apiResponse[0].enableSaveSubmit;
    });
    setTimeout(() => {
      this.openSnackBar('Successfully saved the weekly status report',true);
    }, 2500);
  }

  closeDropDown: boolean = false;

  test2(i?: number) {
    this.flag.buttonClicked1 = false;
    let count = 0;
    if (i != undefined) {
      this.visiblityFalseTextArea[i!].visibilityFlag = true;
    }
    this.visiblityFalseTextArea.forEach((element) => {
      if (element.visibilityFlag == true) {
        count = count + 1;
      }
    });
    if (this.visiblityFalseTextArea.length == count) {
      this.closeDropDown = true;
    } else {
      this.closeDropDown = false;
    }
  }

  openSnackBar(data: string,changePosition:boolean = false) {
    const config = new MatSnackBarConfig();
    config.panelClass = [changePosition?'background-green2':'background-green1'];
    config.duration = 2500;
    config.horizontalPosition = 'right';
    config.verticalPosition = 'top';
    let snackbardata = data;
    this._snackBar.open(snackbardata, '', config);
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    if (this.flag.buttonClicked != false) {
      this.flag.buttonClicked = false;
    } else if (this.flag.buttonClicked1 != false) {
      this.flag.buttonClicked1 = false;
    }
  }

  openDialog(i: number) {
    this.dialog
      .open(CloseProjectComponent)
      .afterClosed()
      .subscribe((res) => {
        this.addingAllColoumns();
        if (res == 'Cleared') {
          this.activeProjects.forEach((element) => {
            if (i == element.priority) {
              element.visibilityFlag = false;
              element.work_hours.forEach((time) => {
                time.h = 0;
                time.m = 0;
              });
              if (this.activeProjectsList.includes(element)) {
                this.activeProjectsList.splice(
                  this.activeProjectsList.indexOf(element),
                  1
                );
              }
              if (!this.inActiveProjectsList.includes(element)) {
                this.inActiveProjectsList.push(element);
              }
            }
          });
          this.test();
        }
      });
  }
}
