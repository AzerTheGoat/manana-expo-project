import {View, Text, StyleSheet, ScrollView, Image} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart as solidHeart} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {userBingo, userLikes} from "@/app/Entities/ParticipantsIteraction";

type bingoModalProps = {
    bingos : userBingo[];
}

const bingoModal = ({bingos}: bingoModalProps) => {

    return (
        <View style={styles.mainView}>
            <View style={styles.headerModal}>
                <Text style={{fontSize: 20, alignSelf: "center", fontWeight: 'bold', marginLeft: 10}}>Bingos</Text>
            </View>

            <ScrollView style={[ {marginBottom : bingos.length < 7   ? "80%" : 0}]}  showsVerticalScrollIndicator={false}>
                {bingos.map((bingo, index) => (
                    <View style={styles.bingoCard}>
                        <Image
                            style={styles.userImage}
                            source={{uri: bingo.user.image}}
                        />
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: "bold"}}>{bingo.user.name} ({bingo.points} points)</Text>
                            <Text style={{ fontSize: 12, marginRight:60, marginTop:5 }}>{bingo.text}</Text>
                            <Text style={{ fontSize: 12, marginRight:60, marginTop:5, alignSelf:'flex-end' }}>approved by : {bingo.approvedBy.map(
                                (user, index) => (
                                    <Text key={index}>{user.name} </Text>
                                )
                            )}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>


        </View>
    );
}

export default bingoModal;

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'white',
        width: '100%',
        flex: 1,
    },

    headerModal: {
        flexDirection: 'row',
        paddingBottom: 20,
    },

    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        margin: 10,
    },

    bingoCard: {
        paddingVertical: 10,
        backgroundColor: "#F2F2F2",
        marginVertical: 5,
        borderRadius: 13,
        flexDirection: "row",
        alignItems: "center",
    }
});
