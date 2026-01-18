import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {  HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { DropboxUploadService } from '../services/dropbox-upload.service';
import { CloudinaryUploadService } from '../services/cloudinary-upload.service';

@Component({
  selector: 'common-file-upload',
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './common-file-upload.html',
  styleUrl: './common-file-upload.scss',
  standalone: true,
})
export class CommonFileUpload {
  files: File[] = [];
  uploadProgress: number | null = null;
  uploading = false;
  url: string = '';
  
  @Input() title : string = 'File Upload';
  
  @Input() selectedFile: string = '';

  @Output() uploadComplete = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar, 
    private dropboxUploadService: DropboxUploadService,
    private cloudinaryUploadService: CloudinaryUploadService
  ) {}

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
      console.log('Files selected:', this.files);
      console.log('Files length:', this.files.length);
    }
  }

  // Upload files to selected provider
  uploadFiles() {
    debugger;
    if (this.files.length === 0) {
      this.snackBar.open('Please select at least one file.', 'Close', { duration: 3000 });
      return;
    }

    this.uploading = true;
     this.uploadToCloudinary();
  }

  private uploadToCloudinary() {
    const file = this.files[0];
    const folder = 'uploads'; // Optional folder in Cloudinary
    
    // Determine resource type based on file type
    let resourceType: 'image' | 'video' | 'raw' = 'raw';
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    this.cloudinaryUploadService.uploadFileUnsigned(file, folder, resourceType).subscribe({
      next: (response) => {
        console.log('Cloudinary upload successful:', response);
        this.uploadComplete.emit(response.url);
        this.url = response.url;
        this.uploading = false;
        this.snackBar.open(
          `Upload to Cloudinary successful!`, 
          'Close', 
          { duration: 3000 }
        );
      },
      error: (error) => {
        this.snackBar.open(`Cloudinary upload failed: ${error.message}`, 'Close', { duration: 4000 });
      }
    });
  }

}


