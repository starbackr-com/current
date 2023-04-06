import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';
import { ImportTypeItem } from '../components';
import { CustomButton } from '../../../components';

const ImportSelectionView = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        globalStyles.screenContainer,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={globalStyles.textH2}>
        Choose the type of key that you want to import...
      </Text>
      <ScrollView
        style={{ width: '100%', flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        <ImportTypeItem
          title="Single Key"
          text="Import a single private key"
          example="nsec1wae9gwn52p2qa4f50xhe2hrefqn8kat4..."
          icon="key"
          onPress={() => {
            navigation.navigate('ImportKey');
          }}
        />
        <ImportTypeItem
          title="Seed Words"
          text="Derive keys from a Seed Phrase"
          example="target traffic extend boss maximum zero illegal much people bitter crack fire"
          icon="newspaper"
          onPress={() => {
            navigation.navigate('ImportWords');
          }}
        />
        <ImportTypeItem
          title="I don't have keys"
          text="You do not have any nostr-keys yet? No problem!"
          icon="help"
        />
      </ScrollView>
      <CustomButton
        text="Back"
        buttonConfig={{
          onPress: () => {
            navigation.goBack();
          },
        }}
      />
    </View>
  );
};

export default ImportSelectionView;
