import {Component, OnInit} from '@angular/core';
import {Consultation} from "../../models/consultation.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AnnonceService} from "../../services/annonce/annonce.service";
import {ConsultationService} from "../../services/consultation/consultation.service";
import {AuthService} from "../../services/auth/auth.service";
import {Annonce} from "../../models/annonce.model";
import Swal from "sweetalert2";
import Sal from "sweetalert2";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {User} from "../../models/User.model";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {ProjectService} from "../../services/project/project.service";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    NgIf,
    NgClass,
    NgStyle
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{
  consultation!: Consultation;
  loading: boolean = false;
  errorMessage = '';
  user: User | null = null;

  constructor(private route: ActivatedRoute,private consultationService :ConsultationService,private projectService:ProjectService, private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserData().subscribe({
      next: (data) => {
        this.user = { ...data, phoneNumber: data.phoneNumber ?? '' };
      },
      error: () => {
        this.user = null;
      }
    });
    this.loadConsultation();
  }
  loadConsultation() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.consultationService.fetchConsultationByID(params.get('id')).subscribe({
          next: (consultation1: Consultation) => {
            this.consultation = consultation1;
            console.log("consultation Data:", consultation1);
            this.loading = false;
          },
          error: (err) => {
            this.errorMessage = 'Error fetching consultation details.';
            this.loading = false;
            Swal.fire({ icon: 'error', title: 'Error', text: this.errorMessage });
            console.error(err);
          }
        });
      } else {
        this.loading = false;
        this.errorMessage = 'Invalid Consultation ID.';
        Swal.fire({ icon: 'error', title: 'Error', text: this.errorMessage });
      }
    });
  }
  confirmProject(projectID:number):void{
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Confirm this project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.confirmProject(projectID).subscribe({
          next: () => {
            Sal.fire('Confirm!', 'Your Project has been Confirm.', 'success');
          },
          error: (err) => {
            Sal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }
  completeProject(projectID:number):void{
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Confirm this project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.completeProject(projectID).subscribe({
          next: () => {
            Sal.fire('Confirm!', 'Your Project has been Confirm.', 'success');
          },
          error: (err) => {
            Sal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }
  deleteProject(projectID:number):void{
    Sal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Delete this Project?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(projectID).subscribe({
          next: () => {
            Sal.fire('Confirm!', 'Your Project has been Deleted.', 'success');
          },
          error: (err) => {
            Sal.fire('Error', err.message, 'error');
          },
        });
      }
    });
  }
}
