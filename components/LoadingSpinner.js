import { View, Text, StyleSheet } from "react-native";
import React,{useEffect} from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    cancelAnimation,
    Easing,
} from "react-native-reanimated";
import { useState } from "react";
import colors from "../styles/colors";

const LoadingSpinner = ({ size }) => {
    const rotation = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateZ: `${rotation.value}deg`,
                },
            ],
        };
    }, [rotation.value]);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1
        );
        return () => cancelAnimation(rotation);
    }, []);

    return (
        <Animated.View style={[{ height: size, width: size, borderRadius: size / 2, borderWidth: 4, borderBottomColor: colors.primary500, borderTopColor: colors.backgroundPrimary, borderLeftColor: colors.backgroundPrimary, borderRightColor: colors.backgroundPrimary }, animatedStyles]} />
    );
};

export default LoadingSpinner;
