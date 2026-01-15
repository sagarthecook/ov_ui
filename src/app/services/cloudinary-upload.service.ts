// src/app/services/cloudinary-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {
  // Replace with your Cloudinary cloud name
  private CLOUD_NAME = 'djyjje0xy';
  private UPLOAD_PRESET = 'online_voting'; // Unsigned upload preset
  private CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/upload`;
  
  // For signed uploads (more secure)
  private API_KEY = '776313156251921';
  private API_SECRET = 'gFdleaGoC9M5EwrWJqVZhqtJI_0';

  constructor(private http: HttpClient) {}

  /**
   * Upload file to Cloudinary using unsigned upload preset (easier setup)
   * @param file - File to upload
   * @param folder - Optional folder path in Cloudinary
   * @param resourceType - Type of resource (image, video, raw for documents)
   * @returns Observable with upload response
   */
  uploadFileUnsigned(file: File, folder?: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Observable<any> {
    if (!file) {
      return throwError(() => new Error('No file selected'));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.UPLOAD_PRESET);
    formData.append('resource_type', resourceType);
    
    if (folder) {
      formData.append('folder', folder);
    }

    // Add file type detection for better handling
    if (resourceType === 'raw') {
      // For documents, preserve original filename
      formData.append('public_id', this.generatePublicId(file.name));
    }

    console.log('Uploading to Cloudinary:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      resourceType,
      folder
    });

    return this.http.post(this.CLOUDINARY_URL, formData).pipe(
      map((response: any) => {
        console.log('File uploaded successfully to Cloudinary:', response);
        return {
          success: true,
          url: response.secure_url,
          publicId: response.public_id,
          resourceType: response.resource_type,
          format: response.format,
          bytes: response.bytes,
          originalFilename: response.original_filename,
          createdAt: response.created_at
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error uploading file to Cloudinary:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        
        let errorMessage = 'File upload failed';
        if (error.status === 400) {
          errorMessage = 'Bad Request: Check file format and upload preset configuration';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Invalid upload preset or API credentials';
        } else if (error.status === 413) {
          errorMessage = 'File too large: Exceeds maximum file size limit';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Upload file to Cloudinary using signed upload (more secure)
   * @param file - File to upload
   * @param folder - Optional folder path
   * @param resourceType - Type of resource
   * @returns Observable with upload response
   */
  uploadFileSigned(file: File, folder?: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Observable<any> {
    if (!file) {
      return throwError(() => new Error('No file selected'));
    }

    if (!this.API_KEY || this.API_KEY === 'your_api_key') {
      return throwError(() => new Error('API credentials not configured. Please set your Cloudinary API key and secret.'));
    }

    // Generate timestamp for signature
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const publicId = this.generatePublicId(file.name);
    
    // Prepare parameters for signature
    const params: any = {
      timestamp: timestamp,
      public_id: publicId,
      resource_type: resourceType
    };

    if (folder) {
      params.folder = folder;
    }

    // Generate signature (Note: In production, this should be done on the backend for security)
    const signature = this.generateSignature(params);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', this.API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('public_id', publicId);
    formData.append('resource_type', resourceType);
    
    if (folder) {
      formData.append('folder', folder);
    }

    return this.http.post(this.CLOUDINARY_URL, formData).pipe(
      map((response: any) => {
        console.log('File uploaded successfully to Cloudinary (signed):', response);
        return {
          success: true,
          url: response.secure_url,
          publicId: response.public_id,
          resourceType: response.resource_type,
          format: response.format,
          bytes: response.bytes,
          originalFilename: response.original_filename,
          createdAt: response.created_at
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error uploading file to Cloudinary:', error);
        return throwError(() => new Error('Signed upload failed'));
      })
    );
  }

  /**
   * Delete file from Cloudinary
   * @param publicId - Public ID of the file to delete
   * @param resourceType - Type of resource
   * @returns Observable with deletion response
   */
  deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'raw'): Observable<any> {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const params = {
      public_id: publicId,
      timestamp: timestamp,
      resource_type: resourceType
    };

    const signature = this.generateSignature(params);
    const deleteUrl = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/${resourceType}/destroy`;

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', this.API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    return this.http.post(deleteUrl, formData).pipe(
      map((response: any) => {
        console.log('File deleted successfully from Cloudinary:', response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting file from Cloudinary:', error);
        return throwError(() => new Error('File deletion failed'));
      })
    );
  }

  /**
   * Generate a clean public ID from filename
   * @param filename - Original filename
   * @returns Clean public ID
   */
  private generatePublicId(filename: string): string {
    const timestamp = Date.now();
    const cleanName = filename
      .replace(/\.[^/.]+$/, '') // Remove file extension
      .replace(/[^a-zA-Z0-9]/g, '_') // Replace special chars with underscore
      .toLowerCase();
    return `${cleanName}_${timestamp}`;
  }

  /**
   * Generate signature for signed uploads (Note: In production, this should be done on backend)
   * @param params - Parameters to sign
   * @returns Signature string
   */
  private generateSignature(params: any): string {
    // WARNING: This is a simplified version. In production, signature generation
    // should be done on the backend to keep API_SECRET secure
    
    // Sort parameters
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    // For demo purposes - in production, use proper HMAC SHA1 with API_SECRET
    // This is just a placeholder - implement proper signing on backend
    console.warn('Signature generation should be done on backend for security');
    return btoa(sortedParams + this.API_SECRET).substring(0, 20);
  }

  /**
   * Test Cloudinary connection
   * @returns Observable with test result
   */
  testConnection(): Observable<any> {
    // Create a simple test by trying to get cloud info
    const testUrl = `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/usage`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(testUrl, { headers }).pipe(
      map((response: any) => {
        console.log('Cloudinary connection test successful:', response);
        return { success: true, message: 'Cloudinary connection successful' };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Cloudinary connection test failed:', error);
        return throwError(() => new Error('Cloudinary connection failed - check cloud name'));
      })
    );
  }
}