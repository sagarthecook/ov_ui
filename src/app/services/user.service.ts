import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLConstants } from "../contants/url.enum";
import { Observable } from "rxjs";
import { APIResponse } from "../models/ApiResponse";
import { Country } from "../models/Contry";

@Injectable({
    providedIn: 'root'
})
export class UserService {  

    constructor(private httpClient: HttpClient) { }

    public getCountries(): Observable<APIResponse<Country[]>> {
        return this.httpClient.get<APIResponse<Country[]>>(URLConstants.BASE_URL + URLConstants.GET_COUNTRIES);
    }
}

