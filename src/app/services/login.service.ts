import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLConstants } from "../contants/url.enum";
import { APIResponse } from "../models/ApiResponse";


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private httpClient : HttpClient) { }

    // return typed APIResponse so callers can access success/message/data/errors
    generateOtp(userId: string) : Observable<APIResponse<any>> {
        
        return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.GENERATE_OTP, { userId:userId });
    }

    login(userId: string, otp: string) : Observable<any> {
        
        return this.httpClient.post<any>(URLConstants.BASE_URL + URLConstants.LOGIN, { userId:userId, otp: otp });
    }   

}