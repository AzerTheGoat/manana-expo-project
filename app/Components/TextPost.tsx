import {Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import PartyDetails from "@/app/Components/PartyDetails";
import {participantsPost, textPost} from "@/app/Entities/ParticipantsPost";

type TextPostProps = {
    participantPost: textPost;
}


const TextPost = ({participantPost}: TextPostProps) => {
    return (
    <View style = {styles.textPostContainer}>
        <Image
            style={styles.userImage}
            source={{uri: participantPost.owner.image}}
        />
        <View style={{ marginHorizontal: 25 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold" , marginBottom: 5}}>{participantPost.owner.name}</Text>
            <Text style={{ fontSize: 12, marginRight: 30 }}>{participantPost.text}</Text>
        </View>
    </View>
    )
}


const styles = StyleSheet.create({
    textPostContainer: {
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 13,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 10.32,
    },

    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
});


export default TextPost;
