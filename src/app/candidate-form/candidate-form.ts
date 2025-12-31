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
import { D } from '@angular/cdk/keycodes';


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
  
  // Address-related properties
  countries: DropdownModel[] = [];
  states: DropdownModel[] = [];
  cities: DropdownModel[] = [];
  
  // Address grid and save functionality
  savedAddresses: any[] = [];
  addressButtonLoading = false;
  addressId: string = '';
  
  // Table configuration for address grid
  displayedColumns: string[] = [
    'index',
    'country',
    'state',
    'city',
    'street',
    'zip',
  ];
  
  incomeOptions: { id: string; name: string }[] = [
    { id: '0-5 lakh', name: '0-5 lakh' },
    { id: '5-10 lakh', name: '5-10 lakh' },
    { id: 'More than 10 lakh', name: 'More than 10 lakh' },
  ];
  maxDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private electionService: ElectionService,
    private partyService: PartyService,
    private candidateService: CandidateService
  ) {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''], // Remove required validation for middle name
      lastName: ['', Validators.required],
      occupation: ['', Validators.required],
      election: ['', Validators.required],
      party: ['', Validators.required],
      income: ['', Validators.required], // Change from null to empty string
      dob: ['', Validators.required],
      // Add address form group - make fields optional for now
      address: this.fb.group({
        countryId: [''], // Remove required for testing
        stateId: [''], // Remove required for testing
        cityId: [''], // Remove required for testing
        street: [''], // Remove required for testing
        zipCode: [''], // Remove required for testing
      }),
    });
    
    // Debug: Log form structure after initialization
    console.log('Form initialized:', this.registrationForm.value);
    console.log('Address form group:', this.registrationForm.get('address')?.value);
  }

  ngOnInit(): void {
        const todayDate = new Date();
        this.maxDate = new Date(
      todayDate.getFullYear() - 18,
      todayDate.getMonth(),
      todayDate.getDate()
    );
    console.log('CandidateForm ngOnInit called');
    console.log('Initial address form value:', this.registrationForm.get('address')?.value);
    this.loadElections();
    this.loadParties();
    this.loadCountries();
    // Initialize filtered lists
    this.states = [];
    this.cities = [];
    this.setLoading(false);
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

  // Getter for address form group
  get address() {
    const addressFormGroup = this.registrationForm.get('address');
    console.log('Address form group:', addressFormGroup?.value);
    return addressFormGroup;
  }

  // Load countries
  loadCountries(): void {
    console.log('Loading countries...');
    this.userService.getCountries().subscribe({
      next: (response: APIResponse<DropdownModel[]>) => {
        console.log('Countries API response:', response);
        if (response && response.data) {
          this.countries = response.data;
          console.log('Countries loaded:', this.countries.length, this.countries);
        } else {
          console.log('No countries data in response');
        }
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.errorMessage = 'Failed to load countries.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  // Handle country selection change
  onCountryChange(countryId: string): void {
    console.log('onCountryChange called with:', countryId);
    // Clear state and city selections
    this.address?.get('stateId')?.setValue('');
    this.address?.get('cityId')?.setValue('');
    this.states = [];
    this.cities = [];

    if (countryId) {
      console.log('Loading states for country:', countryId);
      this.userService.getStates(countryId).subscribe({
        next: (response: APIResponse<DropdownModel[]>) => {
          console.log('States API response:', response);
          if (response && response.data) {
            this.states = response.data;
            console.log('States loaded:', this.states.length, this.states);
          } else {
            console.log('No states data in response');
          }
        },
        error: (error) => {
          console.error('Error loading states:', error);
          this.errorMessage = 'Failed to load states.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    }
  }

  // Handle state selection change
  onStateChange(stateId: string): void {
    console.log('onStateChange called with:', stateId);
    // Clear city selection
    this.address?.get('cityId')?.setValue('');
    this.cities = [];

    if (stateId) {
      console.log('Loading cities for state:', stateId);
      this.userService.getCities(stateId).subscribe({
        next: (response: APIResponse<DropdownModel[]>) => {
          console.log('Cities API response:', response);
          if (response && response.data) {
            this.cities = response.data;
            console.log('Cities loaded:', this.cities.length, this.cities);
          } else {
            console.log('No cities data in response');
          }
        },
        error: (error) => {
          console.error('Error loading cities:', error);
          this.errorMessage = 'Failed to load cities.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
    }
  }
  
  // Save address functionality
  saveAddress(): void {
    this.errorMessage = null;
    this.successMessage = null;

    const addr = this.address;
    if (!addr) {
      this.errorMessage = 'Address form not available.';
      return;
    }

    if (addr.invalid) {
      addr.markAllAsTouched();
      this.errorMessage = 'Please fix address errors before saving.';
      return;
    }

    this.addressButtonLoading = true;
    this.userService.saveAddress(addr.value).subscribe({
      next: (response) => {
        // Resolve names for display
        const val = addr.value;
        const countryName =
          this.countries.find((c) => c.id === val.countryId)?.name ||
          val.countryId;
        const stateName =
          this.states.find((s) => s.id === val.stateId)?.name || val.stateId;
        const cityName =
          this.cities.find((ct) => ct.id === val.cityId)?.name || val.cityId;

        const displayObj = {
          countryId: val.countryId,
          countryName,
          stateId: val.stateId,
          stateName,
          cityId: val.cityId,
          cityName,
          street: val.street,
          zipCode: val.zipCode,
        };

        this.addressButtonLoading = false;
        this.successMessage = 'Address saved successfully.';
        this.addressId = response.data;

        // Add display object to table data
        this.savedAddresses.push(displayObj);

        // Clear address form after successful save
        addr.reset();
        this.states = [];
        this.cities = [];

        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to save address.';
        this.addressButtonLoading = false;
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
    if (this.registrationForm.invalid || !this.addressId) {
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
      wardAddress:{ id: this.addressId },
      dob: formValue.dob,

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
  
  // Debug helper methods
  getFormControlNames(): string[] {
    return Object.keys(this.registrationForm.controls);
  }
  
  getControlStatus(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (!control) return 'Control not found';
    
    if (controlName === 'address') {
      const addressGroup = control as FormGroup;
      const addressErrors = Object.keys(addressGroup.controls).map(key => {
        const addressControl = addressGroup.get(key);
        return `${key}: ${addressControl?.valid ? 'Valid' : 'Invalid(' + Object.keys(addressControl?.errors || {}).join(', ') + ')'}`;
      }).join(', ');
      return `[${addressErrors}]`;
    }
    
    return control.valid ? 'Valid' : `Invalid(${Object.keys(control.errors || {}).join(', ')})`;
  }

  onClear() {
    this.registrationForm.reset();
    this.successMessage = null;
    this.errorMessage = null;
    this.states = [];
    this.cities = [];
    this.savedAddresses = [];
    this.setLoading(false);
  }
}


