import { View, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { imageRegex } from '../../../constants';
import devLog from '../../../utils/internal';
import { colors } from '../../../styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    borderWidth: 1, borderColor: colors.backgroundPrimary,
  },
});

const TrendingImages = () => {
  const [imageNotes, setImageNotes] = useState();
  const [viewWidth, setViewWidth] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    async function getTrendingImages() {
      try {
        const res = await fetch('https://api.nostr.band/v0/trending/images');
        if (!res.status === 200) {
          throw new Error('Request failed...');
        }
        const data = await res.json();
        const imageEvents = data.images.map((item) => item.event);
        setImageNotes(imageEvents.slice(0, 9));
      } catch (e) {
        devLog(e);
      }
    }
    getTrendingImages();
  }, []);

  const renderImage = (note) => {
    const imageURL = note.content.match(imageRegex);
    return (
      <Pressable
        onPress={() => {
          navigation.push('CommentScreen', { eventId: note.id });
        }}
        key={note.id}
      >
        <Image
          style={[styles.image, { width: viewWidth / 3, height: viewWidth / 3 }]}
          source={imageURL}
          transition={300}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        setViewWidth(e.nativeEvent.layout.width);
      }}
    >
      {imageNotes ? imageNotes.map(renderImage) : undefined}
    </View>
  );
};

export default TrendingImages;
