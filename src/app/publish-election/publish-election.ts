import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatListOption } from '@angular/material/list';
import { ElectionService } from '../services/election.service';
import { DropdownModel } from '../models/dropdown.model';

interface Candidate {
  name: string;
  party: string;
}


@Component({
  selector: 'publish_election',
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule
  ],
  templateUrl: './publish-election.html',
  styleUrl: './publish-election.scss',
})
export class PublishElection implements OnInit {
  elections: DropdownModel[] = [];
  selectedElectionIndex: number | null = null;
  selectedElection: ElectionDetail | null = null;
  constructor(private electionService: ElectionService) { }
  ngOnInit() {
    this.loadElections();
  }

  loadElections() {
    // Mock data - replace with actual service call
    this.electionService.getElections().subscribe(response => {
      if (response && response.data) {
        this.elections = response.data;
        
      }},
      (errorResponse) => {
        console.error('Error fetching elections:', errorResponse);
      });


  }

  selectElection(id: number) {
    this.selectedElectionIndex = id;
    this.electionService.getElectionDetails(id).subscribe(response => {
        if (response && response.data) {
          this.selectedElection = response.data;
        } },
        (errorResponse) => {
          console.error('Error fetching election details:', errorResponse); 
        });
    }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status?.toLowerCase()) {
      case 'draft':
      case 'pending':
        return 'accent';
      case 'approved':
      case 'published':
        return 'primary';
      case 'rejected':
      case 'archived':
        return 'warn';
      default:
        return 'primary';
    }
  }

  publishElection() {
    if (this.selectedElection && (this.selectedElection.status?.toLowerCase() === 'draft' || this.selectedElection.status?.toLowerCase() === 'pending')) {
      this.selectedElection.status = 'Approved';
      console.log(`Election "${this.selectedElection.electionName}" has been approved.`);
      // Add your publish logic here - call service to publish election
      // You might want to show a snackbar notification here
    }
  }

  unpublishElection() {
    if (this.selectedElection && this.selectedElection.status?.toLowerCase() === 'approved') {
      this.selectedElection.status = 'Draft';
      console.log(`Election "${this.selectedElection.electionName}" has been moved to draft.`);
      // Add your unpublish logic here - call service to unpublish election
      // You might want to show a snackbar notification here
    }
  }

  editElection() {
    if (this.selectedElection) {
      console.log(`Editing election "${this.selectedElection.electionName}"`);
      // Add navigation to edit form or open edit dialog here
      // this.router.navigate(['/edit-election', this.selectedElection.electionId]);
      // or
      // this.dialog.open(EditElectionComponent, { data: this.selectedElection });
    }
  }
}
