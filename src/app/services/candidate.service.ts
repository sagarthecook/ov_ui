import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../models/ApiResponse';
import { URLConstants } from '../contants/url.enum';
import { Candidate } from '../models/candidate.model';
import { CandidateData } from '../candidate-verification/candidate-verification';
import { not } from 'rxjs/internal/util/not';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private httpClient: HttpClient) {}

  public saveCandidate(candidateData: Candidate): Observable<APIResponse<any>> {
    return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.CREATE_CANDIDATE, candidateData
    );
  }

  public getAllCandidates(status: string): Observable<APIResponse<CandidateData[]>> {
    return this.httpClient.get<APIResponse<CandidateData[]>>(
      URLConstants.BASE_URL + URLConstants.GET_ALL_CANDIDATES_BY_STATUS + '?status=' + status
    );
  }

  public udpateCandidate(candidateData: CandidateData): Observable<APIResponse<any>> {
    return this.httpClient.patch<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.UPDATE_CANDIDATE + candidateData.id, 
      {status: candidateData.status,
        noteForStatus: candidateData.noteForStatus
      }
    );
  }

  public updateCandidateStatus(candidateId: number, status: string, note: string): Observable<APIResponse<any>> {
    return this.httpClient.patch<APIResponse<any>>(
      URLConstants.BASE_URL + URLConstants.UPDATE_CANDIDATE + candidateId, 
      {
        status: status,
        noteForStatus: note
      }
    );
  }
}
