import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Election } from "../models/election.model";
import { APIResponse } from "../models/ApiResponse";
import { URLConstants } from "../contants/url.enum";
import { Observable } from "rxjs";
import { DropdownModel } from "../models/dropdown.model";

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

    public updateElectionStatus(electionId: number, status: string): Observable<APIResponse<any>> {
      const reqBody = { status: status };
        return this.httpClient.patch<APIResponse<any>>(URLConstants.BASE_URL + `/v1/election/status/`+
            electionId, reqBody);
    }
    
    public getElectionById(electionId: number): Observable<APIResponse<Election>> {
        return this.httpClient.get<APIResponse<Election>>(URLConstants.BASE_URL + `/v1/election/` + electionId);
    }

     public getElections(): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_ELECTION);
    
   }

     public getparty(): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_PARTY);
    } 

    public getElectionDetails(electionId: number): Observable<APIResponse<ElectionDetail>> {
        return this.httpClient.get<APIResponse<ElectionDetail>>(URLConstants.BASE_URL + URLConstants.ELECTION_DETAILS + electionId);
    }

    public publishElection(electionId: number,note:string): Observable<APIResponse<any>> {
        return this.httpClient.patch<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.PUBLISH_ELECTION + electionId, {  'isPublish':true,
            'note': note});
    }

    public sendNotification(electionId: number): Observable<APIResponse<any>> {
        return this.httpClient.get<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.SEND_NOTIFICATION + electionId);
    }

    public getEligibleElection(): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_ELIGIBLE_ELECTION);
    }

}
