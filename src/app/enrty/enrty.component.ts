import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimesheetapiService } from '../timesheetapi.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-enrty',
  templateUrl: './enrty.component.html',
  styleUrls: ['./enrty.component.css']
})
export class EnrtyComponent {
@ViewChild('hourvalue') hourValues0:ElementRef | any;

  weeklydata:any;
  holidaydata:any;
  miscellaneous:any;
  vacation:any;
  activeprojects:any;
  days:any[]=[];
  weekNumber:any;
  isSaveAndSubmit!:boolean;
  gross_working_hours:any;
  net_working_hours:any;
  defaultprojectDetails:any;
  project1nettotalHours:any;
  project1nettotalMinutes:any;
  cummilativenettotalHours:any;
  cummilativenettotalMinutes:any;
  holidaynettotalHours:any;
  holidaynettotalMinutes:any;
  vacationnettotalHours:any;
  vacationnettotalMinutes:any;
  day0NetHours:any;
  day0NetMinutes:any;
  day1NetHours:any;
  day1NetMinutes:any;
  day2NetHours:any;
  day2NetMinutes:any;
  day3NetHours:any;
  day3NetMinutes:any;
  day4NetHours:any;
  day4NetMinutes:any;
  day5NetHours:any;
  day5NetMinutes:any;
  day6NetHours:any;
  day6NetMinutes:any;
  netTotalDaysHours:any;
  netTotalDaysMinutes:any;
  projectName!:string;
  cummilativeProject1Hours:any;
  cummilativeProject1Minutes:any;

constructor(private api:TimesheetapiService, private fb:FormBuilder) {
  this.settingValues();
}


settingValues(){
  this.api.getweeklydata().subscribe((res)=>{
    this.weeklydata = res[0];
    console.log(this.weeklydata);
    this.holidaydata = this.weeklydata.HOLIDAY.work_hours;
    this.miscellaneous = this.weeklydata.MISCELLANEOUS.work_hours;
    this.activeprojects = this.weeklydata.active_projects;
    this.vacation = this.weeklydata.VACATION.work_hours;
    this.weeklydata.days.forEach((item:any) => {
      this.days.push(new Date(item))
    });;
    this.isSaveAndSubmit = this.weeklydata.enableSaveSubmit;
    this.gross_working_hours = this.weeklydata.gross_working_hours;
    this.net_working_hours = this.weeklydata.net_working_hours;
    this.weekNumber = this.weeklydata.week_number;
    this.projectName = this.activeprojects[1].project_name;
    this.cummilativeProject1Hours = this.activeprojects[1].cumulative.h
    this.cummilativeProject1Minutes = this.activeprojects[1].cumulative.m;
    this.defaultprojectDetails = this.activeprojects[1].work_hours;
    console.log(this.defaultprojectDetails);
    this.calculateProject1Data();
    this.calculateMiscellaneousData();
    this.calculateHolidayData();    
    this.calculateVacationData();
    this.calculateByDay();
  })
}

calculateProject1Data(){  
  this.project1nettotalHours = 0;
  this.project1nettotalMinutes = 0;
  var a = 0;
  var b = 0;
  var minutes = 0;
  var hours = 0; 
  this.defaultprojectDetails.forEach((item:any) => {
    a = item.h + a;
    b =Number(item.m) + b ;
  });  
  minutes = b % 60;
  hours = Math.floor(b / 60);
  hours = hours + a;
  this.project1nettotalHours = hours;
  this.project1nettotalMinutes = minutes;  
  this.calculateByDay();
}

calculateMiscellaneousData(){  
  this.cummilativenettotalHours = 0;
  this.cummilativenettotalMinutes = 0;
  var a = 0;
  var b = 0;
  var minutes = 0;
  var hours = 0; 
  this.miscellaneous.forEach((item:any) => {
    a = item.h + a;
    b =Number(item.m) + b ;
  });
  minutes = b % 60;
  hours = Math.floor(b / 60);
  hours = hours + a;
  this.cummilativenettotalHours = hours;
  this.cummilativenettotalMinutes = minutes;  
  this.calculateByDay();
}

calculateHolidayData(){
  this.holidaynettotalHours = 0;
  this.holidaynettotalMinutes = 0;
  var a = 0;
  var b = 0;
  var minutes = 0;
  var hours = 0; 
  this.holidaydata.forEach((item:any) => {
    a = item.h + a;
    b =Number(item.m) + b ;
  });
  minutes = b % 60;
  hours = Math.floor(b / 60);
  hours = hours + a;
  this.holidaynettotalHours = hours;
  this.holidaynettotalMinutes = minutes;  
  this.calculateByDay();
}

calculateVacationData(){
  this.vacationnettotalHours = 0;
  this.vacationnettotalMinutes = 0;
  var a = 0;
  var b = 0;
  var minutes = 0;
  var hours = 0; 
  this.vacation.forEach((item:any) => {
    a = item.h + a;
    b = item.m + b ;
  });
  minutes = b % 60;
  hours = Math.floor(b / 60);
  hours = hours + a;
  this.vacationnettotalHours = hours;
  this.vacationnettotalMinutes = minutes;  
  this.calculateByDay();
}

calculateByDay(){
let totalHour = 0;
let totalMinute = 0;
  for(let i = 0; i<7 ; i++){   
    var a = 0;
    var b = 0;
    a = Number(this.defaultprojectDetails[i].h) + Number(this.vacation[i].h) + Number(this.holidaydata[i].h) + Number(this.miscellaneous[i].h);
    b = Number(this.defaultprojectDetails[i].m)+ Number(this.vacation[i].m) + Number(this.holidaydata[i].m )+ Number(this.miscellaneous[i].m);
    totalHour = totalHour + a;
    totalMinute = totalMinute + b;
    switch(i){
      case 0 : 
        this.day0NetHours = a;
        this.day0NetMinutes = b;
        break;

      case 1 : 
        this.day1NetHours = a;
        this.day1NetMinutes = b;
        break;

      case 2 : 
        this.day2NetHours = a;
        this.day2NetMinutes = b;
        break;

      case 3 : 
        this.day3NetHours = a;
        this.day3NetMinutes = b;
        break;

      case 4 : 
        this.day4NetHours = a;
        this.day4NetMinutes = b;
        break;

      case 5 : 
        this.day5NetHours = a;
        this.day5NetMinutes = b;
        break;

      case 6 : 
        this.day6NetHours = a;
        this.day6NetMinutes = b;
        break;
    }
  }
  let netTotalMinute = 0;
  let netTotalhour = 0;
  netTotalMinute = totalMinute % 60
  netTotalhour = Math.floor(totalMinute /60)
  netTotalhour = netTotalhour + totalHour;
  this.netTotalDaysHours = netTotalhour;
  this.netTotalDaysMinutes = netTotalMinute;
  console.log(this.day0NetHours,":",this.day0NetMinutes); 
}

}