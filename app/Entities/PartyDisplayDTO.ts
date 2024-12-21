import {UserDisplayDTO} from "@/app/Entities/UserDisplayDTO";
import {imagePost, participantsPost, textPost} from "@/app/Entities/ParticipantsPost";
import {userBingo, userComment, userLikes, userStars} from "@/app/Entities/ParticipantsIteraction";

export class PartyDisplayDTO {
    id: string = '';
    owner?: UserDisplayDTO;
    participants: UserDisplayDTO[] = [];
    title: string = '';
    date: string = '';
    hour: string = '';
    location: string = '';
    strictLocation: string = '';
    locationAndDate: string = '';
    description: string = '';
    textPosts: textPost[] = [];
    imagePosts: imagePost[] = [];
    likes: userLikes[] = [];
    comments: userComment[] = [];
    stars: userStars[] = [];
    starsAverage: number = 0;
    bingos: userBingo[] = [];
    isPrivate: boolean = false;
    stillActive: boolean = true;
}



