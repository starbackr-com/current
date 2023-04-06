import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../styles/colors";
import globalStyles from "../../../styles/globalStyles";

const Mention = ({ item }) => {
  const user = useSelector((state) => state.messages.users[item.pubkey]);
  const pTags = item.tags.filter((tag) => tag[0] === "p");
  const navigation = useNavigation();
  return (
      <Pressable
          style={{ flexDirection: "row", width: "100%", padding: 6 }}
          onPress={() => {
              navigation.navigate("CommentScreen", {
                  eventId: item.id,
                  rootId: item.root,
                  type: "root",
                  event: item,
              });
          }}
      >
          <Image
              source={
                  user?.picture ||
                  require("../../../assets/user_placeholder.jpg")
              }
              style={{ height: 50, width: 50, borderRadius: 25 }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                  style={[globalStyles.textBodyBold, { textAlign: "left" }]}
              >
                  {user?.name || item.pubkey.slice(0, 16)}
              </Text>
              <Text
                  style={[
                      globalStyles.textBodyS,
                      { color: colors.primary500, textAlign: "left" },
                  ]}
              >
                  {`Reply to you and ${pTags.length - 1} others...`}
              </Text>
              <View>
                  <Text
                      style={[globalStyles.textBody, { textAlign: "left" }]}
                      numberOfLines={6}
                  >
                      {item.content}
                  </Text>
              </View>
          </View>
      </Pressable>
  );
};

export default Mention;