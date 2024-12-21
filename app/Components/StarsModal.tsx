import {View, Text, StyleSheet, ScrollView, Image} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import React from "react";
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar} from '@fortawesome/free-regular-svg-icons';
import {userStars} from "@/app/Entities/ParticipantsIteraction";

type starsModalProps = {
    stars: userStars[];
}

const StarsModal = ({stars}: starsModalProps) => {

    return (
        <View style={styles.mainView}>
            <View style={styles.headerModal}>
                <Text style={{fontSize: 20, alignSelf: "center", fontWeight: 'bold', marginLeft: 10}}>Stars</Text>
            </View>

            <ScrollView style={[styles.scrollView, {marginBottom : stars.length < 7   ? "80%" : 0}]}  showsVerticalScrollIndicator={false}>
                {stars.map((star, index) => (
                    <View key={index} style={styles.userStarsContainer}>
                        <Image
                            style={styles.userImage}
                            source={{uri: star.user.image}}
                        />
                        <View style={{marginLeft : 20}}>
                            <Text style={{ fontSize: 12, fontWeight: "bold", marginLeft: 3 }}>{star.user.name}</Text>
                            <View style={{flexDirection: "row"}}>
                                {[1, 2, 3, 4, 5].map((starValue, index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        size={20}
                                        icon={starValue <= star.stars ? solidStar : faStar}
                                        color={starValue <= star.stars ? 'gold' : 'gray'}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export default StarsModal;

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
    userStarsContainer: {
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
