import { Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AnnounceComponent } from './components/annonce/announce.component';
import { CreateAnnounceComponent } from './components/create-annonce/create-announce.component';

import {redirectIfAuthenticateGuard} from "./guards/redirect-if-authenticate.guard";
import {authGuard} from "./guards/auth.guard";
import {annonceGuard} from "./guards/annonce.guard";
import {UpdateAnnounceComponent} from "./components/update-annonce/update-announce.component";
import {HistoryAnnounceComponent} from "./components/history-annonce/history-annonce.component";
import {AnnouncePageComponent} from "./components/announce-page/announce-page.component";
import {AnnounceListComponentComponent} from "./components/annonce-list-component/announce-list-component.component";
import {ConsultationComponent} from "./components/consultation/consultation.component";
import {MesConsultationComponent} from "./components/mes-consultation/mes-consultation.component";
import {handymanGuard} from "./guards/handyman.guard";
import {ProjectComponent} from "./components/project/project.component";

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
  { path: 'profile', component: ProfileComponent ,
    canActivate: [authGuard]
  },
  { path: 'announce', component: AnnounceComponent ,
    canActivate: [annonceGuard]
  },
  { path: 'createAnnounce', component: CreateAnnounceComponent ,
    canActivate: [annonceGuard]
  },
  { path: 'updateAnnounce/:id', component: UpdateAnnounceComponent ,
    canActivate: [annonceGuard]
  },
  { path: 'historyAnnounce', component: HistoryAnnounceComponent ,
    canActivate: [annonceGuard]
  },
  { path: 'announcePage/:id', component: AnnouncePageComponent ,
    /*canActivate: [annonceGuard]*/
  },
  { path: 'announceSearch', component: AnnounceListComponentComponent ,
    /*canActivate: [annonceGuard]*/
  },
  { path: 'consultation/:id', component: ConsultationComponent ,
    canActivate: [annonceGuard]
  },
  { path: 'mesConsultation', component: MesConsultationComponent ,
    canActivate: [handymanGuard]
  },
  { path: 'project/:id', component: ProjectComponent ,
    canActivate: [authGuard]
  },
];
