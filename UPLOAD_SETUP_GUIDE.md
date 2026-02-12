# File Upload Service Configuration Guide

## Cloudinary Setup

### 1. Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Get your cloud name from the dashboard

### 2. Configure Upload Preset (Recommended for Unsigned Uploads)
1. Go to Settings → Upload
2. Add upload preset:
   - **Preset name**: `angular_uploads` (or your choice)
   - **Signing Mode**: Unsigned
   - **Use filename**: Yes
   - **Unique filename**: Yes
   - **Resource type**: Auto
   - **Folder**: `uploads` (optional)

### 3. Update Configuration
In `src/app/services/cloudinary-upload.service.ts`:

```typescript
private CLOUD_NAME = 'your_actual_cloud_name'; // Replace with your cloud name
private UPLOAD_PRESET = 'angular_uploads'; // Replace with your preset name
```

### 4. For Signed Uploads (More Secure)
If you want to use signed uploads:
```typescript
private API_KEY = 'your_api_key';
private API_SECRET = 'your_api_secret'; // WARNING: Don't expose this in frontend
```

**Note**: For production, API_SECRET should never be in frontend code. Implement signature generation on your backend.

---

## Dropbox Setup

### 1. Create Dropbox App
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click "Create app"
3. Choose "Scoped access"
4. Choose "Full Dropbox" or "App folder"
5. Name your app

### 2. Generate Access Token
1. In your app settings, go to "Permissions" tab
2. Enable `files.content.write` permission
3. Go to "Settings" tab
4. Generate access token
5. Copy the token

### 3. Update Configuration
In `src/app/services/dropbox-upload.service.ts`:

```typescript
private ACCESS_TOKEN = 'your_actual_access_token'; // Replace with your token
```

---

## Usage Examples

### Basic Upload (Cloudinary)
```typescript
// In your component
this.cloudinaryUploadService.uploadFileUnsigned(file, 'my-folder', 'raw')
  .subscribe({
    next: (response) => {
      console.log('Upload successful:', response.url);
    },
    error: (error) => {
      console.error('Upload failed:', error);
    }
  });
```

### Basic Upload (Dropbox)
```typescript
// In your component
this.dropboxUploadService.uploadFile(file, '/my-folder/filename.pdf')
  .subscribe({
    next: (response) => {
      console.log('Upload successful:', response);
    },
    error: (error) => {
      console.error('Upload failed:', error);
    }
  });
```

### File Type Detection
The system automatically detects file types:
- **Images**: .jpg, .png, .gif, .webp → Cloudinary 'image' type
- **Videos**: .mp4, .avi, .mov → Cloudinary 'video' type
- **Documents**: .pdf, .doc, .txt → Cloudinary 'raw' type

---

## Security Best Practices

### 1. Environment Variables
Store sensitive data in environment files:

```typescript
// environment.ts
export const environment = {
  production: false,
  cloudinary: {
    cloudName: 'your_cloud_name',
    uploadPreset: 'your_preset'
  },
  dropbox: {
    accessToken: 'your_token' // Only for development
  }
};
```

### 2. Backend Integration
For production apps:
- Generate Cloudinary signatures on backend
- Use OAuth2 flow for Dropbox instead of long-lived tokens
- Validate file types and sizes on backend
- Implement rate limiting

### 3. File Validation
```typescript
// Add to your service
validateFile(file: File): boolean {
  const maxSize = 150 * 1024 * 1024; // 150MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/plain'
  ];
  
  return file.size <= maxSize && allowedTypes.includes(file.type);
}
```

---

## Troubleshooting

### Common Cloudinary Errors
- **400 Bad Request**: Check upload preset configuration
- **401 Unauthorized**: Verify cloud name and upload preset
- **File too large**: Check account limits

### Common Dropbox Errors
- **400 Bad Request**: Invalid path format or API argument structure
- **401 Unauthorized**: Expired or invalid access token
- **409 Conflict**: File already exists (use autorename: true)

### Testing Connection
Use the test connection methods to verify your setup:
```typescript
// Test Cloudinary
this.cloudinaryUploadService.testConnection().subscribe(result => {
  console.log('Cloudinary test:', result);
});

// Test Dropbox
this.dropboxUploadService.testConnection().subscribe(result => {
  console.log('Dropbox test:', result);
});
```