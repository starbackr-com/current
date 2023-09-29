import { useCallback, useMemo } from "react";
import { useAppSelector } from "./stateHooks";
import { matchSorter } from "match-sorter";
import { Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { colors, globalStyles } from "../styles";

const useRenderMentions = () => {
  const users = useAppSelector((state) => state.messages.users);
  const userArray = useMemo(
    () => Object.keys(users).map((user) => users[user]),
    [users],
  );
  const renderSuggestions = useCallback(({ keyword, onSuggestionPress }) => {
    if (keyword == null || keyword.length < 1) {
      return null;
    }
    const matches = matchSorter(userArray, keyword, { keys: ['name'] })
      .slice(0, 5)
      .map((result) => ({ name: result.name, id: result.pubkey }));

    return (
      <View>
        <FlatList
          data={matches}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSuggestionPress(item)}
              style={{
                paddingHorizontal: 6,
                paddingVertical: 3,
                backgroundColor: colors.backgroundActive,
                borderRadius: 10,
                margin: 4,
              }}
            >
              <Text style={globalStyles.textBody}>{item.name}</Text>
            </Pressable>
          )}
          horizontal
          contentContainerStyle={{ gap: 10, marginBottom: 10 }}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }, [userArray]);
  return renderSuggestions;
};

export default useRenderMentions;