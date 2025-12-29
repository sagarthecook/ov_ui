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
})
export class Party {

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
}
