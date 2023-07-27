import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlagService {

  constructor() { }
  loaderShow:boolean = false;
  buttonClicked:boolean =false;
  showRow:number = 4;
  buttonClicked1:boolean =false;
  showRow1:boolean = false;
  deleteProject0Dta = false;
}
