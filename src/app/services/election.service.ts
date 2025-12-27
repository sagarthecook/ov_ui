import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Election } from "../models/election.model";
import { APIResponse } from "../models/ApiResponse";
import { URLConstants } from "../contants/url.enum";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ElectionService {
        constructor(private httpClient: HttpClient) { }

 public createElection(electionData: Election): Observable<APIResponse<any>> {
        return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + '/v1/election', electionData);
    }

    public getElectionsForVerification(status: string): Observable<APIResponse<any[]>> {
        return this.httpClient.get<APIResponse<any[]>>(URLConstants.BASE_URL + `/v1/election/findbystatus?status=${status}`);
    }   

}