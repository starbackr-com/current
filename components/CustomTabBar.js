import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

function CustomTabBar({ state, descriptors, navigation }) {
    const height = useSharedValue(50)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: height.value,
      };
    }, [])

    return (
        <SafeAreaView style={{width: '100%'}}>
            <Animated.View style={[{ flexDirection: "row"}, animatedStyle]}>
                {state.routes.map((route, index) => {
                    console.log(descriptors[route.key]);
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({
                                name: route.name,
                                merge: true,
                            });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={
                                isFocused ? { selected: true } : {}
                            }
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: 1, alignItems: 'center' }}
                        >
                            <Text
                                style={{
                                    color: isFocused ? "#673ab7" : "#222",
                                }}
                            >
                                {label}
                            </Text>
                            <Ionicons name="search" />
                        </Pressable>
                    );
                })}
                <Pressable style={{ flex: 1, alignItems: 'center' }} onPress={() => {height.value = withTiming(Math.random()*200)}}>
                    <Text style={{ color: "#222" }}>Test</Text>
                    <Ionicons name="search" />
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}

export default CustomTabBar;
