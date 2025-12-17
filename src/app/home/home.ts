import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { APIResponse } from '../models/ApiResponse';
import { MenuItem } from '../models/menu.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  menuItems: MenuItem[] = [];
  loading = false;
  errorMessage = '';

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.loading = true;
    this.userService.getMenuItems().subscribe(
      (response: APIResponse<MenuItem[]>) => {
        if (response && response.data) {
          this.menuItems = response.data.map(item => ({
            ...item,
            expanded: false // Initialize expanded state
          }));
        }
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load menu items.';
        this.loading = false;
      }
    );
  }

  toggleSubmenu(item: any): void {
    debugger;
    if (item.subMenus && item.subMenus.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    // Navigate to login
  }
}
