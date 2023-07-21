import { View, StyleSheet, Pressable, Text, Keyboard } from 'react-native';
import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  MentionInput,
  MentionSuggestionsProps,
} from 'react-native-controlled-mentions';
import { colors, globalStyles } from '../styles';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from './CustomButton';
import pickImageResizeAndUpload from '../utils/images';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
import { FlatList } from 'react-native-gesture-handler';
import { matchSorter } from 'match-sorter';

type ExpanableInputProps = {
  onSubmit: (input: string) => {};
};

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
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary500,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    color: 'white',
    maxHeight: 100,
  },
});

const ExpandableInput = memo(({ onSubmit }: ExpanableInputProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const insets = useSafeAreaInsets();
   //@ts-ignore
  const { pubKey, walletBearer } = useSelector((state) => state.auth);

  const bottomSheetModalRef = useRef(null);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  //@ts-ignore
  const users = useSelector((state) => state.messages.users);
  const userArray = useMemo(() => {
    return Object.keys(users).map((user) => users[user]);
  }, [users]);

  const renderSuggestions: FC<MentionSuggestionsProps> = ({
    keyword,
    onSuggestionPress,
  }) => {
    if (keyword == null || keyword.length < 1) {
      return null;
    }
    const matches = matchSorter(userArray, keyword, { keys: ['name'] })
      .slice(0, 5)
      .map((result) => ({ name: result.name, id: result.pubkey }));
    if (matches.length < 1) {
      return null;
    }
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
                backgroundColor: colors.backgroundSecondary,
                borderRadius: 2,
              }}
            >
              <Text style={globalStyles.textBody}>{item.name}</Text>
            </Pressable>
          )}
          horizontal
          contentContainerStyle={{ gap: 10, marginBottom: 10 }}
          keyboardShouldPersistTaps={'handled'}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackground = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.textBar}>
        <View>
          <Ionicons
            name="add"
            size={32}
            color={colors.primary500}
            onPress={() => {
              Keyboard.dismiss();
              handlePresentModalPress();
            }}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 6 }}>
          <MentionInput
            value={input}
            style={styles.input}
            onChange={setInput}
            partTypes={[
              {
                trigger: '@',
                renderSuggestions,
                textStyle: { color: colors.primary500 },
              },
            ]}
            multiline
            placeholderTextColor={colors.backgroundActive}
            placeholder="Type a message"
          />
        </View>
        <View>
          {loading ? (
            <LoadingSpinner size={20} />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={colors.primary500}
              onPress={async () => {
                setLoading(true);
                await onSubmit(input);
                setLoading(false);
                setInput('');
              }}
            />
          )}
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        backgroundStyle={{ backgroundColor: colors.backgroundPrimary }}
        backdropComponent={renderBackground}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ padding: 24, paddingBottom: insets.bottom }}>
            {/* @ts-ignore */}
            <CustomButton
              text="Image"
              icon="image"
              containerStyles={{ marginVertical: 6 }}
              loading={uploading}
              buttonConfig={{
                onPress: async () => {
                  setUploading(true);
                  const { data } = await pickImageResizeAndUpload(
                    pubKey,
                    walletBearer,
                  );
                  setInput((prev) => prev + `\n ${data}`);
                  setUploading(false);
                  bottomSheetModalRef.current.dismiss();
                },
              }}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
});

export default ExpandableInput;
