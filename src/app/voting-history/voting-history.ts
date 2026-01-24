import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VotingHistory as VotingHistoryModel } from '../models/voting-history.model';
import { VoterService } from '../services/voter.service';

@Component({
  selector: 'voting-history',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './voting-history.html',
  styleUrl: './voting-history.scss',
})
export class VotingHistory implements OnInit {
  displayedColumns: string[] = ['electionName', 'voterId', 'votingStartTime', 'votingEndTime', 'votingStatus'];
  dataSource = new MatTableDataSource<VotingHistoryModel>([]);
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(private voterService: VoterService) {}

  ngOnInit(): void {
    this.loadVotingHistory();
  }

  loadVotingHistory(): void {
    this.isLoading = true;
    this.clearMessages();
    
    this.voterService.getVotingHistory()
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.dataSource.data = response.data;
            if (response.data.length === 0) {
              this.successMessage = 'No voting history found.';
            }
          } else {
            this.errorMessage = response.message || 'Failed to load voting history.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading voting history:', error);
          this.errorMessage = 'An error occurred while loading voting history.';
          this.isLoading = false;
        }
      });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status?.toUpperCase()) {
      case 'YES':
        return 'primary';
      case 'NO':
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusText(status: string): string {
    switch (status?.toUpperCase()) {
      case 'YES':
        return 'Voted';
      case 'NO':
        return 'Not Voted';
      default:
        return status || 'Unknown';
    }
  }

  private clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
