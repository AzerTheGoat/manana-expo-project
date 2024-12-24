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
    Switch,
    Image,
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

    // For controlling the Date/TimePicker display
    const [displayingDate, setDisplayingDate] = useState(false);
    const [displayingTime, setDisplayingTime] = useState(false);

    // For autocomplete participants
    const [allUsers, setAllUsers] = useState<UserDisplayDTO[]>([]);
    const [autocompleteText, setAutocompleteText] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<UserDisplayDTO[]>([]);
    const [errors, setErrors] = useState({ partyName: "", location: "", participants: "" });

    LogBox.ignoreAllLogs();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        navigation.setOptions({ tabBarStyle: { display: "none" } });

        // Fetch all possible users on mount
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

    // Filter the user list based on the autocompleteText
    const filteredUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(autocompleteText.toLowerCase())
    );

    // Toggle the switch for private
    const toggleSwitch = () => setIsPrivate((previous) => !previous);

    // Date picker
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setDisplayingDate(false);
    };

    // Time picker
    const onTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            const updatedHour = new Date(hour);
            updatedHour.setHours(selectedTime.getHours());
            updatedHour.setMinutes(selectedTime.getMinutes());
            setHour(updatedHour);
            setDisplayingTime(false);
        }
    };

    // Selecting a user from suggestions
    const handleSelectUser = (user: UserDisplayDTO) => {
        // Avoid duplicates
        if (selectedUsers.some((u) => u.name === user.name)) {
            setAutocompleteText("");
            return;
        }
        setSelectedUsers((prev) => [...prev, user]);
        setAutocompleteText("");
    };

    // Remove a user from the selected list
    const handleRemoveUser = (name: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u.name !== name));
    };

    // Submit form
    const handleSubmit = async () => {
        const newErrors = {
            partyName: partyName.trim() ? "" : "Party name is required.",
            location: location.trim() ? "" : "Location is required.",
            participants: selectedUsers.length ? "" : "At least 1 participant is required.",
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some((error) => error)) {
            const owner = selectedUsers[0] || null;
            const partyDisplayDTO = new PartyDisplayDTO();
            partyDisplayDTO.title = partyName;
            partyDisplayDTO.location = location;
            partyDisplayDTO.owner = owner;
            partyDisplayDTO.date = date.toISOString();
            partyDisplayDTO.hour = hour.toISOString();
            partyDisplayDTO.isPrivate = isPrivate;
            partyDisplayDTO.participants = selectedUsers.map((u) => ({
                name: u.name,
                image: u.image,
            }));

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
                            <TouchableOpacity
                                key={user.name}
                                style={styles.selectedUserChip}
                                onPress={() => handleRemoveUser(user.name)}
                            >
                                <Image source={{ uri: user.image }} style={styles.userChipImage} />
                                <Text style={{ marginHorizontal: 6 }}>{user.name}</Text>
                                <Text style={{ color: "red", fontWeight: "bold" }}>X</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* SELECT DATE */}
                    <View style={styles.selectDateContainer}>
                        <Text style={styles.selectedText}>Date: {date.toDateString()}</Text>
                        {Platform.OS === 'ios' || displayingDate ? (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.customButton}
                                onPress={() => setDisplayingDate(true)}
                            >
                                <Text style={styles.customButtonText}>Select Date</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* SELECT HOUR */}
                    <View style={styles.selectDateContainer}>
                        <Text style={styles.selectedText}>
                            Hour: {hour.getHours().toString().padStart(2, "0")}:
                            {hour.getMinutes().toString().padStart(2, "0")}
                        </Text>
                        {Platform.OS === 'ios' || displayingTime ? (
                            <DateTimePicker
                                testID="timePicker"
                                value={hour}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.customButton}
                                onPress={() => setDisplayingTime(true)}
                            >
                                <Text style={styles.customButtonText}>Select Hour</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* PRIVATE SWITCH */}
                    <View style={styles.selectDateContainer}>
                        <Text style={styles.selectedText}>Private Party?</Text>
                        <Switch
                            onValueChange={toggleSwitch}
                            value={isPrivate}
                            trackColor={{ true: "#007AFF" }}
                        />
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        style={styles.submitContainer}
                        onPress={handleSubmit}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>

                    {/* BACK BUTTON */}
                    <TouchableOpacity
                        style={styles.btnContainer}
                        onPress={() => navigation.navigate("home")}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CreateParty;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around",
    },
    title: {
        fontSize: 45,
        color: "#333333",
        marginHorizontal: "5%",
        fontFamily: "Inter-Black",
        fontWeight: "bold",
        marginTop: "10%",
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
    selectDateContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    selectedText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },

    // Custom button for "Select Date" & "Select Hour"
    customButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    customButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },

    // Submit button
    submitContainer: {
        backgroundColor: "#007AFF",
        marginTop: 10,
        borderRadius: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    // Back button
    btnContainer: {
        backgroundColor: "#E5E5E5",
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
        paddingVertical: 12,
    },
    backText: {
        color: "#333",
        fontSize: 16,
        fontWeight: "600",
    },
});
