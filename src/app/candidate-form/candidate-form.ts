import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../services/user.service';
import { APIResponse } from '../models/ApiResponse';
import { DropdownModel } from '../models/dropdown.model';
import { ElectionService } from '../services/election.service'; 

@Component({
  selector: 'candidate-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatGridListModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './candidate-form.html',
  styleUrls: ['./candidate-form.scss'],
})

export class CandidateForm implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  electionList: DropdownModel[] = [];
partyList: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private electionService: ElectionService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      occupation: ['', Validators.required],
      elections: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.electionService.getElections().subscribe({
      next: (response: APIResponse<DropdownModel[]>) => {
        this.electionList = response.data;
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
      },
    });
  }
  loadparty(): void {
    this.electionService.getparty().subscribe({
      next: (response: APIResponse<DropdownModel[]>) => {
        this.electionList = response.data;
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
      },
    });
  }

  

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
  }
  onclick(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.registrationForm.value;
}
}
