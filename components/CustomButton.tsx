/* eslint-disable react/jsx-props-no-spreading */
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import React, { memo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import LoadingSpinner from './LoadingSpinner';
import { colors, globalStyles } from '../styles';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary500,
    borderWidth: 0,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: '#3f3f46',
  },
  containerDisabled: {
    backgroundColor: '#3f3f46',
  },
  text: {
    textAlign: 'center',
  },
  textDisabled: {
    color: '#666666',
  },
});

type CustomButtonProps = {
  containerStyles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  text: string;
  buttonConfig: any;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  loading?: boolean;
  secondary?: boolean;
};

const CustomButton = memo(
  ({
    containerStyles,
    textStyles,
    text,
    buttonConfig,
    disabled,
    icon,
    iconColor,
    loading,
    secondary,
  }: CustomButtonProps) => (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        containerStyles,
        pressed ? styles.pressed : undefined,
        secondary ? { borderColor: '#333333' } : undefined,
        disabled ? styles.containerDisabled : undefined,
      ]}
      {...buttonConfig}
      disabled={disabled}
    >
      {icon ? (
        <Ionicons
          name={icon}
          color={iconColor || colors.primary500}
          size={16}
        />
      ) : undefined}
      {!loading ? (
        <Text
          style={[
            globalStyles.textBody,
            styles.text,
            textStyles,
            disabled ? styles.textDisabled : undefined,
          ]}
        >
          {text}
        </Text>
      ) : (
        <LoadingSpinner size={16} />
      )}
    </Pressable>
  ),
);

export default CustomButton;
