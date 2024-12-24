import {Button, Text, View, StyleSheet, TouchableOpacity, Animated, Image, ScrollView, LogBox} from "react-native";
import React, {Dispatch, SetStateAction, useCallback, useMemo, useRef, useState} from "react";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {PartyDisplayDTO} from "@/app/Entities/PartyDisplayDTO";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart as solidHeart, faStar as solidStar} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart} from "@fortawesome/free-regular-svg-icons";
import * as Haptics from "expo-haptics";
import LikeModal from "@/app/Components/LikeModal";
import CommentModal from "@/app/Components/CommentModal";
import StarsModal from "@/app/Components/StarsModal";
import {useNavigation} from "expo-router";
import ParticipantsModal from "@/app/Components/ParticipantsModal";
import {textPost} from "@/app/Entities/ParticipantsPost";
import TextPost from "@/app/Components/TextPost";
import ImagePost from "@/app/Components/ImagePost";
import BingoModal from "@/app/Components/BingoModal";

type partyDetailsProps = {
    partyDisplayDTO : PartyDisplayDTO;
    setModalVisible?: Dispatch<SetStateAction<boolean>>;
}


const PartyDetails = ({partyDisplayDTO, setModalVisible}: partyDetailsProps) => {
    const sheetRef = useRef<BottomSheet>(null);
    const [modalComponent, setModalComponent] = useState(null);

    LogBox.ignoreAllLogs();

    const snapPoints = useMemo(() => ["1%", "60%", "90%"], []);

    const handleSheetChange = useCallback((index: number) => {
        console.log("handleSheetChange", index);
        if (index === 0) {
            closeSheet();
        }
    }, []);

    const closeSheet = () => {
        sheetRef.current?.close();
        setModalComponent(null);
        navigation.setOptions({ tabBarStyle: { display: "flex" } });
    };


    const navigation = useNavigation();

    const [liked, setLiked] = useState(false);
    const heartScale = useState(new Animated.Value(1))[0];

    // juste avant de mettre en place la base de donnée, je vais melanger les post, apres on va tour organiser en fonction de la date
    const getAlternatingPosts = () => {
        const maxLength = Math.max(partyDisplayDTO.imagePosts.length, partyDisplayDTO.textPosts.length);
        const alternatingPosts = [];

        for (let i = 0; i < maxLength; i++) {
            if (i < partyDisplayDTO.imagePosts.length) {
                alternatingPosts.push({ type: "image", post: partyDisplayDTO.imagePosts[i] });
            }
            if (i < partyDisplayDTO.textPosts.length) {
                alternatingPosts.push({ type: "text", post: partyDisplayDTO.textPosts[i] });
            }
        }
        return alternatingPosts;
    };



    const handleHeartPress = () => {
        setLiked((prev) => !prev);
        if (!liked) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        Animated.sequence([
            Animated.timing(heartScale, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(heartScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleLikePress = () => {
        setModalComponent(<LikeModal likes={partyDisplayDTO.likes} />); // Update modal component
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
    };

    const handleCommentPress = () => {
        setModalComponent(<CommentModal comments={partyDisplayDTO.comments} />); // Update modal component
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
    }

    const handleStarPress = () => {
        setModalComponent(<StarsModal stars={partyDisplayDTO.stars} />);
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
    }

    const handleParticipantsPress = () => {
        setModalComponent(<ParticipantsModal participants={partyDisplayDTO.participants}/>)
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
    }

    const handleBingoPress = () => {
        setModalComponent(<BingoModal bingos={partyDisplayDTO.bingos}/>)
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
    }



    return (
        <GestureHandlerRootView>
            <ScrollView style = {{marginTop : "10%"}}>
                <Text style = {styles.title}>{partyDisplayDTO.title}</Text>
                <Text style = {styles.locationAndDate}>{partyDisplayDTO.locationAndDate}</Text>
                <View style = {{flexDirection: "row", alignItems : "center", marginTop:10, marginHorizontal:'5%'}}>
                    <TouchableOpacity onPress={handleHeartPress}>
                        <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                            <FontAwesomeIcon
                                size={22}
                                icon={liked ? solidHeart : faHeart}
                                color={liked ? 'red' : 'black'}
                            />
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLikePress} activeOpacity={1}> {/* Add this */}
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 7, marginRight: 7 }}>{partyDisplayDTO.likes.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCommentPress} style={{flexDirection:'row'}} activeOpacity={1}> {/* Add this */}
                        <FontAwesomeIcon size={22} icon={faComment} />
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 7, marginRight: 7 }}>{partyDisplayDTO.comments.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStarPress} style={{flexDirection:'row'}} activeOpacity={1}> {/* Add this */}
                        <FontAwesomeIcon size={22} icon={solidStar} color={'gold'} />
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 7 }}>
                            {partyDisplayDTO.starsAverage}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleParticipantsPress} activeOpacity={1}>
                    <Text style = {styles.participants}>Listes des participants : {partyDisplayDTO.participants.map((participant) => <Text>{participant.name}, </Text>)}</Text>
                </TouchableOpacity>
                <View style={styles.dividerContainer}>
                    <View style={styles.firstDivider} />
                    <Text style={styles.dividerText}>Posts</Text>
                    <View style={styles.secondDivider} />
                </View>

                {getAlternatingPosts().map((postData, index) => {
                    if (postData.type === "image") {
                        return <ImagePost key={index} participantPost={postData.post} />;
                    }
                    if (postData.type === "text") {
                        return <TextPost key={index} participantPost={postData.post} />;
                    }
                    return null;
                })}
                <View style ={{height:200}}>

                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={handleBingoPress}
                activeOpacity={1}
            >
                <View style={styles.bingoButton}><Text style={{color:'white'}}>Voir les bingo de la soirée</Text></View>
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
            >
                <View style={styles.backButton}><Text>Back</Text></View>
            </TouchableOpacity>
            {modalComponent && (
                <BottomSheet
                    ref={sheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChange}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 2,
                        shadowRadius: 10.32,
                        elevation: 16,
                    }}
                >
                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        {modalComponent}
                    </BottomSheetScrollView>
                </BottomSheet>
            )}
        </GestureHandlerRootView>
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 48,
        color: '#333333',
        marginHorizontal: "5%",
        fontFamily: 'Inter-Black',
        fontWeight: 'bold',
        marginTop: "10%",
    },

    locationAndDate: {
        fontSize: 14,
        color: '#333333',
        marginHorizontal: "5%",
        fontFamily: 'Inter-Black',
        fontWeight: 'bold',
    },

    contentContainer: {
        paddingLeft: "7%",
        paddingRight: "7%",
        paddingTop: "5%",
        alignItems: "center",
    },

    participants: {
        fontSize: 14,
        color: '#333333',
        marginHorizontal: "5%",
        fontFamily: 'Inter-Black',
        fontWeight: 'bold',
        marginTop: 7,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: "5%",
    },

    firstDivider: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },

    secondDivider: {
        flex: 6,
        height: 1,
        backgroundColor: "#ccc",
    },

    dividerText: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 10,
        fontWeight: "bold",
        color: "#333",
    },

    textPostContainer: {
        padding: 10,
        backgroundColor: "gray",
        flexDirection: "row",
        alignItems: "center",
    },

    userImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },

    bingoButton: {
        position: "absolute",
        bottom: 95,
        backgroundColor: "#007AFF",
        marginHorizontal: "5%",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        zIndex: 100,
        height: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10.32,
        elevation:10,
    },

    backButton: {
        position: "absolute",
        bottom: 50,
        backgroundColor: "#E5E5E5",
        marginHorizontal: "5%",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        zIndex: 100,
        height: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10.32,
        elevation:10,
    }
});


export default PartyDetails;
