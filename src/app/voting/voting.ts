import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VoterService } from '../services/voter.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


interface ApiResponse {
  success: boolean;
  data: VotingData;
  errors: any;
  message: string;
}

@Component({
  selector: 'app-voting',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './voting.html',
  styleUrl: './voting.scss',
})
export class Voting implements OnInit, OnDestroy {
  
  // Component State
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  voteSubmitted: boolean = false;
  errorMessage: string = '';
  
  // Voting Data
  votingData: VotingData | null = null;
  selectedCandidateId: number | null = null;
  
  // Timer for election status
  private statusCheckInterval: any;

  constructor(private router: Router, private voterService: VoterService) {}

  ngOnInit(): void {
    this.loadVotingData();
    this.startStatusCheck();
  }

  ngOnDestroy(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }

  /**
   * Load voting data from API
   */
  loadVotingData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate API call - replace with actual service call
    this.voterService.getVotingDetail().subscribe({
      next: (response: ApiResponse) => {
        if (response.success) {
          this.votingData = response.data;
          this.isLoading = false;
        } else {
          this.errorMessage = 'Failed to load voting data. Please try again later.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = 'you not eligible for voting or something went wrong. Please try again later.';
        this.isLoading = false;
        console.error('Voting data load error:', error);
      }
    });
  }

  /**
   * Select a candidate for voting
   */
  selectCandidate(candidateId: number): void {
    if (this.isSubmitting || !this.isElectionActive()) {
      return;
    }
    this.selectedCandidateId = candidateId;
  }

  /**
   * Clear candidate selection
   */
  clearSelection(): void {
    this.selectedCandidateId = null;
  }

  /**
   * Submit the vote
   */
  submitVote(): void {
    if (!this.selectedCandidateId || this.isSubmitting || !this.isElectionActive()) {
      return;
    }

    // Confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to vote for ${this.getSelectedCandidate()?.candidateName} (${this.getSelectedCandidate()?.partyName})?\n\nOnce submitted, your vote cannot be changed.`
    );

    if (!confirmed) {
      return;
    }

    // Navigate to dashboard after confirmation
    this.router.navigate(['/home/dashboard']);

    this.isSubmitting = true;
        console.log('Vote submitted for candidate:', this.selectedCandidateId);
        this.isSubmitting = false;
        this.voterService.submitVote({
          voterId: this.votingData?.votingId,
          candidateId: this.selectedCandidateId,
          electionId: this.votingData?.electionId
        }).subscribe({
          next: (response) => {
            this.voteSubmitted = true;
            this.isSubmitting = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to submit vote. Please try again.';
            this.isSubmitting = false;
          }
        });
        
  }

  /**
   * Get the selected candidate object
   */
  getSelectedCandidate(): Candidate | undefined {
    if (!this.selectedCandidateId || !this.votingData?.candidates) {
      return undefined;
    }
    return this.votingData.candidates.find(c => c.candidateId === this.selectedCandidateId);
  }

  /**
   * Format date and time for display
   */
  formatDateTime(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      });
    } catch {
      return dateTimeString;
    }
  }

  /**
   * Check if election is currently active
   */
  isElectionActive(): boolean {
    if (!this.votingData) return false;
    
    const now = new Date();
    const startTime = new Date(this.votingData.electionStartTime);
    const endTime = new Date(this.votingData.electionEndTime);
    
    return now >= startTime && now <= endTime;
  }

  /**
   * Get election status for styling
   */
  getElectionStatus(): string {
    if (!this.votingData) return 'unknown';
    
    const now = new Date();
    const startTime = new Date(this.votingData.electionStartTime);
    const endTime = new Date(this.votingData.electionEndTime);
    
    if (now < startTime) return 'upcoming';
    if (now > endTime) return 'ended';
    return 'active';
  }

  /**
   * Get election status text
   */
  getElectionStatusText(): string {
    const status = this.getElectionStatus();
    switch (status) {
      case 'active': return 'Voting Active';
      case 'upcoming': return 'Voting Not Started';
      case 'ended': return 'Voting Ended';
      default: return 'Unknown Status';
    }
  }

  /**
   * Get election status message
   */
  getElectionStatusMessage(): string {
    const status = this.getElectionStatus();
    switch (status) {
      case 'upcoming': return 'Voting has not started yet. Please check back later.';
      case 'ended': return 'Voting period has ended. No more votes can be submitted.';
      default: return 'Voting is not currently available.';
    }
  }

  /**
   * Check if URL is valid for images
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  /**
   * Handle symbol image loading errors
   */
  onSymbolError(event: any): void {
    event.target.style.display = 'none';
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByCandidate(index: number, candidate: Candidate): number {
    return candidate.candidateId;
  }

  /**
   * Navigate to home page
   */
  goToHome(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Start checking election status periodically
   */
  private startStatusCheck(): void {
    // Check status every minute
    this.statusCheckInterval = setInterval(() => {
      // Force change detection for election status
      // This will update the UI if election status changes
    }, 60000);
  }
}
