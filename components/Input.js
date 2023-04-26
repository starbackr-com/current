import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { colors, globalStyles } from '../styles';

const Input = ({label, textInputConfig, labelStyle, inputStyle, invalid, alignment}) => {
  return (
    <>
      {label ? <Text style={[globalStyles.textBody,styles.label, labelStyle]}>{label}</Text> : undefined}
      <TextInput style={[globalStyles.textBody,styles.input, inputStyle, invalid ? {borderColor: 'darkred'} : undefined, alignment ? {textAlign: alignment} : {textAlign: 'left'}]} {...textInputConfig}/>
    </>
  )
}

export default Input

const styles = StyleSheet.create({
    label: {
        marginBottom: 6,
    },
    input: {
        width: '100%',
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        color: 'white',
    }
})