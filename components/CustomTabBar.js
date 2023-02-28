import { View, Text, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <SafeAreaView style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
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
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
            <Ionicons name='search'/>
          </Pressable>
        );
      })}
      <Pressable
            style={{ flex: 1 }}
          >
            <Text style={{ color: '#222' }}>
              Test
            </Text>
            <Ionicons name='search'/>
          </Pressable>
    </SafeAreaView>
  );
}

export default CustomTabBar