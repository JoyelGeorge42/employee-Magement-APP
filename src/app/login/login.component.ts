import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

constructor(private loginService:LoginService){}

loginForm = new FormGroup({
  email: new FormControl("",[Validators.email, Validators.required]),
  password: new FormControl("",[Validators.required])  
});

get email(){
  return this.loginForm.get("email");
}

get password(){
  return this.loginForm.get("password");
}

  submit(){
    this.loginService.authenticateUser(this.loginForm.value).subscribe((res)=>{
      if(res.success == true){
        this.loginService.isUserAuthenticated = true;
        console.log("Logged In");
        localStorage.setItem("token",res.results.token)
      }
      else{
        console.log("incorrect details");
      }
    })
  }

}
