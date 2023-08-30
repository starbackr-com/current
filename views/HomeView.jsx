import { View } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import globalStyles from '../styles/globalStyles';
// import CommentScreen from '../features/comments/views/CommentScreen';
import { storeData } from '../utils/cache/asyncStorage';
import { setTwitterModal } from '../features/introSlice';
// import GetStartedItems from '../features/homefeed/components/GetStartedItems';
import HomeFeed from '../features/homefeed/components/HomeFeed';
import ProfileNavigator from '../nav/ProfileNavigator';
import ThreadScreen from '../features/comments/views/ThreadScreen';

const HomeStack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const twitterModalShown = useSelector(
    (state) => state.intro.twitterModalShown,
  );
  const dispatch = useDispatch();
  const onLayoutViewHeight = (e) => {
    setHeight(e.nativeEvent.layout.height);
    if (!twitterModalShown) {
      navigation.navigate('TwitterModal');
      dispatch(setTwitterModal());
      storeData('twitterModalShown', 'true');
    }
  };

  const onLayoutViewWidth = (e) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={[globalStyles.screenContainer, { paddingTop: 0 }]}
      onLayout={onLayoutViewWidth}
    >
      {/* <GetStartedItems /> */}
      <View onLayout={onLayoutViewHeight} style={{ flex: 1, width: '100%' }}>
        <HomeFeed width={width} height={height} />
      </View>
    </View>
  );
};

const HomeView = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="HomeScreen"
  >
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="CommentScreen" component={ThreadScreen} />
    <HomeStack.Screen
      name="Profile"
      component={ProfileNavigator}
      options={() => ({
        headerShown: false,
      })}
    />
  </HomeStack.Navigator>
);

export default HomeView;
