import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
    useEffect,
} from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ScrollView,
    LogBox,
    TextInput,
} from "react-native";

import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PartyDisplayDTO } from "@/app/Entities/PartyDisplayDTO";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart as solidHeart, faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faTextHeight, faImage, faCamera, faFileImage} from "@fortawesome/free-solid-svg-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from 'expo-image-picker';
import LikeModal from "@/app/Components/LikeModal";
import CommentModal from "@/app/Components/CommentModal";
import StarsModal from "@/app/Components/StarsModal";
import ParticipantsModal from "@/app/Components/ParticipantsModal";
import BingoModal from "@/app/Components/BingoModal";
import { useNavigation } from "expo-router";

// Your post components
import TextPost from "@/app/Components/TextPost";
import ImagePost from "@/app/Components/ImagePost";
import Camera from "@/app/Components/Camera";
import {getUsers} from "@/app/Providers/UserProvider";
import {imagePost, textPost} from "@/app/Entities/ParticipantsPost";
import AddTextToImageInPost from "@/app/Components/AddTextToImageInPost";

/** PROPS */
type DuringPartyProps = {
    partyDisplayDTO: PartyDisplayDTO;
    setModalVisible?: Dispatch<SetStateAction<boolean>>;
};

const DuringParty = ({ partyDisplayDTO, setModalVisible }: DuringPartyProps) => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // 1. Local state copy of your party data so changes cause re-renders.
    const [localPartyDisplayDTO, setLocalPartyDisplayDTO] = useState<PartyDisplayDTO>(
        partyDisplayDTO
    );

    const [addingCaptionToImageModal, setAddingCaptionToImageModal] = useState(false);
    const [imageToAddCaption, setImageToAddCaption] = useState("");

    // Manage the bottom sheet for "Send Text Post"
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [displayTextPostBottomSheet, setDisplayTextPostBottomSheet] = useState(false);

    // Keep track of the user's text input
    const [textPostInput, setTextPostInput] = useState("");

    // For "open camera"
    const [openCameraModal, setOpenCameraModal] = useState(false);

    // For other modals
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["1%", "60%", "90%"], []);
    const snapPoints2 = useMemo(() => ["1%", "35%", "70%"], []);
    const [modalComponent, setModalComponent] = useState<JSX.Element | null>(null);

    // Show/hide the buttons for adding content
    const [displayAddContentButtons, setDisplayAddContentButtons] = useState(false);

    // Animations
    const textPostIconOpacity = useRef(new Animated.Value(0)).current;
    const imagePostIconOpacity = useRef(new Animated.Value(0)).current;
    const textPostIconTranslateX = useRef(new Animated.Value(100)).current;
    const imagePostIconTranslateX = useRef(new Animated.Value(100)).current;

    // "Like" animation
    const [liked, setLiked] = useState(false);
    const heartScale = useState(new Animated.Value(1))[0];

    // QUIET ALL LOGS (optional)
    LogBox.ignoreAllLogs();

    //-------------------------------------------------------------------------------------------
    // BOTTOM SHEET / TEXT POST LOGIC
    //-------------------------------------------------------------------------------------------
    const handleTextSheetChanges = useCallback((index: number) => {
        if (index === 0) {
            closeTextBottomSheet();
        }
    }, []);

    const closeTextBottomSheet = () => {
        bottomSheetRef.current?.close();
        setDisplayTextPostBottomSheet(false);
    };

    // This function is called when the user taps the "Send" button in the bottom sheet.
    const handleSendTextPost = async () => {

        const [user1, user2, user3, user4, user5] = await getUsers();

        // Optional: simple validation
        if (!textPostInput.trim()) return;


        const newTextPost : textPost = {
            owner: user1,
            date: new Date(),
            text: textPostInput.trim(),
            containImage: false
        }

        // Update the localPartyDisplayDTO state by pushing the new text post
        setLocalPartyDisplayDTO({
            ...localPartyDisplayDTO,
            textPosts: [newTextPost, ...localPartyDisplayDTO.textPosts],
        });

        // Clear the input and close the bottom sheet
        setTextPostInput("");
        bottomSheetRef.current?.close();
        setDisplayTextPostBottomSheet(false);
    };

    //-------------------------------------------------------------------------------------------
    // OTHER BOTTOM SHEET (LIKE, COMMENT, STARS, ETC.)
    //-------------------------------------------------------------------------------------------
    const handleSheetChange = useCallback((index: number) => {
        if (index === 0) {
            closeSheet();
        }
    }, []);

    const closeSheet = () => {
        sheetRef.current?.close();
        setModalComponent(null);
        // Potentially restore tab bar:
        navigation.setOptions({ tabBarStyle: { display: "flex" } });
        setDisplayAddContentButtons(false);
    };

    //-------------------------------------------------------------------------------------------
    // TRIGGERING YOUR MODALS / CAMERA
    //-------------------------------------------------------------------------------------------
    const handleImagePost = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setOpenCameraModal(true);
        setDisplayAddContentButtons(false);
    };

    const handleTextPost = () => {
        setDisplayTextPostBottomSheet(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setDisplayAddContentButtons(false);
    };

    const handleAddImage = async (imageUri: string, caption: string) => {
        const [user1, user2, user3, user4, user5] = await getUsers();

        console.log("Adding image post with URI: ", imageUri);

        // Create a new "image post" object (structure up to you)
        const newImagePost : imagePost = {
            owner: user1,
            date: new Date(),
            image: imageUri,
            text: caption,
            containImage: true

        };

        // Insert it at the front (most recent first) or end, your call:
        setLocalPartyDisplayDTO((prev) => ({
            ...prev,
            imagePosts: [newImagePost, ...prev.imagePosts],
        }));
    };


    const handlePickImage = async () => {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Request permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        setDisplayAddContentButtons(false);

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;

            setImageToAddCaption(selectedImageUri);
            setAddingCaptionToImageModal(true);
        }
    };

    //-------------------------------------------------------------------------------------------
    // "ADD CONTENT" BUTTONS ANIMATION
    //-------------------------------------------------------------------------------------------
    const handleAddContentButton = () => {
        setDisplayAddContentButtons(!displayAddContentButtons);

        if (!displayAddContentButtons) {
            // Show
            Animated.parallel([
                Animated.timing(textPostIconOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(imagePostIconOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(textPostIconTranslateX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(imagePostIconTranslateX, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Hide
            Animated.parallel([
                Animated.timing(textPostIconOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(imagePostIconOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(textPostIconTranslateX, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(imagePostIconTranslateX, {
                    toValue: 100,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    //-------------------------------------------------------------------------------------------
    // SAMPLE "LIKE" / "COMMENT" / "STAR" HANDLERS
    //-------------------------------------------------------------------------------------------
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
        setModalComponent(<LikeModal likes={localPartyDisplayDTO.likes} />);
        closeTextBottomSheet();
        setDisplayAddContentButtons(false);
    };

    const handleCommentPress = () => {
        setModalComponent(<CommentModal comments={localPartyDisplayDTO.comments} />);
        closeTextBottomSheet();
        setDisplayAddContentButtons(false);
    };

    const handleStarPress = () => {
        setModalComponent(<StarsModal stars={localPartyDisplayDTO.stars} />);
        closeTextBottomSheet();
        setDisplayAddContentButtons(false);
    };

    const handleParticipantsPress = () => {
        setModalComponent(<ParticipantsModal participants={localPartyDisplayDTO.participants} />);
        closeTextBottomSheet();
        setDisplayAddContentButtons(false);
    };

    const handleBingoPress = () => {
        setModalComponent(<BingoModal bingos={localPartyDisplayDTO.bingos} />);
        closeTextBottomSheet();
        navigation.setOptions({ tabBarStyle: { display: "none" } });
        setDisplayAddContentButtons(false);
    };

    //-------------------------------------------------------------------------------------------
    // MAIN RENDER
    //-------------------------------------------------------------------------------------------
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* If user has NOT opened the camera, display the main UI */}
            {!addingCaptionToImageModal && !openCameraModal && (
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ marginTop: "10%" }}>
                        <Text style={styles.title}>{localPartyDisplayDTO.title}</Text>
                        <Text style={styles.locationAndDate}>
                            {localPartyDisplayDTO.locationAndDate}
                        </Text>

                        {/* Like/Comment/Star Row */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                                marginHorizontal: "5%",
                            }}
                        >
                            <TouchableOpacity onPress={handleHeartPress}>
                                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                                    <FontAwesomeIcon
                                        size={22}
                                        icon={liked ? solidHeart : faHeart}
                                        color={liked ? "red" : "black"}
                                    />
                                </Animated.View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLikePress} activeOpacity={1}>
                                <Text style={styles.likeCommentText}>
                                    {localPartyDisplayDTO.likes.length}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleCommentPress}
                                style={{ flexDirection: "row" }}
                                activeOpacity={1}
                            >
                                <FontAwesomeIcon size={22} icon={faComment} />
                                <Text style={styles.likeCommentText}>
                                    {localPartyDisplayDTO.comments.length}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleStarPress}
                                style={{ flexDirection: "row" }}
                                activeOpacity={1}
                            >
                                <FontAwesomeIcon size={22} icon={solidStar} color={"gold"} />
                                <Text style={styles.likeCommentText}>
                                    {localPartyDisplayDTO.starsAverage}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleParticipantsPress} activeOpacity={1}>
                            <Text style={styles.participants}>
                                Listes des participants :{" "}
                                {localPartyDisplayDTO.participants.map((participant, index) => (
                                    <Text key={index}>{participant.name}, </Text>
                                ))}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBingoPress}>
                            <View style={styles.remplirBingo}>
                                <Text>Remplir le bingo</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.firstDivider} />
                            <Text style={styles.dividerText}>Posts</Text>
                            <View style={styles.secondDivider} />
                        </View>

                        {/* Render Text + Image Posts */}
                        {localPartyDisplayDTO.textPosts.map((postData, index) =>
                            <TextPost key={index} participantPost={postData} />
                        )}
                        {localPartyDisplayDTO.imagePosts.map((postData, index) =>
                            <ImagePost key={index} participantPost={postData} />
                        )}



                        {/* Spacer at bottom */}
                        <View style={{ height: 200 }} />
                    </ScrollView>

                    {/* Animated "Add Content" Buttons */}
                    {displayAddContentButtons && (
                        <View>
                            <TouchableOpacity onPress={handlePickImage} activeOpacity={1}>
                                <Animated.View
                                    style={[
                                        styles.textPostIcon,
                                        {
                                            marginLeft:60,
                                            opacity: textPostIconOpacity,
                                            transform: [{ translateX: textPostIconTranslateX }],
                                        },
                                    ]}
                                >
                                    <FontAwesomeIcon size={25} icon={faFileImage} color={"black"} />
                                </Animated.View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleTextPost} activeOpacity={1}>
                                <Animated.View
                                    style={[
                                        styles.textPostIcon,
                                        {
                                            opacity: textPostIconOpacity,
                                            transform: [{ translateX: textPostIconTranslateX }],
                                        },
                                    ]}
                                >
                                    <FontAwesomeIcon size={25} icon={faTextHeight} color={"black"} />
                                </Animated.View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleImagePost}>
                                <Animated.View
                                    style={[
                                        styles.imagePostIcon,
                                        {
                                            opacity: imagePostIconOpacity,
                                            transform: [{ translateX: imagePostIconTranslateX }],
                                        },
                                    ]}
                                >
                                    <FontAwesomeIcon size={25} icon={faCamera} color={"black"} />
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Floating "Add Content" button */}
                    <TouchableOpacity onPress={handleAddContentButton} activeOpacity={1} >
                        <View style={styles.addContentButton}>
                            <Text style={{ color: "white" }}>Ajouter du contenu</Text>
                        </View>
                    </TouchableOpacity>

                    {/* "Back" button */}
                    {setModalVisible && (
                        <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={1}>
                            <View style={styles.backButton}>
                                <Text>Back</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Bottom sheet for Like/Comment/Star/Participants etc. */}
                    {modalComponent && (
                        <BottomSheet
                            ref={sheetRef}
                            index={1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChange}
                            style={styles.modalShadow}
                        >
                            <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                                {modalComponent}
                            </BottomSheetScrollView>
                        </BottomSheet>
                    )}

                    {/* Bottom sheet for adding text post */}
                    {displayTextPostBottomSheet && (
                        <BottomSheet
                            ref={bottomSheetRef}
                            index={1}
                            snapPoints={snapPoints2}
                            keyboardBehavior="extend"
                            enableDynamicSizing={false}
                            onChange={handleTextSheetChanges}
                            style={styles.modalShadow}
                        >
                            {/* The text input */}
                            <BottomSheetTextInput
                                placeholder="Insert your text"
                                style={styles.input}
                                multiline={true}
                                value={textPostInput}
                                onChangeText={setTextPostInput}
                            />

                            {/* Send Button */}
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSendTextPost}
                            >
                                <Text style={{ color: "white" }}>Send</Text>
                            </TouchableOpacity>
                        </BottomSheet>
                    )}
                </View>
            )}

            {/* If user chooses to open the camera */}
            {!addingCaptionToImageModal && openCameraModal && <Camera setOpenCameraModal={setOpenCameraModal} onImageSubmit={handleAddImage} />}

            {addingCaptionToImageModal && (
                <AddTextToImageInPost uri={imageToAddCaption} handleAddImage={handleAddImage} setAddingCaptionToImageModal={setAddingCaptionToImageModal} />
            )
            }
        </GestureHandlerRootView>
    );
};

/** STYLES */
const styles = StyleSheet.create({
    title: {
        fontSize: 48,
        color: "#333333",
        marginHorizontal: "5%",
        fontFamily: "Inter-Black",
        fontWeight: "bold",
        marginTop: "10%",
    },
    locationAndDate: {
        fontSize: 14,
        color: "#333333",
        marginHorizontal: "5%",
        fontFamily: "Inter-Black",
        fontWeight: "bold",
    },
    likeCommentText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 7,
        marginRight: 7,
    },
    participants: {
        fontSize: 14,
        color: "#333333",
        marginHorizontal: "5%",
        fontFamily: "Inter-Black",
        fontWeight: "bold",
        marginTop: 7,
    },
    remplirBingo: {
        backgroundColor: "#E5E5E5",
        marginHorizontal: "5%",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        height: 40,
        marginTop: 10,
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

    contentContainer: {
        paddingLeft: "7%",
        paddingRight: "7%",
        paddingTop: "5%",
        alignItems: "center",
    },

    addContentButton: {
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
        elevation: 10,
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
        elevation: 10,
    },

    textPostIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 150,
        zIndex: 2,
        backgroundColor: "white",
        left: 80,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 10.32,
        elevation: 20,
    },

    imagePostIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: 150,
        zIndex: 2,
        left: 20,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 10.32,
        elevation: 20,
    },

    capturedPhotoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modalShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 2,
        shadowRadius: 10.32,
        elevation: 16,
    },

    postTitleContainer: {
        backgroundColor: "#007AFF",
        marginTop: 40,
        borderRadius: 10,
        height: 40,
        marginHorizontal: "5%",
        justifyContent: "center",
        alignItems: "center",
        bottom: "5%",
    },
    postTitleText: {
        color: "white",
        fontWeight: "bold",
    },

    input: {
        marginTop: "5%",
        height: 120,
        marginHorizontal: "5%",
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: "white",
    },
    sendButton: {
        backgroundColor: "#007AFF",
        borderRadius: 10,
        paddingVertical: 10,
        marginHorizontal: "5%",
        alignItems: "center",
        marginBottom: 10,
    },
});

export default DuringParty;
