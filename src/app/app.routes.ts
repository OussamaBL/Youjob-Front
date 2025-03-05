import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
export const routes: Routes = [
  { path: '', component: SignupComponent ,
    /*canActivate: [redirectIfAuthenticateGuard] */
  },
  { path: 'register', component: SignupComponent ,
    /*canActivate: [redirectIfAuthenticateGuard] */
  },
  { path: 'login', component: LoginComponent ,
    /*canActivate: [redirectIfAuthenticateGuard] */
  },
  { path: 'forgetPassword', component: ForgetPasswordComponent ,
    /*canActivate: [redirectIfAuthenticateGuard] */
  },



];
