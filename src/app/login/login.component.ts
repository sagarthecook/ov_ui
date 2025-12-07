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
import { Router } from '@angular/router';

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
  otpForm: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  screenNumber = 1;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router : Router
  ) {
    this.otpForm = this.formBuilder.group({});
    this.loginForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.screenNumber = 1;
    this.otpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.loginForm = this.formBuilder.group({
      userId: ['', [Validators.required, Validators.email]],
      otp : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
 }

  get email() {
    return this.otpForm.get('email');
  }


  navigateToUsercreation(): void{ 
    this.router.navigate(['/userregistration']);
    
  }


  login() : void {
    debugger;
    // Login logic here
    this.loginService.login(this.otpForm.value.email, this.loginForm.value.otp).subscribe(
      (response) => {
        this.successMessage = 'Login successful!';  
        this.errorMessage = '';
        // Further actions on successful login
        this.router.navigate(['/home']);
      },
      (errorResponse) => {
        this.errorMessage = 'Login failed. Please try again.';
        this.successMessage = '';
        if(errorResponse.error && errorResponse.error.errors && errorResponse.error.errors.length > 0) {
          this.errorMessage = errorResponse.error.errors[0];
        }
      }
    );

  }

  generateOtp(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    if (this.otpForm.invalid) {
      return;
    }else {
      this.loginService.generateOtp(this.email?.value).subscribe(
        (response) => {
          this.successMessage = 'OTP has been sent to your email.';
       this.screenNumber = 2;
          this.loading = false;
        },
        (errorResponse) => {
          this.errorMessage = 'Failed to send OTP. Please try again.';
             if(errorResponse.error && errorResponse.error.errors && errorResponse.error.errors.length > 0) {
               this.errorMessage = errorResponse.error.errors[0];
            }
          this.loading = false;
        }
      );
    }

  }
}