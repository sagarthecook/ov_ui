// src/app/services/dropbox-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropboxUploadService {
  private DROPBOX_UPLOAD_URL = 'https://content.dropboxapi.com/2/files/upload';
  private ACCESS_TOKEN = 'sl.u.AGMkrmHCYRidZuqKkr_Fc-jMYwWk2E8TDYOrMRdVIZQw-hmjBaDALGWPd9sgmwrLcavJfPYMeezyqi5ANkwnQ0-bAunilPrpz-XB21m5wRQ7PaqDC8WOHrXp0Qy451sIWEIDJNZ9JaQyMYizb1uYfKN7-PM-KDvXjQhEqfE3ZbA3Vld8-IChjW1bZ_kFQlYybsrtHD_mHW_rlCsme7glj8IvWvR6H1Tq-qT96KUEGSfeFUZGoZRzoPnjMe5RYlpz807gt9yjU3VO6yrXLLW69-p_1r281gsLohTsplhwcns2HoeBA0UnYqFR4QNqB4dhmqlBNW944kaRFtOcCI2PkVEIMGtZ0STjzRN-2AqTV7GOYRAO-BZgQSM2FXObKtVVzXyWLHFd-EmgHKCtTqDo9VrIoiwwANVQjQhOBFaWme6ODt1e5WVAMMJ4T3mF2pinP6t4OeA3oOYbg4_FMCOGuoyavwqqIe3IGPbDDt7ZIwNio279srrrXB1vJ0HkqIe3RN5NYUlrk8Ee5gLCf8UD7hzDY1f6O2OCJmajTt6XAFjRRMoJgj7s0fCzKFuDoTmOt8isvdlPCknR5Hto0ybhc3fN36Lilh4xmeNCvmxtqVUNCb8PxsoCQ4E6KQB7zfH1F4H4FSdesnWBH0RUzNMImO3mXCdNkmYN3LQ6SAFkW88_98UHboDSGVsMKf0oNbM-IeEw6bzKS_-S5UGhoi8We9jZInCKeeEIruTK9mYDVtknQf0zenr4KF64XYZlRX3K7mdcnAoW_uQpav396GjWqMRrZHOoZhVf1-b69ph_0pf1-DsMGUQhycU6RFGBiIOhf9hAGP8x5CvgdpLken5ZEkaISRhJAM3MXmyckKiFcOjVfP5tPLGSDQe6oquqBxeEsSrmo5MWx29X7YRC8uLGqfkzpUiFqnpzvBXouSkEHWAS4iManCKI3dMSSS59V9n9zN28r299wnkxfcIzsUOPiPHwBBgrrFcx5EeGel5KaoKvd5Y4HSKTi435wUo6260d0lDQv95A6mo_2me-rFfUwxjKh-pn2JRP6-fOCgdZ9MiqkIDXiVwB8ZpuOIgqfeRbfdKuBPTNDJNEm4nEJukpkkE2NoHS_BXdO2PUy-WNwhmPSgU-NvcbPMHE52U6InX7ojyjuVT7XI92cQZQj9DaRGQVuJEJkvLo80kxB1PKcLjs267tzxEw9guLLgYdNZi-M7jx8MVpL8GnleeWopr-OAvvzmmLhpCg9GOm-ejsgvEn3lB64KBvTZEiCf2rIGpX35SA070_tYVoiLdeG1UfpXs_'; // Replace with your token

  constructor(private http: HttpClient) {}

  // Test the access token validity
  testConnection(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    });

    return this.http.post('https://api.dropboxapi.com/2/users/get_current_account', {}, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Dropbox connection test failed:', error);
        return throwError(() => new Error('Invalid or expired access token'));
      })
    );
  }

  uploadFile(file: File, dropboxPath: string): Observable<any> {
    if (!file) {
      return throwError(() => new Error('No file selected'));
    }

    // Validate and format the dropbox path
    if (!dropboxPath.startsWith('/')) {
      dropboxPath = '/' + dropboxPath;
      console.warn('Dropbox path adjusted to start with "/":', dropboxPath);
    }

    const dropboxApiArg = {
      path: dropboxPath,
      mode: {
        ".tag": "add"
      },
      autorename: true,
      mute: false
    };

    console.log('Dropbox API Arg:', dropboxApiArg);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
      'Dropbox-API-Arg': JSON.stringify(dropboxApiArg),
      'Content-Type': 'application/octet-stream'
    });

    return this.http.post(this.DROPBOX_UPLOAD_URL, file, { headers }).pipe(
      map(response => {
        console.log('File uploaded successfully:', response);
        debugger;
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error uploading file:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        
        let errorMessage = 'File upload failed';
        if (error.status === 400) {
          errorMessage = 'Bad Request: Check file path and token validity';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Invalid or expired access token';
        } else if (error.status === 409) {
          errorMessage = 'Conflict: File already exists at the specified path';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
