/* eslint-disable react/no-unstable-nested-components */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { MentionInput } from 'react-native-controlled-mentions';
import { colors, globalStyles } from '../../../styles';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';
import { CustomButton, CustomKeyboardView } from '../../../components';
import { parseInputMentions } from '../../../utils/nostrV2/mentions';
import { publishNote } from '../utils/publishNote';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { replaceText } from '../composeSlice';
import { MagicTextSheet } from '../components';
import ComposeToolBar from '../components/ComposeToolBar';
import { addReviewInteraction } from '../../userSlice';
import useRenderMentions from '../../../hooks/useRenderMentions';

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

const NewPostScreen = ({ navigation }) => {
  const [sending, setSending] = useState(false);

  const text = useAppSelector((state) => state.compose.text);
  const dispatch = useAppDispatch();

  const magicTextRef = useRef();

  const renderSuggestions = useRenderMentions();

  const submitHandler = async () => {
    setSending(true);
    try {
      const { parsedContent, mentionArray } = parseInputMentions(text);
      await publishNote(parsedContent, mentionArray);
      dispatch(addReviewInteraction());
      dispatch(replaceText(''));
      navigation.navigate('MainTabNav');
      return;
    } catch (e) {
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
          modal
        />
      ),
    });
  }, [sending, submitHandler]);

  if (Platform.OS === 'android') {
    return (
      <View style={{ flex: 1 }}>
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
      </View>
    );
  }
  return (
    <CustomKeyboardView noBottomBar>
      <View style={[globalStyles.screenContainer, { paddingTop: 0 }]}>
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
