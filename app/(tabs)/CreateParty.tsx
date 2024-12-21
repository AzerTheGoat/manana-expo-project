import React, {
    useEffect,
    useState,
} from "react";
import {
    ScrollView,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Button,
    Switch,
    Image,  // for showing user image
    LogBox,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { getUsers } from "../Providers/UserProvider";
import { PartyDisplayDTO } from "../Entities/PartyDisplayDTO";
import { UserDisplayDTO } from "../Entities/UserDisplayDTO";

const CreateParty = () => {
    const navigation = useNavigation();

    // Basic form states
    const [date, setDate] = useState(new Date());
    const [hour, setHour] = useState(new Date());
    const [isPrivate, setIsPrivate] = useState(false);
    const [partyName, setPartyName] = useState("");
    const [location, setLocation] = useState("");

    // For "autocomplete" participants
    const [allUsers, setAllUsers] = useState<UserDisplayDTO[]>([]);
    const [autocompleteText, setAutocompleteText] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserDisplayDTO[]>([]);
    const [errors, setErrors] = useState({ partyName: "", location: "", participants: "" });

    LogBox.ignoreAllLogs();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        navigation.setOptions({ tabBarStyle: { display: "none" } });

        // 1) Fetch all possible users on mount
        (async () => {
            try {
                const [newUser1, newUser2, newUser3, newUser4, newUser5] = await getUsers();
                // Suppose getUsers() returns an array of 5 users
                setAllUsers([newUser1, newUser2, newUser3, newUser4, newUser5]);
            } catch (error) {
                console.log("Error fetching users:", error);
            }
        })();
    }, [navigation]);

    // 2) Filter the user list based on the autocompleteText
    const filteredUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(autocompleteText.toLowerCase())
    );

    // Toggle the switch
    const toggleSwitch = () => setIsPrivate((previousState) => !previousState);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            const updatedHour = new Date(hour);
            updatedHour.setHours(selectedTime.getHours());
            updatedHour.setMinutes(selectedTime.getMinutes());
            setHour(updatedHour);
        }
    };

    // 3) When you pick a user from suggestions
    const handleSelectUser = (user: UserDisplayDTO) => {
        // Avoid duplicates
        if (selectedUsers.some((u) => u.name === user.name)) {
            setAutocompleteText("");
            return;
        }

        // Add selected user to array
        setSelectedUsers((prev) => [...prev, user]);
        // Clear the text
        setAutocompleteText("");
    };

    const handleRemoveUser = (name: string) => {
        // Remove from selected
        setSelectedUsers((prev) => prev.filter((u) => u.name !== name));
    };

    // 4) On form submit
    const handleSubmit = async () => {
        // Validate
        const newErrors = {
            partyName: partyName.trim() ? "" : "Party name is required.",
            location: location.trim() ? "" : "Location is required.",
            participants: selectedUsers.length ? "" : "At least 1 participant is required.",
        };
        setErrors(newErrors);

        // If no errors
        if (!Object.values(newErrors).some((error) => error)) {
            // Example: use first user as "owner"
            const owner = selectedUsers[0] || null;

            // Create Party DTO
            const partyDisplayDTO = new PartyDisplayDTO();
            partyDisplayDTO.title = partyName;
            partyDisplayDTO.location = location;
            partyDisplayDTO.owner = owner;
            partyDisplayDTO.date = date.toISOString();
            partyDisplayDTO.hour = hour.toISOString();
            partyDisplayDTO.isPrivate = isPrivate;

            // Convert selectedUsers into participants
            // (assuming the participant interface is { name: string, image: string, ... })
            partyDisplayDTO.participants = selectedUsers.map((u) => ({
                name: u.name,
                image: u.image,
            }));

            // Navigate or do what you want
            navigation.navigate("home", { party: partyDisplayDTO });
            router.setParams({ party: JSON.stringify(partyDisplayDTO) });

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Text style={styles.title}>Create Party !</Text>

                    {/* Party Name */}
                    <TextInput
                        placeholder="Nom de la soirée"
                        style={styles.textInput}
                        onChangeText={setPartyName}
                        value={partyName}
                    />
                    {errors.partyName ? <Text style={styles.errorText}>{errors.partyName}</Text> : null}

                    {/* Location */}
                    <TextInput
                        placeholder="Localisation"
                        style={styles.textInput}
                        onChangeText={setLocation}
                        value={location}
                    />
                    {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}

                    {/* Participants Autocomplete */}
                    <View style={styles.autocompleteContainer}>
                        <TextInput
                            placeholder="Type a participant's name..."
                            style={styles.textInput}
                            onChangeText={setAutocompleteText}
                            value={autocompleteText}
                        />
                        {/* Suggestions List */}
                        {autocompleteText.length > 0 && (
                            <View style={styles.suggestionsBox}>
                                {filteredUsers.map((user) => (
                                    <TouchableOpacity
                                        key={user.name}
                                        onPress={() => handleSelectUser(user)}
                                        style={styles.suggestionItem}
                                    >
                                        <Image
                                            source={{ uri: user.image }}
                                            style={styles.suggestionImage}
                                        />
                                        <Text>{user.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {errors.participants ? (
                        <Text style={styles.errorText}>{errors.participants}</Text>
                    ) : null}

                    {/* Display Selected Users */}
                    <View style={styles.selectedUsersContainer}>
                        {selectedUsers.map((user) => (
                            <TouchableOpacity onPress={() => handleRemoveUser(user.name)} key={user.name} style={styles.selectedUserChip}>
                                <Image source={{ uri: user.image }} style={styles.userChipImage} />
                                <Text style={{ marginHorizontal: 6 }}>{user.name}</Text>
                                <Text style={{ color: "red", fontWeight: "bold" }}>X</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* SELECT DATE */}
                    <View style={styles.selectDateContainer}>
                        <Text>Selected Date: {date.toDateString()}</Text>
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    </View>

                    {/* SELECT HOUR */}
                    <View style={styles.selectDateContainer}>
                        <Text>
                            Selected Hour: {hour.getHours().toString().padStart(2, "0")}:
                            {hour.getMinutes().toString().padStart(2, "0")}
                        </Text>
                        <DateTimePicker
                            testID="timePicker"
                            value={hour}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                        />
                    </View>

                    {/* PRIVATE SWITCH */}
                    <View style={styles.selectDateContainer}>
                        <Text>Do you want to keep this party private?</Text>
                        <Switch
                            onValueChange={toggleSwitch}
                            value={isPrivate}
                            trackColor={{ true: "#007AFF" }}
                        />
                    </View>

                    {/* SUBMIT BUTTON */}
                    <View style={styles.submitContainer}>
                        <Button title="Submit" color={"white"} onPress={handleSubmit} />
                    </View>

                    {/* BACK BUTTON */}
                    <View style={styles.btnContainer}>
                        <Button
                            title="Back"
                            color={"#333333"}
                            onPress={() => navigation.navigate("home")}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CreateParty;

const styles = StyleSheet.create({
    title: {
        fontSize: 45,
        color: "#333333",
        marginHorizontal: "5%",
        fontFamily: "Inter-Black",
        fontWeight: "bold",
        marginTop: "10%",
    },
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around",
    },
    textInput: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    autocompleteContainer: {
        position: "relative",
    },
    suggestionsBox: {
        position: "absolute",
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderColor: "#ccc",
        borderWidth: 1,
        zIndex: 2,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    suggestionImage: {
        width: 30,
        height: 30,
        marginRight: 8,
        borderRadius: 15,
    },
    selectedUsersContainer: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 10,
    },
    selectedUserChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    userChipImage: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 5,
    },
    btnContainer: {
        backgroundColor: "#E5E5E5",
        borderRadius: 10,
        marginTop: 10,
    },
    submitContainer: {
        backgroundColor: "#007AFF",
        marginTop: 10,
        borderRadius: 10,
    },
    selectDateContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});


