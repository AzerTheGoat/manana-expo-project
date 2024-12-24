import {
    ScrollView,
    Text,
    StyleSheet,
    View, TouchableOpacity, LogBox,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {SplashScreen, useLocalSearchParams, useNavigation} from "expo-router";
import PartyCard from "../Components/PartyCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { UserDisplayDTO } from "../Entities/UserDisplayDTO";
import { PartyDisplayDTO } from "../Entities/PartyDisplayDTO";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { Image } from "react-native";
import {userBingo, userComment, userLikes, userStars} from "../Entities/ParticipantsIteraction";
import {imagePost, textPost} from "../Entities/ParticipantsPost";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import * as Haptics from "expo-haptics";
import {getPartyPictures, getUsers, preloadImages} from "../Providers/UserProvider";
import PartyDetails from "../Components/PartyDetails";
import {useFonts} from "expo-font";


SplashScreen.preventAutoHideAsync();

const HomeScreen = (route) => {
    const [parties, setParties] = useState<PartyDisplayDTO[]>([]);
    const [displayindAddPartyButton, setDisplayingAddPartyButton] = useState(true);

    LogBox.ignoreAllLogs();

    const params = useLocalSearchParams<{ party: string }>();

    const [loaded, error] = useFonts({
        'IgBold': require('../../assets/fonts/Instagram Sans Bold.ttf'),
        'IgLigth': require('../../assets/fonts/Instagram Sans Light.ttf'),
        'IgMedium': require('../../assets/fonts/Instagram Sans Medium.ttf'),
        'IgHeadline': require('../../assets/fonts/Instagram Sans Headline.otf'),

    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);


    useEffect(() => {
        if (params.party) {
            try {
                const party = JSON.parse(params.party);
                setParties([...parties, party]);
            } catch (error) {
                console.error("Failed to parse params.party:", error);
            }
        } else {
            console.warn("params.party is undefined or empty");
        }
    }, [params.party]);


    const navigation = useNavigation();

    const sheetRef = useRef<BottomSheet>(null);
    const [modalComponent, setModalComponent] = useState(null);

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
        setDisplayingAddPartyButton(true);
    };

    const handleAddPartyButton = () => {
        navigation.navigate("CreateParty");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {

        const fetchData = async () => {

            let [newUser1, newUser2, newUser3, newUser4, newUser5]  = await getUsers();

            let [image1, image2, image3, image4, image5] = await getPartyPictures();

            // User likes
            const userLikes : userLikes = [
                {user: newUser1, like: true},
                {user: newUser2, like: true},
                {user: newUser3, like: true},
                {user: newUser4, like: true},
                {user: newUser5, like: true},
                {user: newUser1, like: true},
                {user: newUser2, like: true},
                {user: newUser3, like: true},
                {user: newUser4, like: true},
                {user: newUser5, like: true},
                {user: newUser1, like: true},
                {user: newUser2, like: true},
                {user: newUser3, like: true},
                {user: newUser4, like: true},
                {user: newUser5, like: true},
            ];



            // User comments
            const userComments :userComment = [
                {user: newUser1, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. "},
                {user: newUser3, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. "},
                {user: newUser4, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Qu",},
                {user: newUser5, comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ali",},
            ];

            // User stars
            const userStars : userStars = [
                {user: newUser1, stars: 5},
                {user: newUser2, stars: 4},
                {user: newUser3, stars: 3},
                {user: newUser4, stars: 2},
                {user: newUser5, stars: 1},
                {user: newUser1, stars: 4},
                {user: newUser2, stars: 3},
                {user: newUser3, stars: 2},
                {user: newUser4, stars: 1},
                {user: newUser5, stars: 5},
                {user: newUser1, stars: 3},
            ];

            // party post text
            const textPosts : textPost[] = [
                {owner: newUser1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: false},
                {owner: newUser2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: false},
                {owner: newUser3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: false},
                {owner: newUser4, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: false},
            ]

            // party post image
            const imagePosts : imagePost[] = [
                {owner: newUser1, image: image1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: true},
                {owner: newUser2, image: image2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: true},
                {owner: newUser3, image: image3, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: true},
                {owner: newUser4, image: image4, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: true},
                {owner: newUser5, image: image5, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutpat. Quisque tempus sapien quis ligula maximus, ac fermentum arcu molestie. Quisque in ex in eros vulputate hendrerit. Aliquam erat volutpat. Duis eu placerat orci. ", date: new Date(), containImage: true},
            ]

            // bingos
            const bingos : userBingo = [
                {user: newUser1, points: 5, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: true, approvedBy: [newUser1]},
                {user: newUser2, points: 15, text: "This is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: false, approvedBy: [newUser1, newUser2]},
                {user: newUser3, points: 15, text: "This is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: false, approvedBy: [newUser1, newUser2,newUser2,newUser2,newUser2,newUser2,newUser2]},
                {user: newUser4, points: 15, text: "This is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: false, approvedBy: [newUser1, newUser2]},
                {user: newUser5, points: 15, text: "This is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: false, approvedBy: [newUser1, newUser2]},
                {user: newUser2, points: 15, text: "This is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: false, approvedBy: [newUser1, newUser2]},
                {user: newUser1, points: 15, text: "This is a Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum malesuada malesuada. Quisque consequat lorem a ante vulputate suscipit. Curabitur eleifend nunc sed vulputate volutp", approved: false, approvedBy: [newUser1, newUser2]},
            ]

            const party = new PartyDisplayDTO();
            party.id = "1";
            party.owner = newUser1;
            party.participants = [newUser1, newUser2, newUser3, newUser4, newUser5];
            party.title = "Beach Party";
            party.date = "new Date()";
            party.location = "Agadir";
            party.description = "This is a beach party";
            party.locationAndDate = "Soirée organisée par Hamza, le 14 novembre à Agadir.";
            party.textPosts = textPosts;
            party.imagePosts = imagePosts;
            party.likes = userLikes;
            party.comments = userComments;
            party.stars = userStars;
            party.starsAverage = 3.1;
            party.bingos = bingos;
            party.isPrivate = false;
            party.stillActive = false;

            setParties([party]);
        };

        fetchData().then(r => console.log("Data fetched"));
    }, []);

    return (
        <GestureHandlerRootView style={styles.mainView}>
            <View style={styles.mainView}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={styles.welcomeText}>Welcome Hamza🥳!</Text>

                    {/* Divider */}
                    {parties.filter(party => party.stillActive).length > 0 && (
                        <View style={styles.dividerContainer}>
                            <View style={styles.firstDivider} />
                            <Text style={styles.dividerText}>Soirée en cours</Text>
                            <View style={styles.secondDivider} />
                        </View>
                    )}

                    {parties.filter(party => party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}

                    {/* Another Divider */}
                    {parties.filter(party => !party.stillActive).length > 0 && (
                        <View style={styles.dividerContainer}>
                            <View style={styles.firstDivider} />
                            <Text style={styles.dividerText}>Mes soirées</Text>
                            <View style={styles.secondDivider} />
                        </View>
                    )}

                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}
                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}
                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}
                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}
                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}
                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}
                    {parties.filter(party => !party.stillActive).map((party, index) => (
                        <PartyCard key={index} partyDisplayDTO={party} setModalComponent={setModalComponent} setDisplayingAddPartyButton={setDisplayingAddPartyButton} />
                    ))}

                </ScrollView>
                {/*Create a party*/}
                {displayindAddPartyButton && (
                <TouchableOpacity style={styles.addPartyButton} activeOpacity={1} onPress={handleAddPartyButton}>
                    <FontAwesomeIcon icon={faPlus} size={25} color={"white"}/>
                </TouchableOpacity>
                )}

            </View>

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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 200,
    },
    contentContainer: {
        paddingLeft: "7%",
        paddingRight: "7%",
        paddingTop: "5%",
        alignItems: "center",
    },
    mainView: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollView: {
        flex: 1,
        backgroundColor: "white",
        marginTop: "10%",
    },
    welcomeText: {
        marginHorizontal: "5%",
        fontWeight: "bold",
        fontSize: 64,
        color: '#333333',
        fontFamily: 'IgBold',
        marginTop: "10%",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        marginHorizontal: 10,
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
        fontFamily: 'IgMeduim',
        color: "#333",
    },
    addPartyButton: {
        position: "absolute",
        bottom: 20,
        zIndex: 2,
        right: 20,
        backgroundColor: "#007AFF",
        height: 50,
        width: 50,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default HomeScreen;
