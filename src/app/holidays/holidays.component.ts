import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IHolidayList } from '../interfaces/interfaces';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent {
  holidaylist!:Array<IHolidayList>;
  constructor(private api:ApiService){
    this.api.getHolidayData().subscribe((res)=>{
      console.log(res);
      
      this.holidaylist = res;      
    })
  }

}
