import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { VoterService } from '../services/voter.service';
import { MatCardHeader, MatCardTitle, MatCard, MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from "@angular/material/paginator";


@Component({
  selector: 'votersearch',
  imports: [MatCardHeader, MatCardTitle,
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
    MatNativeDateModule, MatPaginator],
  templateUrl: './votersearch.html',
  styleUrl: './votersearch.scss',
})


export class VoterSearchComponent implements OnInit, OnDestroy {
  searchInput$ = new Subject<string>();
  searchSub!: Subscription;
  dataSource: any[] = [];
  selectedSearchOption: string = 'email';
  searchValue: string = '';
  displayedColumns: string[] = [
    'id', 'firstName', 'lastName', 'emailId', 'phoneNumber', 'dateOfBirth', 'aadharNumber', 'status'
  ];

  constructor(private voterService: VoterService, private router: Router) {}

  ngOnInit() {
  }

  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchValue = value;
  }

  onSearchOptionChange(event: any) {
    this.selectedSearchOption = event.value;
    this.searchValue='';
    this.dataSource = [];
    console.log('Search option changed to:', event.value);
  }

  onSearchClick() {
    this.voterService.searchVoter(this.selectedSearchOption, this.searchValue).subscribe(response => {
      if (response && response.data) {
        this.dataSource = response.data;
      } else {
        this.dataSource = [];
      }
    },(error) => {
      console.error('Error fetching voter data:', error);
      this.dataSource = [];
    });
  }

  onBackToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}
