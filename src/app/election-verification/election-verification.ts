import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { ElectionService } from '../services/election.service';

export interface ElectionData {
  electionId: number;
  electionName: string;
  electionDate: string;
  resultDate: string;
  country: string;
  state: string;
  city: string;
  officer: string;
  status: string;
}

@Component({
  selector: 'election_verification',
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
    MatSnackBarModule
  ],
  templateUrl: './election-verification.html',
  styleUrl: './election-verification.scss',
})
export class ElectionVerification implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'electionId',
    'electionName', 
    'electionDate',
    'resultDate',
    'country',
    'state',
    'city',
    'officer',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<ElectionData>();

  // Sample data
  elections: ElectionData[] = [
  ];

  constructor(private snackBar: MatSnackBar, private electionService: ElectionService) {}

  ngOnInit() {
    this.dataSource.data = this.elections;
    this.loadElectionData('Pending');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadElectionData(status : string) {
        this.electionService.getElectionsForVerification (status).subscribe(
        (response:any) => {
          if (response && response.data) {
            this.dataSource.data = response.data;
          }
        },
        (error:any) => {
          console.error('Failed to load elections for verification.', error);
        }
      );  
  }

  filterByStatus(status: string) {

    if (status) {
      debugger;
  this.loadElectionData(status);
    } else {
      this.dataSource.filter = '';
    }
    
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  viewDetails(election: ElectionData) {
    // Navigate to election details or open dialog
    console.log('View details for election:', election);
    this.snackBar.open(`Viewing details for ${election.electionName}`, 'Close', {
      duration: 3000
    });
  }

  approveElection(election: ElectionData) {
    debugger;
    this.electionService.updateElectionStatus(election.electionId, 'Approved').subscribe(
      (response:any) => {
        election.status = 'Approved'; 
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open(`Election "${election.electionName}" has been approved`, 'Close', {
          duration: 3000
        });
      } ,
      (error:any) => {  
        console.error('Failed to approve election.', error);
        this.snackBar.open(`Failed to approve election "${election.electionName}". Please try again.`, 'Close', {
          duration: 3000
        });
      }
    );

  }

  rejectElection(election: ElectionData) {
  this.electionService.updateElectionStatus(election.electionId, 'Rejected').subscribe(
      (response:any) => {
        election.status = 'Rejected'; 
        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open(`Election "${election.electionName}" has been rejected`, 'Close', {
          duration: 3000
        });
      } ,
      (error:any) => {  
        console.error('Failed to reject election.', error);
        this.snackBar.open(`Failed to reject election "${election.electionName}". Please try again.`, 'Close', {
          duration: 3000
        });
      }
    );

   
  }
}
