import {Component, OnInit} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth/auth.service";
import Swal from "sweetalert2";
import {map, Observable} from "rxjs";
@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NgIf],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  menuOpen: boolean = false;
  userRole: string | null = null; // Allow null as a possible value

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getUserData().subscribe({
        next: (user) => {
          this.userRole = user.role;
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      });
    } else {
      console.warn("User not authenticated.");
      this.userRole = null; // or a default value
    }
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  logOut() {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Logout successfully.',
      confirmButtonText: 'OK'
    });
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isAuthenticate(): boolean {
    return this.authService.isAuthenticated();
  }
  getRole(): Observable<string> {
    return this.authService.getUserData().pipe(
      map((user) => user.role)
    );
  }
}
