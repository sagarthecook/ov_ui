import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ElectionService } from '../services/election.service';
import { DropdownModel } from '../models/dropdown.model';
import { DataPoint } from '../models/datapoint.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="dashboard-cards">
        <mat-card class="info-card">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>ballot</mat-icon>
            </div>
            <mat-card-title>Total Elections</mat-card-title>
            <mat-card-subtitle>All elections in the system</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dataPoint?.totalElections || 0 }}</h2>
            <p>Elections created</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>VIEW ALL</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="info-card approved">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>check_circle</mat-icon>
            </div>
            <mat-card-title>Approved Elections</mat-card-title>
            <mat-card-subtitle>Elections approved for voting</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dataPoint?.totalElectionApproved || 0 }}</h2>
            <p>Ready for voting</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>VIEW APPROVED</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="info-card unapproved">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>pending</mat-icon>
            </div>
            <mat-card-title>Unapproved Elections</mat-card-title>
            <mat-card-subtitle>Pending approval</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dataPoint?.totalElectionunApproved || 0 }}</h2>
            <p>Awaiting review</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>REVIEW</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="info-card published">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>publish</mat-icon>
            </div>
            <mat-card-title>Results Published</mat-card-title>
            <mat-card-subtitle>Elections with published results</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dataPoint?.totalElectionResultPublished || 0 }}</h2>
            <p>Results available</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="onViewResultClick()">VIEW RESULTS</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="info-card unpublished">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>unpublished</mat-icon>
            </div>
            <mat-card-title>Results Unpublished</mat-card-title>
            <mat-card-subtitle>Completed but not published</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>{{ dataPoint?.totalElectionResultUnPublished || 0 }}</h2>
            <p>Pending publication</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>PUBLISH</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <mat-card>
          <mat-card-content>
            <ul>
              <li>New voter registered - John Doe (2 minutes ago)</li>
              <li>Vote submitted - Voter ID: 12345 (5 minutes ago)</li>
              <li>Election status updated (10 minutes ago)</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #3f51b5;
      margin-bottom: 30px;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-card {
      min-height: 200px;
    }

    .info-card h2 {
      font-size: 2.5em;
      color: #3f51b5;
      margin: 10px 0;
    }

    .info-card.approved h2 {
      color: #4caf50;
    }

    .info-card.unapproved h2 {
      color: #ff9800;
    }

    .info-card.published h2 {
      color: #2196f3;
    }

    .info-card.unpublished h2 {
      color: #f44336;
    }

    .recent-activity {
      margin-top: 30px;
    }

    .recent-activity h2 {
      color: #3f51b5;
      margin-bottom: 15px;
    }

    .recent-activity ul {
      list-style: none;
      padding: 0;
    }

    .recent-activity li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .recent-activity li:last-child {
      border-bottom: none;
    }
  `]
})
export class DashboardComponent implements OnInit {
    elections: DropdownModel[] = [];
    dataPoint: DataPoint | null = null;
  constructor(private electionService: ElectionService, private router: Router) {}

  ngOnInit(): void {

     this.electionService.getElectionsForShowResult().subscribe(
      (response) => {
        if (response.success) {
          this.elections = response.data || [];
        }
     },
      (error) => {
        console.error('Error fetching elections for show result:', error);
      });

      this.electionService.getElectionDataPoint().subscribe(
      (response) => {
        if (response.success) {
           this.dataPoint = response.data;
        }
     },
      (error) => {
        console.error('Error fetching election data point:', error);
      });
  }

  onViewResultClick(): void {
    // Implement navigation to results page or display results in a dialog
    console.log('View Results clicked');
    this.router.navigate(['/home/show_result']);
  }

}
