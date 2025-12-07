export class DropdownModel {
    id:number;
    name:string;
    isActive:boolean;

    constructor(id: number, name: string, isActive: boolean) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}