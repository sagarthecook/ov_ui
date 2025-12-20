import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔥 Auth interceptor triggered for URL:', request.url);
    
    const authToken = localStorage.getItem('auth_token');
    console.log('🔑 Token from localStorage:', authToken ? `Found: ${authToken.substring(0, 20)}...` : 'Not found');

    // Skip token for login/public endpoints
    const skipUrls = ['/generate_otp', '/login', '/register', '/v1/user/generate_otp', '/v1/user/validate_otp'];
    const shouldSkip = skipUrls.some(url => request.url.includes(url));
    
    console.log('⏭️ Should skip adding token:', shouldSkip);

    if (authToken && !shouldSkip) {
      console.log('✅ Adding Authorization header');
      // Ensure token is properly formatted
      const token = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
      request = request.clone({
        setHeaders: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      console.log('📤 Request headers after clone:', request.headers.keys());
    } else {
      console.log('❌ Not adding token - reason:', !authToken ? 'No token' : 'Skipped URL');
      
      // For requests that need auth but token is missing, log warning
      if (!authToken && !shouldSkip) {
        console.warn('⚠️ API call requires authentication but no token found');
      }
    }

    return next.handle(request); // Pass the cloned request
  }
}