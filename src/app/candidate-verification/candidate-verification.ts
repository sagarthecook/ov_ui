import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { CandidateService } from '../services/candidate.service';
import { Inject } from '@angular/core';

@Component({
  selector: 'candidate-verification',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './candidate-verification.html',
  styleUrl: './candidate-verification.scss',
})
export class CandidateVerification implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'emailId', 'occupation',
     'income', 'party', 'logo', 'candidatePhoto', 'incomeProof', 'status', 'noteForStatus', 'actions'];
  dataSource = new MatTableDataSource<CandidateData>();
  loading = false;
  originalData: CandidateData[] = [];
  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private candidateService: CandidateService, private fb: FormBuilder, private dialog: MatDialog) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadCandidates('Pending');
    this.setupFiltering();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupFiltering(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadCandidates(status: string = 'Pending'): void {
    this.candidateService.getAllCandidates(status).subscribe(
      (response) => {
        if (response && response.data) {
          this.originalData = response.data;
          this.dataSource.data = response.data;
        }
      },
      (error) => {
        console.error('Error fetching candidates:', error);
      }
    );
  }

  approveCandidate(candidate: CandidateData) {
    const dialogRef = this.dialog.open(CandidateActionDialogComponent, {
      width: '400px',
      data: {
        action: 'approve',
        candidateName: `${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`.trim()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        // Call API to approve candidate with note
        this.candidateService.updateCandidateStatus(candidate.id, 'Approved', result.note).subscribe(
          (response) => {
            candidate.status = 'Approved';
            candidate.noteForStatus = result.note;
            this.loading = false;
            // Refresh the data to show updated status
            this.applyFilters();
          },
          (error) => {
            console.error('Error approving candidate:', error);
            this.loading = false;
            // Show error message
          }
        );
      }
    });
  }

  rejectCandidate(candidate: CandidateData) {
    const dialogRef = this.dialog.open(CandidateActionDialogComponent, {
      width: '400px',
      data: {
        action: 'reject',
        candidateName: `${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`.trim()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        // Call API to reject candidate with note
        this.candidateService.updateCandidateStatus(candidate.id, 'Rejected', result.note).subscribe(
          (response) => {
            candidate.status = 'Rejected';
            candidate.noteForStatus = result.note;
            this.loading = false;
            // Refresh the data to show updated status
            this.applyFilters();
          },
          (error) => {
            console.error('Error rejecting candidate:', error);
            this.loading = false;
            // Show error message
          }
        );
      }
    });
  }

  applyFilters(): void {
    let filteredData = [...this.originalData];
    const { searchTerm, status } = this.filterForm.value;

    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filteredData = filteredData.filter(candidate => 
        candidate.firstName?.toLowerCase().includes(searchLower) ||
        candidate.middleName?.toLowerCase().includes(searchLower) ||
        candidate.lastName?.toLowerCase().includes(searchLower) ||
        candidate.emailId?.toLowerCase().includes(searchLower) ||
        candidate.occupation?.toLowerCase().includes(searchLower) ||
        candidate.party?.toLowerCase().includes(searchLower) ||
        candidate.election?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status && status.trim()) {
      filteredData = filteredData.filter(candidate => 
        candidate.status.toLowerCase() === status.toLowerCase()
      );
    }

    this.dataSource.data = filteredData;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterForm.patchValue({ searchTerm: filterValue });
  }
  clearFilters(): void {
    this.filterForm.reset();
    this.dataSource.data = this.originalData;
  }
  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status?.toLowerCase()) {
        case 'approved':
          return 'primary';
        case 'pending':
          return 'accent';
        case 'rejected':
          return 'warn';
        default:
          return 'accent';
      }
    }

    filterByStatus(status: string) {

      if (status) {
        this.loadCandidates(status);
      } else {
        this.dataSource.filter = '';
      }
}
}
export interface CandidateData {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  occupation: string;
  income: string;
  party: string;
  election: string;
  status: string;
  emailId: string;
  noteForStatus: string;
  dob: string;
  candidatePhoto: string;
  incomeProof: string;
  logo: string;
}

// Dialog Component for Candidate Action
@Component({
  selector: 'candidate-action-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.action === 'approve' ? 'Approve' : 'Reject' }} Candidate</h2>
    <mat-dialog-content>
      <p>Are you sure you want to {{ data.action }} <strong>{{ data.candidateName }}</strong>?</p>
      <form [formGroup]="actionForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ data.action === 'approve' ? 'Approval' : 'Rejection' }} Note</mat-label>
          <textarea matInput 
                   formControlName="note" 
                   rows="3" 
                   placeholder="Enter reason for {{ data.action === 'approve' ? 'approval' : 'rejection' }}..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button 
              [color]="data.action === 'approve' ? 'primary' : 'warn'" 
              (click)="onConfirm()"
              [disabled]="!actionForm.get('note')?.value?.trim()">
        {{ data.action === 'approve' ? 'Approve' : 'Reject' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin: 16px 0;
    }
    mat-dialog-content {
      min-width: 300px;
    }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class CandidateActionDialogComponent {
  actionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CandidateActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string; candidateName: string },
    private fb: FormBuilder
  ) {
    this.actionForm = this.fb.group({
      note: ['', []]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.actionForm.get('note')?.value?.trim()) {
      this.dialogRef.close({
        note: this.actionForm.get('note')?.value.trim()
      });
    }
  }
}



