import { View, Text, StyleSheet } from 'react-native';
import React, { memo, useState } from 'react';
import { CustomButton, Input } from '../../../components';
import { colors, globalStyles } from '../../../styles';
import { emailRegex } from '../../../constants';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import publishMessage from '../../messages/utils/publishMessage';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary500,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    color: 'white',
  },
});

const SweepModal = memo(() => {
  const [input, setInput] = useState<string>();
  const submitHandler = async () => {
    if (input.length < 1 || !input.match(emailRegex)) {
      alert('This is not a valid Lightning Address...');
      return;
    }
    try {
      await publishMessage(
        'c7063ccd7e9adc0ddd4b77c6bfabffc8399b41e24de3a668a6ab62ede2c8aabd',
        `Initiated sweep to this address: ${input}`,
      );
      alert('Sweep initiated! You will be notified once it is completed.');
    } catch (e) {
      alert('Could not initiate sweep. Please contact support.');
      console.log(e);
    }
  };
  return (
    <View style={{ gap: 12 }}>
      <Text style={globalStyles.textBodyBold}>
        Enter a destination Lightning Address:
      </Text>
      <BottomSheetTextInput style={styles.input} onChangeText={setInput} />
      <CustomButton text="Confirm" buttonConfig={{ onPress: submitHandler }} />
    </View>
  );
});

export default SweepModal;
