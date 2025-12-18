import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
              <mat-icon>how_to_vote</mat-icon>
            </div>
            <mat-card-title>Total Votes</mat-card-title>
            <mat-card-subtitle>Current election statistics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>1,234</h2>
            <p>Votes cast today</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>VIEW DETAILS</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>people</mat-icon>
            </div>
            <mat-card-title>Registered Voters</mat-card-title>
            <mat-card-subtitle>Total registered users</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>5,678</h2>
            <p>Eligible voters</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>MANAGE VOTERS</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <div mat-card-avatar>
              <mat-icon>timeline</mat-icon>
            </div>
            <mat-card-title>Election Status</mat-card-title>
            <mat-card-subtitle>Current election state</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <h2>Active</h2>
            <p>Election in progress</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button>MONITOR</button>
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
export class DashboardComponent {
  constructor() {}
}