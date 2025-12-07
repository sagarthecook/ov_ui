import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLConstants } from "../contants/url.enum";
import { Observable } from "rxjs";
import { APIResponse } from "../models/ApiResponse";
import { DropdownModel } from "../models/dropdown.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {  

    constructor(private httpClient: HttpClient) { }

    public getCountries(): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_COUNTRIES);
    }
    public getStates(countryCode: string): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_STATES + countryCode);
}
}

