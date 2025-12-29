<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-party',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Material
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss'],
=======
import { Component, OnInit } from '@angular/core';
import { IfDirective } from '../shared/if.directive';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModel } from '../models/dropdown.model';
import { UserService } from '../services/user.service';
import { APIResponse } from '../models/ApiResponse';
import { PartyService } from '../services/party.service';
import { Party } from '../models/party.model';

@Component({
  selector: 'PartyCreation',
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
    IfDirective,
  ],
  templateUrl: './party.html',
  styleUrl: './party.scss',
>>>>>>> 98397710cb715e8d374d188f68c425e053b2286e
})
export class PartyCreation implements OnInit {
  successMessage: string;
  errorMessage: string;
  partyCreationForm: FormGroup;
  loading = false;

<<<<<<< HEAD
  partyForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder) {
    // initialize the form
    this.partyForm = this.fb.group({
      partyName: ['', Validators.required],
      PartyPresident: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.partyForm.valid) {
      console.log(this.partyForm.value);
      this.successMessage = 'Submitted successfully!';
    } else {
      this.errorMessage = 'Please fill all required fields';
    }
  }

  onClear() {
    this.partyForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
=======
  constructor( private formBuilder: FormBuilder, private partyService: PartyService) {
    this.successMessage = '';
    this.errorMessage = '';
    this.partyCreationForm = this.formBuilder.group({
    });
  }

  ngOnInit() {
    this.partyCreationForm = this.formBuilder.group({
      name: ['', Validators.required],
      presidentName: ['', Validators.required],
      logoText: ['', Validators.required],
    });
  }
  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.partyCreationForm.invalid) {
      return;
    }
    this.loading = true;
    const formData = this.partyCreationForm.value;
    const partyData = new Party(
      formData.name,
      formData.presidentName,
      formData.logoText
    );

    this.partyService.saveParty(partyData).subscribe({
      next: (response: APIResponse<any>) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = 'Party created successfully.';
          this.partyCreationForm.reset();
        } else {
          this.errorMessage =
            response.message || 'Failed to create party. Please try again.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      },
    });
  }

  onClear() {
    this.partyCreationForm.reset();
>>>>>>> 98397710cb715e8d374d188f68c425e053b2286e
}
}








