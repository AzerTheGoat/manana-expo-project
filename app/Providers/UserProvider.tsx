import {UserDisplayDTO} from "@/app/Entities/UserDisplayDTO";
import {Image} from "react-native";
import { fetch } from 'expo/fetch';

import { Buffer } from 'buffer';

export async function fetchImageFromAPI(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the raw binary data
    const arrayBuffer = await response.arrayBuffer();


    // Convert that to a base64 string
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Optionally prepend the data URI scheme
    // so you can directly use it in an Image component source:
    // e.g. "data:image/jpeg;base64,xxx..."
    const mimeType = "image/jpeg"; // or "image/png" if needed
    const dataUri = `data:${mimeType};base64,${base64}`;

    return dataUri;
}


export async function getUsers(): Promise<UserDisplayDTO[]> {
    const base64Image3 = await fetchImageFromAPI('https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/9477/production/_126370083_gettyimages-1086438076.jpg')
    const base64Image4 = await fetchImageFromAPI('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7HXsowx2-ajIe0JzDrzQQ-MP33e7pkI_V8A&s')
    const base64Image5 = await fetchImageFromAPI('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNTid2JAkRzFIVIlo8EZnbUnr5rbPEc1v_zw&s')

    const newUser1 = new UserDisplayDTO("1", "Hamza", base64Image3);
    const newUser2 = new UserDisplayDTO("2", "Aymane", base64Image3);
    const newUser3 = new UserDisplayDTO("3", "Yassine", base64Image3);
    const newUser4 = new UserDisplayDTO("4", "Anas", base64Image4);
    const newUser5 = new UserDisplayDTO("5", "Othmane", base64Image5);

    return [newUser1, newUser2, newUser3, newUser4, newUser5];
}


export async function getPartyPictures() : Promise<string[]> {
    const base64Image3 : string= await fetchImageFromAPI('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw9RYH0kC4UU3YSb5fTfsQSkJm5LfgdCBedw&s')
    const base64Image4 : string= await fetchImageFromAPI('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOvVtGtCZ204JYL5IwX9u2LhiYefL5qDfDpA&s')
    const base64Image6 : string= await fetchImageFromAPI('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_eVc3k7VKJFahBZ-aQPba8ysH1Eam1LI-5Q&s')

    return [base64Image3, base64Image3, base64Image3, base64Image4, base64Image4, base64Image6];
}
