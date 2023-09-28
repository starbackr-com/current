/* eslint-disable react/no-unstable-nested-components */
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { MentionInput } from 'react-native-controlled-mentions';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { matchSorter } from 'match-sorter';
import { colors, globalStyles } from '../../../styles';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';
import {
  CustomButton,
  CustomKeyboardView,
  LoadingSpinner,
} from '../../../components';
import { parseInputMentions } from '../../../utils/nostrV2/mentions';
import { publishNote } from '../utils/publishNote';
import {
  pickSingleImage,
  resizeImageSmall,
  uploadJpeg,
} from '../../../utils/images';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { replaceText } from '../composeSlice';
import { MagicTextSheet } from '../components';
import ComposeToolBar from '../components/ComposeToolBar';
import { addReviewInteraction } from '../../userSlice';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginVertical: 12,
  },
  textBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary500,
    color: 'white',
    padding: 6,
    marginBottom: 6,
  },
});

const NewPostScreen = ({ navigation, route }) => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const text = useAppSelector((state) => state.compose.text);
  const dispatch = useAppDispatch();

  const { gif } = route?.params || {};
  const { image } = route?.params || {};

  const magicTextRef = useRef();

  const users = useSelector((state) => state.messages.users);
  const userArray = useMemo(
    () => Object.keys(users).map((user) => users[user]),
    [users],
  );

  const { pubKey, walletBearer } = useSelector((state) => state.auth);

  const submitHandler = async () => {
    setSending(true);
    try {
      const { parsedContent, mentionArray } = parseInputMentions(input);
      await publishNote(parsedContent, mentionArray);
      dispatch(addReviewInteraction());
      navigation.navigate('MainTabNav');
      return;
    } catch (e) {
      console.log(e);
    }
  };

  const imageHandler = async () => {
    setUploading(true);
    try {
      const pickedImage = await pickSingleImage();
      const manipImage = await resizeImageSmall(pickedImage);
      const imageUrl = await uploadJpeg(manipImage, pubKey, walletBearer);
      setInput((prev) => `${prev}\n${imageUrl}`);
      setUploading(false);
    } catch (e) {
      setUploading(false);
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          navigation={navigation}
          rightButton={() => (
            <CustomButton
              text="Send"
              icon="send"
              loading={sending}
              buttonConfig={{ onPress: submitHandler }}
            />
          )}
        />
      ),
    });
  }, [sending, submitHandler]);

  useLayoutEffect(() => {
    if (gif) {
      setInput((prev) => `${prev}\n${gif}`);
    }
    if (image) {
      setInput((prev) => `${prev}\n${image}`);
    }
  }, [gif, image]);

  const renderSuggestions = ({ keyword, onSuggestionPress }) => {
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
  };
  if (Platform.OS === 'android') {
    return (
      <View style={globalStyles.screenContainer}>
        <MentionInput
          value={text}
          containerStyle={styles.input}
          style={[
            globalStyles.textBody,
            { textAlign: 'left', flex: 1, verticalAlign: 'top' },
          ]}
          onChange={dispatch(replaceText)}
          partTypes={[
            {
              trigger: '@',
              renderSuggestions,
              textStyle: { color: colors.primary500 },
              isBottomMentionSuggestionsRender: true,
            },
          ]}
          multiline
          placeholderTextColor={colors.backgroundActive}
          placeholder="Type a message"
          autoFocus
        />
        <View
          style={{
            width: '100%',
            marginVertical: 6,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <Pressable onPress={imageHandler} disabled={uploading}>
            {!uploading ? (
              <Ionicons name="image" size={24} color={colors.primary500} />
            ) : (
              <LoadingSpinner size={24} />
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('PlebhySelector', { opener: 'PostNote' });
            }}
          >
            <MaterialIcons name="gif" size={24} color={colors.primary500} />
          </Pressable>
        </View>
      </View>
    );
  }
  return (
    <CustomKeyboardView noBottomBar>
      <View style={globalStyles.screenContainer}>
        <MentionInput
          value={text}
          containerStyle={styles.input}
          style={[globalStyles.textBody, { textAlign: 'left', flex: 1 }]}
          onChange={(inputText) => {
            dispatch(replaceText(inputText));
          }}
          partTypes={[
            {
              trigger: '@',
              renderSuggestions,
              textStyle: { color: colors.primary500 },
              isBottomMentionSuggestionsRender: true,
            },
          ]}
          multiline
          placeholderTextColor={colors.backgroundActive}
          placeholder="Type a message"
          autoFocus
        />
      </View>
      <ComposeToolBar ref={magicTextRef} />
      <MagicTextSheet ref={magicTextRef} />
    </CustomKeyboardView>
  );
};

export default NewPostScreen;
