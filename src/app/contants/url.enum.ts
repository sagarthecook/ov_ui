
export enum URLConstants {
    BASE_URL = 'http://localhost:8080',
    GENERATE_OTP = '/v1/user/generate_otp',
    LOGIN = '/v1/user/validate_otp',
    GET_CITIES = '/v1/cities/by-state/',
    GET_STATES = '/v1/states/by-country/',
    GET_COUNTRIES = '/v1/country/list',
    REGISTER_USER = '/v1/user/register',
    ADDRESS_SAVE = '/v1/address/',
    USER_DETAILS_SAVE = '/v1/user_detail',
    GET_USER_ROLES = '/v1/roles/',
    GET_MENU_ITEMS = '/v1/menu/user',
    GET_VOTER_DETAILS_LIST = '/v1/user_detail/findbyStatus?status=Pending&orderBy=created_date&order=desc'
}