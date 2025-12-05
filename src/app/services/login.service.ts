import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URLConstants } from "../contants/url.enum";


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private httpClient : HttpClient) { }

    generateOtp(userId: string) : Observable<any> {
        
        return this.httpClient.post<any>(URLConstants.BASE_URL + URLConstants.GENERATE_OTP, { userId:userId });
    }


}   