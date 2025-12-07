
export class APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[];

    constructor(success: boolean, message: string, data: T, errors: string[] = []) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }    
    
}
