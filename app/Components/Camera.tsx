import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Easing,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback, LogBox, // <-- Import this
} from 'react-native';
import {
    CameraView,
    CameraType,
    useCameraPermissions,
} from 'expo-camera';
import { faArrowLeftLong, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from 'expo-router';

type CameraProps = {
    setOpenCameraModal : Dispatch<SetStateAction<boolean>>;
    onImageSubmit?: (uri: string, caption: string) => void; // <-- NEW
};

const Camera = ({setOpenCameraModal, onImageSubmit} : CameraProps) => {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    LogBox.ignoreAllLogs();

    const cameraRef = useRef<CameraView>(null);

    // Camera permission
    const [permission, requestPermission] = useCameraPermissions();

    // State for front/back camera
    const [cameraType, setCameraType] = useState<CameraType>('back');

    // State to store the photo we captured
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    // For the caption
    const [caption, setCaption] = useState<string>('');

    // For a simple flip animation
    const flipAnim = useRef(new Animated.Value(0)).current;

    // Toggle front/back camera
    const toggleCamera = () => {
        setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    // Take a photo
    const capturePhoto = async () => {
        if (!cameraRef.current) return;
        try {
            console.log('hey')
            // Take picture with base64
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                skipProcessing: false,
            });
            console.log('Photo captured:', photo.uri);

            // Save the URI to display the photo
            setCapturedPhoto(photo.uri);


            // Run the flip animation
            Animated.timing(flipAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.log('Error capturing photo:', error);
        }
    };

    // If permissions are still being loaded or not requested yet
    if (!permission) {
        return <View style={styles.container} />;
    }

    // If permissions not granted
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // If we have a photo, render it; else render the camera
    const frontRotation = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Submit action (e.g., handle caption or do something else)
    const handleSubmit = () => {
        if (onImageSubmit && capturedPhoto) {
            // Pass the photo URI & caption up to the parent
            onImageSubmit(capturedPhoto, caption);
        }
        // Optionally, close camera
        setOpenCameraModal(false);
    };

    return (
        // Wrap everything in TouchableWithoutFeedback
        <TouchableWithoutFeedback
            onPress={() => {
                // Hide keyboard when tapping outside the TextInput
                Keyboard.dismiss();
            }}
            accessible={false} // helps ignore accessibility focus on this wrapper
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                {capturedPhoto ? (
                    // "Flipped" view with the captured photo
                    <Animated.View
                        style={[
                            styles.capturedPhotoContainer,
                            {
                                transform: [{ rotateY: frontRotation }],
                            },
                        ]}
                    >
                        {/* Return (close) button in top-left */}
                        <TouchableOpacity
                            style={styles.returnButton}
                            onPress={() => {
                                setCapturedPhoto(null);
                                setCaption(''); // reset caption if user navigates back
                            }}
                        >
                            <FontAwesomeIcon size={22} icon={faArrowLeftLong} color={'black'} />
                        </TouchableOpacity>

                        {/* Preview the photo */}
                        <Image pointerEvents="none" source={{ uri: capturedPhoto }} style={styles.capturedPhoto} />

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
                    </Animated.View>
                ) : (
                    // Live camera preview
                    <CameraView ref={cameraRef} style={styles.cameraView} facing={cameraType}>
                        {/* Return (close) button in top-left */}
                        <TouchableOpacity
                            style={styles.returnButton}
                            onPress={() => {
                                setOpenCameraModal(false);
                            }}
                        >
                            <FontAwesomeIcon size={22} icon={faArrowLeftLong} color={'black'} />
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={toggleCamera}>
                                <Text style={styles.buttonText}>Flip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
                                <Text style={styles.captureButtonText}>Capture</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                )}
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    permissionButton: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        backgroundColor: '#007AFF', // iOS blue
        alignSelf: 'center',
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cameraView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgba(255,255,255,0.4)',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 24,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
    captureButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 35,
    },
    captureButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
    capturedPhotoContainer: {
        flex: 1,
        // center the photo
        justifyContent: 'center',
        alignItems: 'center',
    },
    capturedPhoto: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    returnButton: {
        position: 'absolute',
        top: 80,
        left: 30,

        width: 50,
        height: 50,
        borderRadius: 25,

        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',

        // iOS-like shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4, // for Android
        zIndex: 100,
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
});


export default Camera;
