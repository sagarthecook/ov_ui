import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
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
import { IfDirective } from '../shared/if.directive';
import { Router } from '@angular/router';

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
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    IfDirective,
  ],
  templateUrl: './userregistration.html',
  styleUrls: ['./userregistration.scss'],
})
export class UserRegistration implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group({});
  }
  // country/state/city data
  countries: DropdownModel[] = [];

  states: DropdownModel[] = [];
  cities: DropdownModel[] = [];
  selectedPhoto: File | null = null;
  // Validator: rejects values that start or end with whitespace
  private noLeadingTrailingSpaces: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const val = control.value;
    if (val == null || typeof val !== 'string' || val.length === 0) {
      return null;
    }
    return val.trim() !== val ? { trim: true } : null;
  };

  savedAddress: any = null;
  addressButtonLoading = false;
  addressId: string = '';
  roleId: string = '';
  // table config
  displayedColumns: string[] = [
    'index',
    'country',
    'state',
    'city',
    'street',
    'zip',
  ];
  savedAddresses: any[] = []; // will store display-ready address objects
  userRoles: DropdownModel[] = [];
  maxDate: Date = new Date(); //

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          this.noLeadingTrailingSpaces,
        ],
      ],
      middleName: [
        '',
        [Validators.maxLength(50), this.noLeadingTrailingSpaces],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          this.noLeadingTrailingSpaces,
        ],
      ],
      emailId: [
        '',
        [Validators.required, Validators.email, this.noLeadingTrailingSpaces],
      ],
      aadharNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{12}$/),
          this.noLeadingTrailingSpaces,
        ],
      ],
      phoneNo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          this.noLeadingTrailingSpaces,
        ],
      ],
      dob: ['', [Validators.required]],
      role: ['3', [Validators.required]],
      // add nested address form group
      address: this.formBuilder.group({
        countryId: ['', [Validators.required]],
        stateId: ['', [Validators.required]],
        cityId: ['', [Validators.required]],
        street: [
          '',
          [
            Validators.required,
            Validators.maxLength(200),
            this.noLeadingTrailingSpaces,
          ],
        ],
        zipCode: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d{6}$/),
            this.noLeadingTrailingSpaces,
          ],
        ],
      }),
    });
    const todayDate = new Date();
    this.maxDate = new Date(
      todayDate.getFullYear() - 18,
      todayDate.getMonth(),
      todayDate.getDate()
    );
    // initialize filtered lists if needed
    this.states = [];
    this.cities = [];
    this.loadCoutrnies();
    this.loaddUserRoles();
  }

  loaddUserRoles(): void {
    this.userService.getUserRoles().subscribe(
      (response: APIResponse<DropdownModel[]>) => {
        if (response && response.data) {
          this.userRoles = response.data;
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load user roles.';
      }
    );
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

 roleChange(value: any): void {
    console.log('Selected role:', value);
    this.roleId = value;
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
    this.userService
      .saveUserDetails(formData, this.selectedPhoto, this.addressId,this.roleId)
      .subscribe(
        (response) => {
          // handle success if needed
          debugger;
          this.successMessage = 'Registration successful!';
          this.loading = false;
          this.router.navigate(['/login']);
        },
        (errorResponse) => {
          this.loading = false;

          this.errorMessage = 'Registration failed. Please try again.';
          if (
            errorResponse.error &&
            errorResponse.error.errors &&
            errorResponse.error.errors.length > 0
          ) {
            this.errorMessage = errorResponse.error.errors[0];
          }
        }
      );
  }

  onClear(): void {
    this.registrationForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.states = [];
    this.cities = [];
    this.savedAddresses = [];
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
    this.addressButtonLoading = true;
    this.userService.saveAddress(addr.value).subscribe(
      (response) => {
        // resolve names for display
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

        this.savedAddress = val;
        this.loading = false;
        this.successMessage = 'Address saved.';

        // add display object to table data
        this.savedAddresses.push(displayObj);

        // clear address form after successful save
        // addr.reset();
        this.states = [];
        this.cities = [];
        this.addressId = response.data;
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
