import * as React from "react";
import { View, StyleSheet, Button } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const VideoPlayer = () => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    return (
        <View>
            <Video
                ref={video}
                style={{ height: 200, width: 200, borderRadius: 10 }}
                source={{
                    uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            <Pressable
                style={{
                    position: "absolute",
                    right: 0,
                    left: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={() => {
                    status.isPlaying
                        ? video.current.pauseAsync()
                        : video.current.playAsync();
                }}
            >
                {status.isPlaying ? undefined : <Ionicons name="play" color="white" size={50} />}
            </Pressable>
        </View>
    );
};

export default VideoPlayer;
