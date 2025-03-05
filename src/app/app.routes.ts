import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import {redirectIfAuthenticateGuard} from "./guards/redirect-if-authenticate.guard";

export const routes: Routes = [
  { path: '', component: HomeComponent ,
  /*    canActivate: [redirectIfAuthenticateGuard]*/
  },
  { path: 'register', component: SignupComponent ,
    canActivate: [redirectIfAuthenticateGuard]
  },
  { path: 'login', component: LoginComponent ,
    canActivate: [redirectIfAuthenticateGuard]
  },
  { path: 'forgetPassword', component: ForgetPasswordComponent ,
    canActivate: [redirectIfAuthenticateGuard]
  },
  { path: 'reset-password', component: ResetPasswordComponent ,
    canActivate: [redirectIfAuthenticateGuard]
  },
  { path: 'profile', component: ResetPasswordComponent ,
    canActivate: [redirectIfAuthenticateGuard]
  },


];
