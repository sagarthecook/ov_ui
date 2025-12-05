import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { IfDirective } from '../shared/if.directive'; // <-- added
import { LoginService } from '../services/login.service';

@Component({
  selector: 'login',
  imports: [ 
     CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    IfDirective
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  generateOtp(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }else {
      this.loginService.generateOtp(this.email?.value).subscribe(
        (response) => {
          this.successMessage = 'OTP has been sent to your email.';
       
          this.loading = false;
        },
        (error) => {
          this.errorMessage = 'Failed to send OTP. Please try again.';
             if(error.error && error.error.errors && error.error.errors.length > 0) {
            this.errorMessage = error.error.errors[0];
          }
          this.loading = false;
        }
      );
    }

  }
}