import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule, NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { FileUploadService } from '../services/fileupload.service';

@Component({
  selector: 'app-common-file-upload',
  standalone: true,
  imports: [CommonModule, NgxDropzoneModule],
  templateUrl: './common-file-upload.html',
  styleUrls: ['./common-file-upload.scss'],
})
export class CommonFileUpload {

  files: File[] = [];

  constructor(private fileUploadService: FileUploadService) {}

  onSelect(event: NgxDropzoneChangeEvent) {
    this.files.push(...event.addedFiles);
  }

  onRemove(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }

  uploadFiles() {
    if (!this.files.length) {
      alert('No file uploaded');
      return;
    }

    const file_data = this.files[0];

    const data = new FormData()
    data.append('file', file_data)
     data.append('upload_preset', 'default')
     data.append(`cloud_name`,`onlinevotting`)

     this.fileUploadService.uploadFile(data).subscribe((res)=>{
      console.log(res)
     })





    // data.append('file', file_data);
    // data.append('upload_preset', 'default');

    // this.fileUploadService.uploadFile(data).subscribe({
    //   next: (response) => {
    //     console.log('Upload success:', response);
    //   },
    //   error: (err) => {
    //     console.error('Upload failed:', err);
    //   }
    // });
  }
}
