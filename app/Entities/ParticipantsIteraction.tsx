import {UserDisplayDTO} from "@/app/Entities/UserDisplayDTO";

export class userLikes{
    user: UserDisplayDTO;
    like: boolean;
    constructor(user: UserDisplayDTO, like: boolean){
        this.user = user;
        this.like = like;
    }
}

export class userComment{
    user: UserDisplayDTO;
    comment: string;
    constructor(user: UserDisplayDTO, comment: string){
        this.user = user;
        this.comment = comment;
    }
}

export class userStars{
    user: UserDisplayDTO;
    stars: number;
    constructor(user: UserDisplayDTO, stars: number){
        this.user = user;
        this.stars = stars;
    }
}

export class userBingo{
    user : UserDisplayDTO;
    points : number;
    text : string;
    approved : boolean;
    approvedBy : UserDisplayDTO[];

    constructor(user: UserDisplayDTO, points: number, text: string, approved: boolean, approvedBy: UserDisplayDTO[]){
        this.user = user;
        this.points = points;
        this.text = text;
        this.approved = approved;
        this.approvedBy = approvedBy;
    }
}
