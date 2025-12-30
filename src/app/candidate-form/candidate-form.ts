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
import { PartyService } from '../services/party.service';
import { CandidateService } from '../services/candidate.service';


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
   incomeOptions: { id: number; name: string }[] = [
    { id: 1, name: '0-5 lakh' },
    { id: 2, name: '5-10 lakh' },
    { id: 3, name: 'More than 10 lakh' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private electionService: ElectionService,
    private partyService: PartyService,
    private candidateService: CandidateService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      occupation: ['', Validators.required],
      election: ['', Validators.required],
      party: ['', Validators.required],
      income: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadElections();
    this.loadParties();
    this.setLoading(false);
  }

  loadParties(): void {
    // ASH and SAM pls add code
  }

  loadParties(): void {
    this.successMessage = null;
    this.partyService.getParty().subscribe({
      next: (response: APIResponse<DropdownModel[]>) => {
        this.partyList = response.data;
      },
      error: () => {
        this.errorMessage = 'Failed to load parties.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  loadElections(): void {
    this.successMessage = null;
    this.electionService.getElections().subscribe({
      next: (response: APIResponse<DropdownModel[]>) => {
        this.electionList = response.data;
      },
      error: () => {
        this.errorMessage = 'Failed to load elections.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
  

  private setLoading(isLoading: boolean): void {
    this.loading = isLoading;
    if (isLoading) {
      this.registrationForm.disable();
    } else {
      this.registrationForm.enable();
    }
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    this.setLoading(true);
    const formValue = this.registrationForm.value;
    const payload = {
      firstName: formValue.firstName,
      middleName: formValue.middleName,
      lastName: formValue.lastName,
      occupation: formValue.occupation,
      income: formValue.income,
      election: { id: formValue.election },
      party: { id: formValue.party },
    };
    this.candidateService.saveCandidate(payload as any).subscribe({
      next: () => {
        this.successMessage = 'Candidate saved successfully.';
        this.registrationForm.reset();
        this.setLoading(false);
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to save candidate.';
        this.setLoading(false);
        setTimeout(() => (this.errorMessage = null), 3000);
      },
    });
  }

  onClear() {
    this.registrationForm.reset();
    this.setLoading(false);
  }
}


