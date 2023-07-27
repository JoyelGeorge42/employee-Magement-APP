import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

export const AuthGuard = () =>{
  const authService = inject(LoginService);
  const router = inject(Router);
  if(authService.isUserLogined() == true){
    return true;
  }
  router.navigate(['/login']);
  return false;  
};


export const AuthGuard2 = () =>{
  const authService = inject(LoginService);
  const router = inject(Router);
  if(authService.isUserLogined() == false){
    return true;
  }
  router.navigate(['/entry']);
  return false;  
};