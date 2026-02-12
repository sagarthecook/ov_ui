export class Party {
    name: string;
    presidentName: string;
    logoUrl: string;

    constructor(
        name: string = '',
        presidentName: string = '',
        logoUrl: string = ''
    ) {
        this.name = name;
        this.presidentName = presidentName;
        this.logoUrl = logoUrl;
    }
}