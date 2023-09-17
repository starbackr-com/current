import {
  View,
  // useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
// import Input from '../../../components/Input';
import CommentHeader from '../components/CommentHeader';
import { useReplies } from '../hooks/useReplies';
import BackButton from '../../../components/BackButton';
import { publishReply } from '../utils/publishReply';
import { getEventById } from '../../../utils/nostrV2/getEvents';
import { ImagePost, TextPost } from '../../../components/Posts';
// import LoadingSpinner from '../../../components/LoadingSpinner';
import { globalStyles } from '../../../styles';
import { ItemSeperator } from '../components';
import PostMenuBottomSheet from '../../../components/PostMenuBottomSheet';
import CustomKeyboardView from '../../../components/CustomKeyboardView';
import { ExpandableInput } from '../../../components';

const CommentScreen = ({ route, navigation }) => {
  const { eventId } = route?.params || {};
  const [event, setEvent] = useState();
  const [width, setWidth] = useState();
  // const { height } = useWindowDimensions();
  const replies = useReplies(eventId);
  const users = useSelector((state) => state.messages.users);

  const bottomSheetModalRef = useRef();

  const handlePresentModalPress = (data) => {
    bottomSheetModalRef.current?.present(data);
  };

  const onLayoutViewWidth = (e) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const getEvent = async () => {
    try {
      const parentEvent = await getEventById(eventId);
      setEvent(parentEvent);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  const renderItem = ({ item }) => {
    if (item.kind === 1) {
      if (item.type === 'text') {
        return (
          <TextPost
            event={item}
            user={users[item.pubkey]}
            onMenu={handlePresentModalPress}
          />
        );
      }
      if (item.type === 'image') {
        return (
          <ImagePost
            event={item}
            user={users[item.pubkey]}
            width={width}
            onMenu={handlePresentModalPress}
          />
        );
      }
    }
    return undefined;
  };

  const submitHandler = useCallback(
    async (input) => {
      const success = await publishReply(input, event);
      if (!success) {
        Alert.alert('Something went wrong publishing your note...');
      }
    },
    [event],
  );

  return (
    <CustomKeyboardView>
      <View style={globalStyles.screenContainer}>
        <View style={{ width: '100%' }}>
          <BackButton
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        {event ? (
          <View style={{ flex: 1, width: '100%' }} onLayout={onLayoutViewWidth}>
            <FlashList
              ListHeaderComponent={<CommentHeader parentEvent={event} />}
              data={replies}
              renderItem={renderItem}
              extraData={users}
              ItemSeparatorComponent={ItemSeperator}
              estimatedItemSize={100}
              keyExtractor={(item) => item.id}
            />
          </View>
        ) : (
          <ActivityIndicator style={{ flex: 1 }} />
        )}
        <ExpandableInput onSubmit={submitHandler} />
        <PostMenuBottomSheet ref={bottomSheetModalRef} />
      </View>
    </CustomKeyboardView>
  );
};

export default CommentScreen;
