import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Alert, Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import colors from "../../../styles/colors";
import globalStyles from "../../../styles/globalStyles";
import { useZapPlebhy } from "../hooks/useZapPlebhy";

const GifContainer = ({ item, width }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.messages.users[item.pTag])
  const zapPlebhy = useZapPlebhy()

  const yesHandler = () => {
      zapPlebhy(item.eTag, user, item.pTag)
      navigation.navigate("PostModal", { gif: item.result });
  };

  const noHandler = () => {
      navigation.navigate("PostModal", { gif: item.result });
  };

  const ratio = (width / 2) / item.width
  return (
      <Pressable
          onPress={() => {
              if (item.source === 'GIPHY') {
                  navigation.navigate("PostModal", { gif: item.result });
              } else if (item.source === 'PLEBHY' && user) {
                  Alert.alert('Support the creator?', `This GIF was created by ${user.name || item.pTag.slice(0,8)}. Do you want to send them a Zap?`, [{text: 'Yes!', onPress: yesHandler}, {text: 'No!', style:'destructive', onPress: noHandler}])
              }
          }}
      >
          <Image
              style={{
                  width: width / 2,
                  height: item.height * ratio,
              }}
              source={item.thumbnail}
              contentFit='cover'
          />
          <View
              style={{
                  position: "absolute",
                  backgroundColor:
                      item.source === "PLEBHY" ? colors.primary500 : "white",
                  padding: 3,
                  opacity: 0.8,
                  right: 5,
                  bottom: 5,
                  borderRadius: 2,
              }}
          >
              <Text style={[globalStyles.textBodyS, { color: "black" }]}>
                  {item.source}
              </Text>
          </View>
      </Pressable>
  );
};

export default GifContainer;