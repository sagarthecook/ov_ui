import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { APIResponse } from '../models/ApiResponse';

export interface VoterData {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  aadharNumber: string;
  dateOfBirth: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submissionDate: string;
  address: string;
}

@Component({
  selector: 'voter-verification',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  templateUrl: './voter-verification.html',
  styleUrls: ['./voter-verification.scss']
})
export class VoterVerification implements OnInit {
  displayedColumns: string[] = [
    'id', 'name', 'emailId', 'phoneNumber', 'aadharNumber', 
    'dateOfBirth', 'status', 'submissionDate', 'actions'
  ];
  
  dataSource = new MatTableDataSource<VoterData>();
  loading = false;
  errorMessage = '';
  
  filterForm: FormGroup;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      status: ['ALL']
    });
  }

  ngOnInit(): void {
    this.loadVoters();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadVoters(): void {
    this.loading = true;
    this.userService.getVoterDetailsList().subscribe(
      (response: APIResponse<VoterData[]>) => {
        if (response && response.data) {
          this.dataSource.data = response.data;
        }
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load voters for verification.';
        this.loading = false;
      }
    );
  }

  setupFilters(): void {
    // Custom filter predicate
    this.dataSource.filterPredicate = (data: VoterData, filter: string) => {
      const filterObj = JSON.parse(filter);
      const searchMatch = !filterObj.searchTerm || 
        data.firstName.toLowerCase().includes(filterObj.searchTerm.toLowerCase()) ||
        data.lastName.toLowerCase().includes(filterObj.searchTerm.toLowerCase()) ||
        data.emailId.toLowerCase().includes(filterObj.searchTerm.toLowerCase()) ||
        data.aadharNumber.includes(filterObj.searchTerm);
      
      const statusMatch = filterObj.status === 'ALL' || data.status === filterObj.status;
      
      return searchMatch && statusMatch;
    };

    // Subscribe to form changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const filterValue = JSON.stringify(this.filterForm.value);
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  approveVoter(voter: VoterData): void {
    this.updateVerificationStatus(voter.id, 'Approved');
  }

  rejectVoter(voter: VoterData): void {
    this.updateVerificationStatus(voter.id, 'Rejected');
  }

  private updateVerificationStatus(voterId: string, status: 'Approved' | 'Rejected'): void {
    this.loading = true;
    this.userService.updateVoterVerificationStatus(voterId, status).subscribe(
      (response: APIResponse<any>) => {
        if (response.success) {
          // Update local data
          const voterIndex = this.dataSource.data.findIndex(v => v.id === voterId);
          if (voterIndex !== -1) {
            this.dataSource.data[voterIndex].status = status;
            this.dataSource._updateChangeSubscription();
          }
          
          this.snackBar.open(
            `Voter ${status.toLowerCase()} successfully`, 
            'Close', 
            { duration: 3000 }
          );
        }
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Failed to update verification status', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Approved': return 'primary';
      case 'Rejected': return 'warn';
      case 'Pending': return 'accent';
      default: return '';
    }
  }

  exportToCSV(): void {
    const csvData = this.dataSource.filteredData.map(voter => ({
      ID: voter.id,
      'Full Name': `${voter.firstName} ${voter.lastName}`,
      Email: voter.emailId,
      'Phone Number': voter.phoneNumber,
      'Aadhar Number': voter.aadharNumber,
      'Date of Birth': voter.dateOfBirth,
      'Verification Status': voter.status,
      'Submission Date': voter.submissionDate,
      Address: voter.address
    }));
    
    // Convert to CSV logic here
    this.snackBar.open('Export functionality to be implemented', 'Close', { duration: 2000 });
  }
 
}
