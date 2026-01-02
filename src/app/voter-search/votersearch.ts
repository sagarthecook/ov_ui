import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from "@angular/material/paginator";


export interface Voters {
  electionId: number;
  fullName: string;
  aadhaar: string;
  phone: string;
  email: string;
  status: string;
}

@Component({
  selector: 'app-votersearch',
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
applyFilter($event: KeyboardEvent) {
throw new Error('Method not implemented.');
}
  searchInput$ = new Subject<string>();
  searchSub!: Subscription;
  dataSource: any[] = [];
  displayedColumns: string[] = [
    'electionId', 'fullName', 'aadhaar', 'phone', 'email', 'status'
  ];

  constructor(private voterService: VoterService) {}

  ngOnInit() {
    this.searchSub = this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchValue => {
        // You can split searchValue if you want to support both phone and email
        this.voterService.getVoters(searchValue, searchValue).subscribe(results => {
          this.dataSource = results;
        });
      });
  }

  onSearchInput(value: string) {
    this.searchInput$.next(value);
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}
