import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Party} from '../models/party.model';
import {APIResponse} from '../models/ApiResponse';
import {URLConstants} from '../contants/url.enum';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PartyService {
    constructor(private httpClient: HttpClient) {}
    public saveParty(partyData: Party): Observable<APIResponse<any>> {
        return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.SAVE_PARTY, partyData );
    }
}