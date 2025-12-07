import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../services/user.service';
import { APIResponse } from '../models/ApiResponse';
import { Country } from '../models/Contry';

@Component({
  selector: 'userregistration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './userregistration.html',
  styleUrls: ['./userregistration.scss']
})
export class UserRegistration implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  constructor(private formBuilder: FormBuilder,private userService: UserService) {
    this.registrationForm = this.formBuilder.group({});
  }
  // country/state/city data
  countries: Country[] = [];

  statesMap: Record<string, { code: string; name: string }[]> = {
    IN: [
      { code: 'MH', name: 'Maharashtra' },
      { code: 'KA', name: 'Karnataka' }
    ],
    US: [
      { code: 'CA', name: 'California' },
      { code: 'NY', name: 'New York' }
    ]
  };

  citiesMap: Record<string, { code: string; name: string }[]> = {
    MH: [
      { code: 'MUM', name: 'Mumbai' },
      { code: 'PUN', name: 'Pune' }
    ],
    KA: [
      { code: 'BLR', name: 'Bengaluru' },
      { code: 'MYS', name: 'Mysore' }
    ],
    CA: [
      { code: 'LA', name: 'Los Angeles' },
      { code: 'SF', name: 'San Francisco' }
    ],
    NY: [
      { code: 'NYC', name: 'New York City' },
      { code: 'ALB', name: 'Albany' }
    ]
  };

  filteredStates: { code: string; name: string }[] = [];
  filteredCities: { code: string; name: string }[] = [];

  // Validator: rejects values that start or end with whitespace
  private noLeadingTrailingSpaces: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    if (val == null || typeof val !== 'string' || val.length === 0) {
      return null;
    }
    return val.trim() !== val ? { trim: true } : null;
  };

  savedAddress: any = null;



  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50), this.noLeadingTrailingSpaces]],
      middleName: ['', [Validators.maxLength(50), this.noLeadingTrailingSpaces]],
      lastName: ['', [Validators.required, Validators.maxLength(50), this.noLeadingTrailingSpaces]],
      emailId: ['', [Validators.required, Validators.email, this.noLeadingTrailingSpaces]],
      aadharNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/), this.noLeadingTrailingSpaces]],
      phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), this.noLeadingTrailingSpaces]],
      // add nested address form group
      address: this.formBuilder.group({
        country: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        street: ['', [Validators.required, Validators.maxLength(200), this.noLeadingTrailingSpaces]],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/), this.noLeadingTrailingSpaces]]
      })

       
    });

    // initialize filtered lists if needed
    this.filteredStates = [];
    this.filteredCities = [];
     this.loadCoutrnies();
  }

  loadCoutrnies(): void {
    this.userService.getCountries().subscribe(
      (response: APIResponse<Country[]>) => {
        if (response && response.data) {
          this.countries = response.data;
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load countries.';
      }
    );

  }

  // convenience getter for address group
  get address() {
    return this.registrationForm.get('address') as FormGroup;
  }

  onCountryChange(countryCode: string) {
    this.filteredStates = this.statesMap[countryCode] || [];
    // reset state & city when country changes
    this.address.patchValue({ state: '', city: '' });
    this.filteredCities = [];
  }

  onStateChange(stateCode: string) {
    this.filteredCities = this.citiesMap[stateCode] || [];
    // reset city when state changes
    this.address.patchValue({ city: '' });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.registrationForm.value;

    // TODO: Call registration service here
    // this.registrationService.register(formData).subscribe(...)

    this.loading = false;
    this.successMessage = 'Registration successful!';
  }

  onClear(): void {
    this.registrationForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.filteredStates = [];
    this.filteredCities = [];
  }

  saveAddress(): void {
    this.errorMessage = '';
    this.successMessage = '';

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

    this.loading = true;
    // Simulate save (replace with actual service call if needed)

    this.savedAddress = addr.value;
    this.loading = false;
    this.successMessage = 'Address saved.';
  }
}
