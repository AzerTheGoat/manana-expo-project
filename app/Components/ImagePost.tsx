import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    Pressable,
} from "react-native";
import { imagePost } from "@/app/Entities/ParticipantsPost";

type ImagePostProps = {
    participantPost: imagePost;
};

const ImagePost = ({ participantPost }: ImagePostProps) => {
    // State for showing/hiding the full-screen image modal
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.imagePostContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Image
                    style={styles.userImage}
                    source={{ uri: participantPost.owner.image }}
                />
                <Text style={{ fontSize: 12, fontWeight: "bold", marginLeft: 8 }}>
                    {participantPost.owner.name}
                </Text>
            </View>

            {/* Image Thumbnail */}
            <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={1}>
                <Image
                    style={styles.cardImage}
                    source={{ uri: participantPost.image }}
                />
            </TouchableOpacity>

            {/* Caption */}
            {participantPost.text.length > 0 && (
                <Text style={{ fontSize: 12, padding: 20 }}>{participantPost.text}</Text>
            )}

            {/* Full-Screen Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                {/*
          Pressing outside (or pressing the image itself)
          can dismiss the modal.
        */}
                <Pressable
                    style={styles.modalContainer}
                    onPress={() => setModalVisible(false)}
                >
                    <Image
                        style={styles.fullImage}
                        source={{ uri: participantPost.image }}
                        resizeMode="contain"
                    />
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    imagePostContainer: {
        backgroundColor: "#F2F2F2",
        marginHorizontal: '5%',
        marginVertical: 10,
        borderRadius: 13,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 10.32,
        elevation: 5,
    },

    headerContainer: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    userImage: {
        height: 30,
        width: 30,
        borderRadius: 15,
    },

    cardImage: {
        height: 350,
        width: "100%",
    },

    /* Modal overlay that darkens the background: */
    modalContainer: {
        flex: 1,
        backgroundColor: "black", // dark overlay
        justifyContent: "center",
        alignItems: "center",
    },

    /* Image in full size, centered, with space around */
    fullImage: {
        width: "100%",
        height: "100%",
    },
});

export default ImagePost;
