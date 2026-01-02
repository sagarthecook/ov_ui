import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../models/ApiResponse';
import { URLConstants } from '../contants/url.enum';
import { Observable } from 'rxjs';
import { Voter } from '../models/voter.model';

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
}
