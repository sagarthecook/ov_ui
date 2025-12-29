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
})
export class PartyCreation implements OnInit {
  successMessage: string;
  errorMessage: string;
  partyCreationForm: FormGroup;
  loading = false;

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
 // optionally auto-clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
      },
    });
  }

  onClear() {
    this.partyCreationForm.reset();
}
}
