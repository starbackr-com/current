import { View, Text } from 'react-native';
import React from 'react';
import { globalStyles } from '../../../styles';
import { CustomButton } from '../../../components';
import { pool } from '../../../utils/nostrV2';
import { useRelayUrls } from '../../relays';

const DvmSelectionScreen = ({ navigation }) => {
  const { readUrls } = useRelayUrls();
  return (
    <View style={globalStyles.screenContainer}>
      <Text>DvmSelectionScreen</Text>
      <CustomButton
        text="Image Gen"
        buttonConfig={{
          onPress: () => {
            navigation.navigate('ImageGen');
          },
        }}
      />
      <CustomButton
        text="Test"
        buttonConfig={{
          onPress: async () => {
            const events = await pool.list(
              readUrls,
              [
                {
                  authors:
                    '40b9c85fffeafc1cadf8c30a4e5c88660ff6e4971a0dc723d5ab674b5e61b451',
                  kinds: [30001],
                },
              ],
              { skipVerification: true },
            );
            console.log(JSON.stringify(events));
          },
        }}
      />
    </View>
  );
};

export default DvmSelectionScreen;
