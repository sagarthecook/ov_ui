export class Party {
    name: string;
    presidentName: string;
    logoText: string;

    constructor(
        name: string = '',
        presidentName: string = '',
        logoText: string = ''
    ) {
        this.name = name;
        this.presidentName = presidentName;
        this.logoText = logoText;
    }
}