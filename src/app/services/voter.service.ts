import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/ApiResponse';
import { URLConstants } from '../contants/url.enum';
import { Observable } from 'rxjs';
import { Voter } from '../models/voter.model';
import { VotingHistory } from '../models/voting-history.model';

@Injectable({
  providedIn: 'root',
})
export class VoterService {
  constructor(private httpClient: HttpClient) {}

  searchVoter(searchOption:string , searchValue : string): Observable<APIResponse<Voter[]>> {
   return this.httpClient.get<APIResponse<Voter[]>>(
      URLConstants.BASE_URL +`${URLConstants.VOTER_SEARCH}?${searchOption}=${searchValue}`
    );
  }

  public getVotingDetail(): Observable<APIResponse<VotingData>> {
    return this.httpClient.get<APIResponse<VotingData>>(
      URLConstants.BASE_URL + URLConstants.VOTING_DETAIL
    );
  }

  public submitVote(voteData: { voterId: number | undefined; candidateId: number | null; electionId: number | undefined }): Observable<APIResponse<null>> {
    return this.httpClient.patch<APIResponse<null>>(
      URLConstants.BASE_URL + URLConstants.SUBMIT_VOTE,
      voteData
    );
  }

  public getVotingHistory(): Observable<APIResponse<VotingHistory[]>> {
    return this.httpClient.get<APIResponse<VotingHistory[]>>(
      URLConstants.BASE_URL + URLConstants.VOTING_HISTORY
    );
  }
}
