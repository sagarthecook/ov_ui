import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ElectionService } from '../services/election.service';
import { CandidateService } from '../services/candidate.service';
import { DropdownModel } from '../models/dropdown.model';
import { APIResponse } from '../models/ApiResponse';

interface CandidateResult {
  candidateId: number;
  candidateName: string;
  firstName: string;
  lastName: string;
  partyName: string;
  photo?: string;
  votes: number;
  percentage: number;
  isWinner?: boolean;
}

interface ElectionResult {
  electionId: number;
  electionName: string;
  totalVotes: number;
  candidates: CandidateResult[];
  status: string;
  resultDate?: string;
}

@Component({
  selector: 'publish_result',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './publish-result.html',
  styleUrl: './publish-result.scss',
})
export class PublishResult implements OnInit {
  elections: DropdownModel[] = [];
  selectedElectionId: number | null = null;
  electionResult: ElectionResult | null = null;
  loading = false;
  loadingElections = false;
  isResultPublished = false;

  constructor(
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.loadingElections = true;
    this.electionService.getElectionForResult().subscribe({
      next: (response: APIResponse<DropdownModel[]>) => {
        if (response.success) {
          this.elections = response.data || [];
        } else {
          this.showError('Failed to load elections');
        }
        this.loadingElections = false;
      },
      error: (error) => {
        console.error('Error loading elections:', error);
        this.showError('Error loading elections');
        this.loadingElections = false;
      }
    });
  }

  onElectionChange(election: any): void {
   debugger;
    if (this.selectedElectionId) {
      this.selectedElectionId = Number(this.selectedElectionId);
      this.isResultPublished = true;
    } else {
      this.isResultPublished = false;
    }
  }

  onPublishResult(): void {
    if (this.selectedElectionId) {
       this.loadElectionResult(this.selectedElectionId);
      return;
    }
  }

  loadElectionResult(electionId: number): void {
    this.loading = true;
    
    // Since there might not be a direct result API, we'll simulate with candidate data
    // In a real scenario, you would call a result API endpoint
    this.electionService.publishResult(electionId).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Simulate election results
          const electionData = response.data;
          this.electionResult = this.generateResults(electionData, electionId, electionData.electionName);
        } else {
          this.showError('Failed to load election results');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading election results:', error);
        this.showError('Error loading election results');
        this.loading = false;
      }
    });
  }

  private generateResults(electionResult: any, electionId: number, electionName: string): ElectionResult {
    // Process the candidate data and add photo URLs if not present
    const candidates: CandidateResult[] = electionResult.map((candidate: any) => ({
      candidateId: candidate.candidateId || candidate.id,
      candidateName: candidate.candidateName || `${candidate.firstName} ${candidate.lastName}`,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      partyName: candidate.partyName || candidate.party?.name,
      photo: candidate.photo || candidate.candidatePhoto || this.getDefaultCandidatePhoto(candidate.candidateId),
      votes: candidate.votes || 0,
      percentage: candidate.percentage || 0,
      isWinner: candidate.isWinner || false
    }));
    
    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

    return {
      electionId: electionId,
      electionName: electionName || 'Election',
      totalVotes: totalVotes,
      candidates: candidates,
      status: 'Published',
      resultDate: new Date().toISOString()
    };
  }

  private getDefaultCandidatePhoto(candidateId: number): string {
    // Return placeholder image URLs for demo purposes
    const photoUrls = [
      'https://via.placeholder.com/150x150/1976d2/ffffff?text=C1',
      'https://via.placeholder.com/150x150/388e3c/ffffff?text=C2',
      'https://via.placeholder.com/150x150/f57c00/ffffff?text=C3',
      'https://via.placeholder.com/150x150/7b1fa2/ffffff?text=C4',
      'https://via.placeholder.com/150x150/d32f2f/ffffff?text=C5'
    ];
    
    return photoUrls[(candidateId - 1) % photoUrls.length];
  }

  getWinner(): CandidateResult | null {
    if (!this.electionResult) return null;
    return this.electionResult.candidates.find(c => c.isWinner) || 
           this.electionResult.candidates.sort((a, b) => b.votes - a.votes)[0];
  }

  getSortedCandidates(): CandidateResult[] {
    if (!this.electionResult) return [];
    return [...this.electionResult.candidates].sort((a, b) => b.votes - a.votes);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onImageError(event: any, candidate: CandidateResult): void {
    // Fallback to default placeholder if image fails to load
    event.target.style.display = 'none';
    candidate.photo = '';
  }

  refreshResults(): void {
    if (this.selectedElectionId) {
      this.loadElectionResult(this.selectedElectionId);
    }
  }
}
