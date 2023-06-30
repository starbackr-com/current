import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { memo } from 'react';
import { CustomButton } from '../../../components';
import { useDispatch } from 'react-redux';
import { joinCommunity } from '../communitySlice';
import { Image } from 'expo-image';
import CharacterImagePlaceholder from '../../../components/CharacterImagePlaceholder';
import Community from '../models/Community';
import { colors, globalStyles } from '../../../styles';
import { publishJoinEvent } from '../utils/nostr';

type JoinPromptProps = {
  communityObject: Community;
  onClose: () => void
};

const test = () => {return '1234'}

const JoinPrompt = memo(({ communityObject, onClose }: JoinPromptProps) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      {communityObject.communityPicture ? (
        <Image
          source={communityObject.communityPicture}
          style={styles.image}
        />
      ) : (
        <CharacterImagePlaceholder
          name={communityObject.communitySlug.slice(1)}
        />
      )}
      <Text style={globalStyles.textBody}>Do you want to join {communityObject.communitySlug}?</Text>
      <CustomButton
        text="Yes!"
        buttonConfig={{
          onPress: async () => {
            try {
              await publishJoinEvent(communityObject.communitySlug)
              dispatch(joinCommunity(communityObject.communitySlug));
              onClose();
            } catch(e) {
              console.log(e)
            }
          },
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: colors.primary500,
    borderWidth: 1
  },
});

export default JoinPrompt;
