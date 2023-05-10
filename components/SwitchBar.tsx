import { View, Text, SwitchChangeEvent } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-gesture-handler';
import { colors, globalStyles } from '../styles';

type SwitchBarProps = {
  value: boolean;
  onChange: (event: SwitchChangeEvent) => void | Promise<void>;
  text: string;
  disabled?: boolean;
};

const SwitchBar = ({ value, onChange, text, disabled }: SwitchBarProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundSecondary,
        padding: 6,
        borderRadius: 10,
        marginVertical: 6
      }}
    >
      <Text
        style={[
          globalStyles.textBody,
          disabled ? { color: '#555555' } : undefined,
        ]}
      >
        {text}
      </Text>
      <Switch
        value={disabled ? false : value}
        onChange={onChange}
        trackColor={{ true: colors.primary500 }}
        disabled={disabled}
      />
    </View>
  );
};

export default SwitchBar;
