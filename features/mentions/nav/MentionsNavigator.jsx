import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "../../../styles/colors";
import { MentionsView, ZapMentionsView } from "../views";

const Tab = createMaterialTopTabNavigator();

const MentionsNavigator = () => {
  return (
      <Tab.Navigator
          screenOptions={{
              tabBarActiveTintColor: colors.primary500,
              tabBarStyle: {backgroundColor: colors.backgroundPrimary},
              tabBarIndicatorStyle: {borderColor: colors.primary500, backgroundColor: colors.primary500}
          }}
      >
          <Tab.Screen name="Mentions" component={MentionsView} />
          <Tab.Screen name="Zaps" component={ZapMentionsView} />
      </Tab.Navigator>
  );
};

export default MentionsNavigator;