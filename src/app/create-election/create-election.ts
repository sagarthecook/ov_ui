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
import { Election } from '../models/election.model';
import { ElectionService } from '../services/election.service';

@Component({
  selector: 'create_election',
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
  templateUrl: './create-election.html',
  styleUrl: './create-election.scss',
})
export class CreateElection implements OnInit {
  successMessage: string;
  errorMessage: string;
  electionCreationForm: FormGroup;
  loading = false;

  // country/state/city data
  countries: DropdownModel[] = [];

  states: DropdownModel[] = [];
  cities: DropdownModel[] = [];
  selectedPhoto: File | null = null;
  minDate: Date = new Date(); //
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
  officerList: DropdownModel[] = [];
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


  constructor(private formBuilder: FormBuilder, private userService: UserService, 
    private electionService: ElectionService) {
    this.successMessage = '';
    this.errorMessage = '';
    this.electionCreationForm = this.formBuilder.group({});
    this.minDate = new Date();
  }

  loadCountries(): void {
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

  loadOfficerList(): void {
    this.userService.getOfficers().subscribe(
      (response: APIResponse<DropdownModel[]>) => {
        if (response && response.data) {
          this.officerList = response.data;
        } 
      },  
      (error) => {
        this.errorMessage = 'Failed to load officers.';
      } 
    );
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

  ngOnInit(): void {
      this.electionCreationForm = this.formBuilder.group({
        electionName: [
          '',   [this.noLeadingTrailingSpaces, Validators.required],
        ],
        electionDate: [ '',[Validators.required],
        ],
        resultDate: [ '',[Validators.required],
        ],
        countryId: [ '',[Validators.required],
        ],
        stateId: [ '',[Validators.required],  
        ],
        cityId: [ '',[Validators.required],
        ],
        officer: [ '',[Validators.required],
        ],
        formEndDate: [ '',[Validators.required]
        ]
      });

      this.loadCountries();
      this.loadOfficerList();
  }

  onOfficerChange(event: any): void {
    console.log('Selected officer:', event.value);    
  }


  onStateChange(stateCode: string): void {
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

  onCityChange(event: any): void {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.electionCreationForm.invalid) { 
      this.electionCreationForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const formData = this.electionCreationForm.value;
    console.log('Election Creation Data:', formData);
    // Here you would typically send formData to your backend API
    // convert this formdata into Election
    const electionData = new Election(
      formData.electionName,
      formData.electionDate,
      formData.resultDate,
      formData.formEndDate,
      { id: formData.countryId },
      { id: formData.stateId },
      { id: formData.cityId },
      { id: formData.officer }
    );
    

    this.electionService.createElection(electionData).subscribe(
      (response: APIResponse<any>) => {
        this.loading = false; 
        this.successMessage = 'Election created successfully!';
        this.electionCreationForm.reset();
      },
      (error:any) => {
        this.loading = false;
        this.errorMessage = 'Failed to create election. Please try again.';
      }
    );

  }

  onClear(): void {
    this.electionCreationForm.reset();
  }


}
