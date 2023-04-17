import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import { useBadge } from '../hooks';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 12,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
  },
  active: {
    borderColor: colors.primary500,
    borderWidth: 1,
  },
  actionItems: {
    flexDirection: 'row',
  },
});

const AwardedBadge = ({
  badgeUID,
  onUp,
  onDown,
  onPress,
  active,
  section,
}) => {
  const badge = useBadge(badgeUID);
  let thumbSrc;
  let imageSrc;
  let name;
  if (badge) {
    const thumbTag = badge.tags.filter((tag) => tag[0] === 'thumb');
    const imageTag = badge.tags.filter((tag) => tag[0] === 'image');
    if (thumbTag.length > 0) {
      [[, thumbSrc]] = thumbTag;
    }
    if (imageTag.length > 0) {
      [[, imageSrc]] = imageTag;
    }
    [[, name]] = badge.tags.filter((tag) => tag[0] === 'name');
  }

  return (
    <Pressable
      style={[styles.container, active ? styles.active : undefined]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Image
          source={thumbSrc || imageSrc}
          style={{ width: 30, height: 30 }}
        />
        <Text style={globalStyles.textBody}>{name}</Text>
      </View>
      {section === 'Active' ? (
        <View style={styles.actionItems}>
          <Ionicons
            name="chevron-up"
            onPress={onUp}
            size={24}
            color={colors.primary500}
          />
          <Ionicons
            name="chevron-down"
            onPress={onDown}
            size={24}
            color={colors.primary500}
          />
        </View>
      ) : undefined}
    </Pressable>
  );
};

export default AwardedBadge;
