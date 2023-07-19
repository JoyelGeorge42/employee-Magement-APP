import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlagService {

  constructor() { }
  buttonClicked:boolean =false;
  showRow:boolean = false;
  buttonClicked1:boolean =false;
  showRow1:boolean = false;
}
