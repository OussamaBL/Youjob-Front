import { Component } from '@angular/core';
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
