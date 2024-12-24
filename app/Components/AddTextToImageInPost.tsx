import {
    Image, Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from "react-native";
import React, {Dispatch, SetStateAction, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

type AddTextToImageInPostProps = {
    uri: string;
    handleAddImage: (uri: string, caption: string) => void;
    setAddingCaptionToImageModal:Dispatch<SetStateAction<boolean>>;
}

const AddTextToImageInPost = ({uri, handleAddImage, setAddingCaptionToImageModal}: AddTextToImageInPostProps) => {
    const [caption, setCaption] = useState<string>('');

    const handleSubmit = () => {
        console.log('Submitting caption:', caption);
        console.log('Submitting uri:', uri);
        // Send the caption to the parent component
        handleAddImage(uri, caption);
        setAddingCaptionToImageModal(false);
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                // Hide keyboard when tapping outside the TextInput
                Keyboard.dismiss();
            }}
            accessible={false} // helps ignore accessibility focus on this wrapper
        >
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}  // Adjust this offset if needed
            >

            {uri && (
                <Image
                    source={{ uri: uri }}
                    style={styles.imagePreview}  // Apply explicit size
                    resizeMode="contain"  // Ensures the image fits without distortion
                />

            )}
            {/* Caption Input + Submit Button at bottom */}
            <View style={styles.captionContainer}>
                <TextInput
                    style={styles.captionInput}
                    placeholder="Add text to your picture..."
                    placeholderTextColor="#888"
                    value={caption}
                    onChangeText={setCaption}
                    // On iOS, pressing 'Return' can also submit:
                    onSubmitEditing={handleSubmit}
                    blurOnSubmit={false}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <FontAwesomeIcon icon={faPaperPlane} size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "black", // dark overlay
        justifyContent: "center",
        alignItems: "center",
    },
    captionContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,

        flexDirection: 'row',
        alignItems: 'center',

        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,

        // Shadows
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    captionInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        marginRight: 10,
        paddingHorizontal: 5,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: 300,  // or '100%' to make it responsive
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    }

});




export default AddTextToImageInPost;
