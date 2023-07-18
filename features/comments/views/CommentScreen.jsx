import {
  View,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import Input from '../../../components/Input';
import CommentHeader from '../components/CommentHeader';
import { useReplies } from '../hooks/useReplies';
import BackButton from '../../../components/BackButton';
import { publishReply } from '../utils/publishReply';
import { getEventById } from '../../../utils/nostrV2/getEvents';
import { ImagePost, TextPost } from '../../../components/Posts';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { colors, globalStyles } from '../../../styles';
import { ItemSeperator } from '../components';
import PostMenuBottomSheet from '../../../components/PostMenuBottomSheet';
import CustomKeyboardView from '../../../components/CustomKeyboardView';

const CommentScreen = ({ route, navigation }) => {
  const { eventId } = route?.params || {};
  const [event, setEvent] = useState();
  const [width, setWidth] = useState();
  const [input, setInput] = useState('');
  const { height } = useWindowDimensions();
  const replies = useReplies(eventId);
  const users = useSelector((state) => state.messages.users);
  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetModalRef = useRef();

  const handlePresentModalPress = (data) => {
    bottomSheetModalRef.current?.present(data);
  };

  const onLayoutViewWidth = (e) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const getEvent = async () => {
    const parentEvent = await getEventById(eventId);
    setEvent(parentEvent);
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

  const submitHandler = async () => {
    setIsLoading(true);
    const success = await publishReply(input, event);
    if (!success) {
      Alert.alert('Something went wrong publishing your note...');
    } else {
      setInput('');
    }
    setIsLoading(false);
  };

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
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.backgroundPrimary,
            paddingVertical: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Input
              textInputConfig={{
                multiline: true,
                onChangeText: setInput,
                value: input,
              }}
              inputStyle={{ maxHeight: height / 5 }}
            />
          </View>
          {!isLoading ? (
            <Ionicons
              name="send"
              size={24}
              color={colors.primary500}
              style={{ marginLeft: 12 }}
              onPress={submitHandler}
            />
          ) : (
            <View style={{ marginLeft: 12 }}>
              <LoadingSpinner size={24} />
            </View>
          )}
        </View>
        <PostMenuBottomSheet ref={bottomSheetModalRef} />
      </View>
    </CustomKeyboardView>
  );
};

export default CommentScreen;
