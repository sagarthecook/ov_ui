import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './publish-election.html',
  styleUrl: './publish-election.scss',
})

export class PublishElection implements OnInit {
  @ViewChild('publishDialog') publishDialogTemplate!: TemplateRef<any>;

  elections: DropdownModel[] = [];
  selectedElectionIndex: number | null = null;
  selectedElection: ElectionDetail | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  isPublish : boolean = false;
  isNotificationClicked  : boolean = true;
  constructor(
    private electionService: ElectionService,
    private dialog: MatDialog
  ) { }

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
          this.isPublish = this.selectedElection.isPublish;
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
  onElectionPublish() {
    if (!this.selectedElection) return;

    const dialogRef = this.dialog.open(PublishElectionDialogComponent, {
      width: '500px',
      data: {
        electionName: this.selectedElection.electionName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.electionService.publishElection(this.selectedElection!.electionId, result.note).subscribe (
          (response) => {
            console.log('Election published successfully:', response);
            if (this.selectedElection) {
              this.selectedElection.status = 'Published';
            }
            this.successMessage = 'Election published successfully!';
            this.errorMessage = '';
            this.isPublish = true;
            this.hideMessagesAfterDelay();
          },
          (errorResponse) => {
            console.error('Error publishing election:', errorResponse);
            this.errorMessage = 'Failed to publish election. Please try again.';
            this.successMessage = '';
            this.hideMessagesAfterDelay();
          }
        );
      }
    });
  }

  sendNotification() {
    this.isNotificationClicked = false;
     setTimeout(() => {
     this.isPublish = false;
    }, 2000);
    // Add notification logic here
    this.successMessage = 'Notification sent successfully!';
    this.errorMessage = '';
    this.hideMessagesAfterDelay();
  }


  private hideMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000); // Hide after 5 seconds
  }

}

// Dialog Component for Publish Election
@Component({
  selector: 'publish-election-dialog',
  template: `
    <h2 mat-dialog-title>Publish Election</h2>
    <mat-dialog-content>
      <p>Are you sure you want to publish <strong>{{ data.electionName }}</strong>?</p>
      <form [formGroup]="publishForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Publication Note</mat-label>
          <textarea matInput
                   formControlName="note"
                   rows="4"
                   placeholder="Enter note for publishing this election..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        <mat-icon>cancel</mat-icon>
        Cancel
      </button>
      <button mat-raised-button
              color="primary"
              (click)="onConfirm()"
              [disabled]="!publishForm.get('note')?.value?.trim()">
        <mat-icon>verified</mat-icon>
        Publish
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin: 16px 0;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ]
})
export class PublishElectionDialogComponent {
  publishForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PublishElectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { electionName: string },
    private fb: FormBuilder
  ) {
    this.publishForm = this.fb.group({
      note: ['', []]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.publishForm.get('note')?.value?.trim()) {
      this.dialogRef.close({
        note: this.publishForm.get('note')?.value.trim()
      });
    }
  }
}
