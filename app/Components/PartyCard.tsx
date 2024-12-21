import React, {Dispatch, SetStateAction, useCallback, useMemo, useRef, useState, useEffect} from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Vibration,
    Button,
    ScrollView,
    Modal, Pressable
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import LikeModal from "@/app/Components/LikeModal";
import * as Haptics from 'expo-haptics';
import CommentModal from "@/app/Components/CommentModal";
import {useNavigation} from "expo-router";
import StarsModal from "@/app/Components/StarsModal";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import ParticipantsModal from "@/app/Components/ParticipantsModal";
import PartyDetails from "@/app/Components/PartyDetails";
import {PartyDisplayDTO} from "@/app/Entities/PartyDisplayDTO";
import {UserDisplayDTO} from "@/app/Entities/UserDisplayDTO";
import {participantsPost} from "@/app/Entities/ParticipantsPost";
import {userComment, userLikes, userStars} from "@/app/Entities/ParticipantsIteraction";
import uri from "ajv/lib/runtime/uri";
import DuringParty from "@/app/Components/DuringParty";

interface PartyCardProps {
    setModalComponent: Dispatch<SetStateAction<JSX.Element | null>>;
    partyDisplayDTO: PartyDisplayDTO;
    setDisplayingAddPartyButton: Dispatch<SetStateAction<boolean>>;
}

const PartyCard: React.FC<PartyCardProps> = ({ setModalComponent, partyDisplayDTO, setDisplayingAddPartyButton }) => {

    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);

    const maxVisibleParticipants = 3;

    // State and animation for the heart button
    const [liked, setLiked] = useState(false);
    const heartScale = useState(new Animated.Value(1))[0];

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a data fetching delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

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
        setDisplayingAddPartyButton(false);
    };

    const handleCommentPress = () => {
        setModalComponent(<CommentModal comments={partyDisplayDTO.comments} />); // Update modal component
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
        setDisplayingAddPartyButton(false);
    }

    const handleStarPress = () => {
        setModalComponent(<StarsModal stars={partyDisplayDTO.stars} />);
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
        setDisplayingAddPartyButton(false);
    }

    const handleParticipantsPress = () => {
        setModalComponent(<ParticipantsModal participants={partyDisplayDTO.participants}/>)
        navigation.setOptions({ tabBarStyle: { display: 'none' }  });
        setDisplayingAddPartyButton(false);
    }

    if (isLoading) {
        return (
            <View style={[styles.mainCardView, styles.loadingContainer]}>
                <ShimmerPlaceHolder
                    autoRun={true}
                    visible={isLoading}
                    style={styles.shimmerContainer}
                >
                    <View style={styles.shimmerHeader} />
                    <View style={styles.shimmerImage} />
                    <View style={styles.shimmerFooter} />
                </ShimmerPlaceHolder>
            </View>
        );
    }

    const handleCardPress = () => {
        setModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }

    return (
        <TouchableOpacity style={[styles.mainCardView]} onPress={handleCardPress} activeOpacity={1}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View style={styles.partyCreatorContainer}>
                    <Image
                        style={styles.userImage}
                        source={{uri : partyDisplayDTO.owner?.image}}
                    />
                    <Text style={{ fontSize: 12, fontWeight: "bold", marginLeft: 8 }}>{partyDisplayDTO.owner.name}</Text>
                </View>
                <TouchableOpacity onPress={handleParticipantsPress} activeOpacity={1}>
                    <View style={styles.participantContainer}>
                        {partyDisplayDTO.participants.slice(0, maxVisibleParticipants).map((participant, index) => (
                            <Image
                                key={index}
                                style={styles.userParticipantImage}
                                source={{uri : participant?.image}}
                            />
                        ))}
                        {partyDisplayDTO.participants.length > maxVisibleParticipants && (
                            <View style={styles.remainingParticipants}>
                                <Text style={styles.remainingText}>
                                    +{partyDisplayDTO.participants.length - maxVisibleParticipants}
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Card Image */}
            {partyDisplayDTO.imagePosts.length > 0 && (
                <Image
                    style={styles.cardImage}
                    source={{uri : partyDisplayDTO.imagePosts[0]?.image}}
                />
            )}

            {/* Card Footer */}
            <View style={styles.cardFooter}>
                <View style = {{flexDirection: "row", alignItems : "center", marginTop:10}}>
                    <TouchableOpacity onPress={handleHeartPress} activeOpacity={1}>
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
                <Text style={{ fontSize: 16, marginTop: 10 }}>{partyDisplayDTO.title}</Text>
            </View>

            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                {!partyDisplayDTO.stillActive ?
                    <PartyDetails partyDisplayDTO={partyDisplayDTO} setModalVisible={setModalVisible} />
                        :
                    <DuringParty partyDisplayDTO={partyDisplayDTO} setModalVisible={setModalVisible} />
                }
            </Modal>
        </TouchableOpacity>
    );
};

export default PartyCard;

const styles = StyleSheet.create({
    mainCardView: {
        backgroundColor: "white",
        marginBottom: 6,
        borderRadius: 7,
    },

    cardHeader: {
        marginHorizontal: 10,
        height: 50,
        backgroundColor: "white",
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
    },

    shimmerHeader: {
        height: 50,
        backgroundColor: "#ddd",
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
    },

    userImage: {
        height: 30,
        width: 30,
        borderRadius: 15,
    },

    partyCreatorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    participantContainer: {
        flexDirection: "row",
    },

    userParticipantImage: {
        height: 30,
        width: 30,
        borderRadius: 15,
        marginLeft: -14,
    },

    remainingParticipants: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -14,
    },

    remainingText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#555",
    },

    cardImage: {
        height: 250,
        width: "100%",
    },

    cardFooter: {
        marginLeft: 10,
        height: 70,
        flexDirection: "column",
        paddingHorizontal: 10,
    },

    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 350, // Adjust the height as needed
    },

    shimmerContainer: {
        width: '100%',
        height: '100%',
    },

    shimmerImage: {
        height: 250,
        backgroundColor: "#ddd",
    },

    shimmerFooter: {
        height: 70,
        backgroundColor: "#ddd",
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
    },

    button: {
        marginTop: 100,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },

    buttonClose: {
        backgroundColor: '#2196F3',
    },
});
