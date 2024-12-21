import {View, Text, StyleSheet, ScrollView, Image} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {userLikes} from "@/app/Entities/ParticipantsIteraction";

type likeModalProps = {
    likes: userLikes[];
}

const LikeModal = ({likes}: likeModalProps) => {

    return (
        <View style={styles.mainView}>
            <View style={styles.headerModal}>
                <Text style={{fontSize: 20, alignSelf: "center", fontWeight: 'bold', marginLeft: 10}}>J'aime</Text>
            </View>

            <ScrollView style={[styles.scrollView, {marginBottom : likes.length < 7   ? "80%" : 0}]}  showsVerticalScrollIndicator={false}>
                {likes.map((like, index) => (
                    <View key={index} style={styles.userLikeContainer}>
                        <Image
                            style={styles.userImage}
                            source={{uri: like.user.image}}
                        />
                        <Text style={{ fontSize: 12, fontWeight: "bold", marginLeft: 8 }}>{like.user.name}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default LikeModal;

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    headerModal: {
        flexDirection: 'row',
        paddingBottom: 20,
    },
    userLikeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
