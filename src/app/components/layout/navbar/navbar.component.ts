import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth/auth.service";
@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NgIf],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isAuthenticate(): boolean {
    return this.authService.isAuthenticated();
  }
}
