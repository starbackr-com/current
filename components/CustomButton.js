import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import globalStyles from '../styles/globalStyles'
import colors from '../styles/colors'
import Ionicons from "@expo/vector-icons/Ionicons";
import LoadingSpinner from './LoadingSpinner'


const CustomButton = ({containerStyles, textStyles, text, buttonConfig, disabled, icon, iconColor, loading, secondary}) => {
  return (
    <Pressable style={({pressed}) => [styles.container, containerStyles, pressed ? styles.pressed : undefined, secondary ? {borderColor: '#333333'} : undefined, disabled ? styles.containerDisabled: undefined]} {...buttonConfig} disabled={disabled}>
      {icon ? <Ionicons name={icon} color={iconColor || colors.primary500} size={16}/> : undefined}
      {!loading ? <Text style={[globalStyles.textBody, styles.text, textStyles, disabled ? styles.textDisabled : undefined]}>{text}</Text> : <LoadingSpinner size={16}/>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#222222',
    borderColor: colors.primary500,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressed: {
    backgroundColor: '#333333'
  },
  containerDisabled: {
    backgroundColor: '#333333',
  },
  text:{
    textAlign: 'center'
  },
  textDisabled: {
    color: '#666666'
  }
})

export default CustomButton