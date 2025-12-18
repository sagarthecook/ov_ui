import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { URLConstants } from "../contants/url.enum";
import { Observable } from "rxjs";
import { APIResponse } from "../models/ApiResponse";
import { DropdownModel } from "../models/dropdown.model";
import { MenuItem } from "../models/menu.model";


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

    public getCities(stateCode: string): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_CITIES + stateCode);
    }

    public saveAddress(address: any): Observable<APIResponse<any>> {
        return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.ADDRESS_SAVE, address);
    }

    public getMenuItems(): Observable<APIResponse<MenuItem[]>> {
        return this.httpClient.get<APIResponse<MenuItem[]>>(URLConstants.BASE_URL + URLConstants.GET_MENU_ITEMS);
    }

    public getVoterDetailsList(): Observable<APIResponse<any[]>> {
        return this.httpClient.get<APIResponse<any[]>>(URLConstants.BASE_URL + URLConstants.GET_VOTER_DETAILS_LIST);
    }

    public saveUserDetails(userDetails: any, photo: File | null, addressId: string, roleId: string): Observable<APIResponse<any>> {
            const formData = new FormData();
           if (photo) {
               formData.append('photo', photo);
           }
           userDetails.address = {};
           userDetails.role = {};
           userDetails.role = {
             id: roleId 
            };

           userDetails.address = {
                id: addressId
           }
           formData.append('user', JSON.stringify(userDetails));

        return this.httpClient.post<APIResponse<any>>(URLConstants.BASE_URL + URLConstants.USER_DETAILS_SAVE, formData);
    }

    public getUserRoles(): Observable<APIResponse<DropdownModel[]>> {
        return this.httpClient.get<APIResponse<DropdownModel[]>>(URLConstants.BASE_URL + URLConstants.GET_USER_ROLES);
    }

    public getVotersForVerification(): Observable<APIResponse<any[]>> {
        return this.httpClient.get<APIResponse<any[]>>(URLConstants.BASE_URL + '/voters/pending-verification');
    }

    public updateVoterVerificationStatus(voterId: string, status: string): Observable<APIResponse<any>> {
        return this.httpClient.put<APIResponse<any>>(
            URLConstants.BASE_URL + `/voters/${voterId}/verification-status`, 
            { status }
        );
    }
}

