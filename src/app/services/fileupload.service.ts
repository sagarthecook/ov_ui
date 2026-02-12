import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private cloudName = 'onlinevotting';

  constructor(private httpClient: HttpClient) {}

  uploadFile(data: FormData): Observable<any> {
    return this.httpClient.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      data
    );
  }
}
