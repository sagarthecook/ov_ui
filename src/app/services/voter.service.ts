import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/ApiResponse';
import { URLConstants } from '../contants/url.enum';
import { Observable } from 'rxjs';
import { Voters } from '../voter-search/votersearch';

@Injectable({
  providedIn: 'root'
})
export class VoterService {

  constructor(private httpClient: HttpClient) {}

getVoters(phone?: string, email?: string): Observable<Voters[]> {
  let params = [];
  if (phone) params.push(`phone=${encodeURIComponent(phone)}`);
  if (email) params.push(`email=${encodeURIComponent(email)}`);
  const url = URLConstants.BASE_URL + URLConstants.VOTER_SEARCH + params.join('&');
  return this.httpClient.get<Voters[]>(url);
}
}
