import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import globalStyles from '../styles/globalStyles'
import colors from '../styles/colors'

const Input = ({label, textInputConfig, labelStyle, inputStyle, invalid}) => {
  return (
    <>
      {label ? <Text style={[globalStyles.textBody,styles.label, labelStyle]}>{label}</Text> : undefined}
      <TextInput style={[globalStyles.textBody,styles.input, inputStyle, invalid ? {borderColor: 'darkred'} : undefined]} {...textInputConfig}/>
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
        backgroundColor: '#222222',
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        color: 'white',
        textAlign: 'center'
    }
})