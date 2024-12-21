import {Animated, Image, LogBox, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart as solidHeart, faStar as solidStar} from "@fortawesome/free-solid-svg-icons";
import React, {useRef, useState} from "react";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import * as Haptics from 'expo-haptics';
import {userComment} from "@/app/Entities/ParticipantsIteraction";

type commentModalProps = {
    comments: userComment[];
}
const CommentModal = ({comments}: commentModalProps) => {

    const [userComment, setUserComment] = useState<string>("");

    LogBox.ignoreAllLogs();

    const animatedValue = useRef(new Animated.Value(0)).current;

    const handleSubmit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();

    };


    return (
        <View style={styles.mainView} >
            <View style = {styles.headerModal}>
                <Text style={{fontSize: 20, alignSelf: "center", fontWeight: 'bold', marginLeft: 10}}>Commentaires</Text>
            </View>

            <View style={styles.userCommentInput}>
                <TextInput
                    style={styles.input}
                    onChangeText={setUserComment}
                    value={userComment}
                    placeholder="Write your comment"
                    multiline={true}
                />
                <TouchableOpacity style={[styles.submitComment]} onPress={handleSubmit}>
                    <FontAwesomeIcon size={22} icon={faAngleDown} color={'black'}/>
                </TouchableOpacity>
            </View>

            <ScrollView style={[styles.scrollView, {marginBottom : comments.length < 7   ? "80%" : 0}]}  showsVerticalScrollIndicator={false}>
                {comments.map((comment, index) => (
                    <View key={index} style={styles.userCommentContainer}>
                        <Image
                            style={styles.userImage}
                            source={{uri: comment.user.image}}
                        />
                        <View>
                            <Text style={{ fontSize: 12, fontWeight: "bold", marginLeft: 8 }}>{comment.user.name}</Text>
                            <Text style={{ fontSize: 12, marginLeft: 8, marginRight:60,  marginTop:5 }}>{comment.comment}</Text>
                        </View>
                    </View>
                ))
                }
            </ScrollView>
        </View>
    )
}

export default CommentModal;

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'column',
    },

    scrollView: {
        marginTop: 30,
        backgroundColor: "white",
    },

    headerModal: {
        flexDirection: 'row',
    },

    userCommentContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15
    },

    userImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },

    input: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingVertical: 10,
        width: '85%',
        borderWidth: 1,
        borderRadius: 17,
    },

    userCommentInput: {
        flexDirection: "row",
        alignItems: "center",
        width: '100%',
        bottom : 5,
        marginTop: 30,
        height: 50,
    },

    submitComment: {
        backgroundColor: "lightgrey",
        height: 35,
        width: "15%",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    }
})
