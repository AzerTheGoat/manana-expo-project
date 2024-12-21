import {UserDisplayDTO} from "@/app/Entities/UserDisplayDTO";

export interface participantsPost {
    owner: UserDisplayDTO;
    date: Date;
    containImage?: boolean;
}


export class textPost implements participantsPost{
    owner?: UserDisplayDTO;
    date: Date;
    text: string = '';
    containImage: boolean = false;
    constructor(owner: UserDisplayDTO, date: Date, text: string){
        this.owner = owner;
        this.date = date;
        this.text = text;
    }
}

export class imagePost implements participantsPost{
    owner: UserDisplayDTO;
    date: Date;
    image: string = '';
    text: string = '';
    containImage: boolean = true;
    constructor(owner: UserDisplayDTO, date: Date, image: string, text: string){
        this.owner = owner;
        this.date = date;
        this.image = image;
        this.text = text;
    }
}
