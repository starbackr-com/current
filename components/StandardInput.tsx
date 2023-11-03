import { View, StyleSheet, TextInput } from 'react-native';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles';
import LoadingSpinner from './LoadingSpinner';
import { useAppSelector } from '../hooks';

type StandardInputProps = {
  onSubmit: (input: string) => Promise<void>;
  initialText?: string;
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

const StandardInput = memo(({ onSubmit, initialText }: StandardInputProps) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialText) {
      setInput(initialText);
    }
  }, [initialText]);

  return (
    <View style={[styles.container]}>
      <View style={styles.textBar}>
        <View style={{ flex: 1, marginHorizontal: 6 }}>
          <TextInput
            value={input}
            style={styles.input}
            onChangeText={setInput}
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
    </View>
  );
});

export default StandardInput;
