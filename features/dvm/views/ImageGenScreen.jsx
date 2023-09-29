/* eslint-disable react/no-unstable-nested-components */
import { View, Text } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useScrollToTop } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import {
  CustomButton,
  CustomKeyboardView,
  ExpandableInput,
  MenuBottomSheet,
} from '../../../components';
import { useImageJob } from '../hooks';
import publishImageJob, {
  parseAndReplaceImages,
} from '../utils/publishImageJob';
import ImageGenResult from '../components/ImageGenResult';
import ImageGenRequest from '../components/ImageGenRequest';
import BackHeaderWithButton from '../../../components/BackHeaderWithButton';

const samplePrompts = [
  {
    title: 'A man with a beard',
    prompt: 'Close up portrait of a man with beard in a worn mech suit',
  },
  {
    title: 'Beautiful futuristic city',
    prompt:
      'Envision a captivating aerial view showcasing a modern futuristic lanscape design',
  },
  {
    title: 'Yellow car ',
    prompt:
      'is500, yellow body, vehicle focus, ground vehicle, motor vehicle, no humans, reflection, cloud, outdoors, sky',
  },
  {
    title: 'A delicious burger',
    prompt:
      'masterpiece, best quality,burger photo, food, food focus, no humans, tomato, blurry, still life, realistic, burger, cup, lettuce, fruit, onion, bowl, depth of field, vegetable, blurry background, cheese, bottle',
  },
  {
    title: 'Animated girl dancing',
    prompt: 'animation, portrait, young girl dancing in the rain ',
  },
  {
    title: 'A close up of a woman',
    prompt:
      'a close up of a woman wearing a helmet, robort, serious looking, portrait, rococo, looks straight ahead, glowing, realistic fantasy photography, dressed in light armor ',
  },
];

const ImageGenScreen = ({ navigation, route }) => {
  const { remixImg } = route?.params || {};

  const [inititalText, setInitialText] = useState();

  const listRef = useRef();
  const suggestionRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <BackHeaderWithButton
          rightButton={() => (
            <Ionicons
              size={24}
              color={colors.primary500}
              name="help-circle-outline"
              onPress={() => {
                suggestionRef.current.present();
              }}
            />
          )}
          navigation={navigation}
        />
      ),
    });
  }, [suggestionRef]);

  useEffect(() => {
    setInitialText(remixImg);
  }, [remixImg]);

  const events = useImageJob();
  const sortedEvents = events.sort((a, b) => b.created_at - a.created_at);

  useScrollToTop(listRef);

  const submitJob = (input) => {
    const [parsedContent, images] = parseAndReplaceImages(input);
    if (images.length > 1) {
      alert('Can not remix more than one image at a time!');
      return;
    }
    if (images.length < 1) {
      publishImageJob(parsedContent);
    } else {
      publishImageJob(parsedContent, images[0]);
    }
  };

  const renderEvent = ({ item }) => {
    if (item.kind === 65000) {
      return (
        <Text style={globalStyles.textBody}>{JSON.stringify(item.tags)}</Text>
      );
    }
    if (item.kind === 65005) {
      return <ImageGenRequest event={item} />;
    }
    return <ImageGenResult event={item} />;
  };

  return (
    <CustomKeyboardView>
      <View
        style={[
          globalStyles.screenContainer,
          {
            paddingTop: 0,
            borderTopColor: colors.backgroundSecondary,
            borderTopWidth: 1,
          },
        ]}
      >
        <FlatList
          data={sortedEvents}
          renderItem={renderEvent}
          contentContainerStyle={{ gap: 12 }}
          style={{ flex: 1, width: '100%' }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          inverted
          ref={listRef}
        />
        <ExpandableInput onSubmit={submitJob} initialText={inititalText} />
      </View>
      <MenuBottomSheet ref={suggestionRef}>
        <View style={{ gap: 5 }}>
          <Text style={globalStyles.textBody}>
            Sample prompts to get started:
          </Text>
          {samplePrompts.map((prompt) => (
            <CustomButton
              text={prompt.title}
              buttonConfig={{
                onPress: () => {
                  setInitialText(prompt.prompt);
                  suggestionRef.current.dismiss();
                },
              }}
            />
          ))}
        </View>
      </MenuBottomSheet>
    </CustomKeyboardView>
  );
};

export default ImageGenScreen;
