import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {NgIf} from "@angular/common";
@Component({
  selector: 'app-navbar',
  imports: [RouterModule, NgIf],
  standalone:true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

}
