import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/ApiResponse';
import { URLConstants } from '../contants/url.enum';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private httpClient: HttpClient) {}

  public saveCandidate(candidateData: Candidate): Observable<APIResponse<any>> {
    return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.CREATE_CANDIDATE, candidateData
    );
  }
}
