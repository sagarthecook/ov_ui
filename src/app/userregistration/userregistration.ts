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
import { DropdownModel } from '../models/dropdown.model';
import { IfDirective } from '../shared/if.directive';
import { MatGridList, MatGridListModule } from '@angular/material/grid-list';

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
    MatSelectModule,
    MatGridListModule,
    IfDirective
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
  countries: DropdownModel[] = [];

  states: DropdownModel[] = [];
  cities: DropdownModel[] = [];

  // Validator: rejects values that start or end with whitespace
  private noLeadingTrailingSpaces: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const val = control.value;
    if (val == null || typeof val !== 'string' || val.length === 0) {
      return null;
    }
    return val.trim() !== val ? { trim: true } : null;
  };

  savedAddress: any = null;
  savedAddresses: any[] = []; // array to store all saved addresses for grid display



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
        countryId: ['', [Validators.required]],
        stateId: ['', [Validators.required]],
        cityId: ['', [Validators.required]],
        street: ['', [Validators.required, Validators.maxLength(200), this.noLeadingTrailingSpaces]],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/), this.noLeadingTrailingSpaces]]
      })

       
    });

    // initialize filtered lists if needed
    this.states = [];
    this.cities = [];
     this.loadCoutrnies();
  }

  loadCoutrnies(): void {
    this.userService.getCountries().subscribe(
      (response: APIResponse<DropdownModel[]>) => {
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
    // call state api to get states for selected country
    this.userService.getStates(countryCode).subscribe(
      (response: APIResponse<DropdownModel[]>) => {
        if (response && response.data) {  
          this.states = response.data;    
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load states.';
      }
    );
  }

  onStateChange(stateCode: string) {
    // call city api to get cities for selected state
    this.userService.getCities(stateCode).subscribe(
      (response: APIResponse<DropdownModel[]>) => {
        if (response && response.data) {
          this.cities = response.data;
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load cities.';
      }
    );  
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
    this.states = [];
    this.cities = [];
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
    this.userService.saveAddress(addr.value).subscribe(
      (response) => {
        this.savedAddress = addr.value;
        this.loading = false;
        this.successMessage = 'Address saved.';
        // add saved address to grid list
        this.savedAddresses.push(addr.value);
        // clear address form after successful save
        addr.reset();
        this.states = [];
        this.cities = [];
        // optionally auto-clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        this.errorMessage = 'Failed to save address.';
        this.loading = false;
      }
    );
  }
}
