import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LoginService } from '../login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  serverresponse:string='';

constructor(private loginService:LoginService ,private router:Router){}

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

getErrorMessage() {
  if (this.email?.hasError('required')) {
    return 'You must enter a value';
  }

  return this.email?.hasError('email') ? 'Not a valid email' : '';
}
  submit(){
    if(this.loginForm.valid){
    this.loginService.authenticateUser(this.loginForm.value).subscribe((res)=>{
      console.log(res);
      if(res.success == true){
        this.loginService.changeflag();
        console.log("Logged In");
        localStorage.setItem("token",res.results.token);
        this.router.navigate(["/entry"]);
      }
      else{
        console.log("incorrect details");
      }
    },
    error =>{
      console.log(error);
     if (error.status == 417){
      this.serverresponse = error.error.results.email[0];
     }
     else{
      this.serverresponse = "Incorrect Credentials";
    }
    })

  }else{
    this.loginForm.markAllAsTouched();
  }
}

}
