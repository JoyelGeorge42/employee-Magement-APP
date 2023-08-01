import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IPolicyList } from '../interfaces/interfaces';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent {
  policyData!:Array<IPolicyList>;
  constructor(private api:ApiService){
    this.api.getPolicyData().subscribe((res)=>{
      console.log(res);
      this.policyData = res.results;
    })
  }

}
