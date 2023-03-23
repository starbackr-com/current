import { Text, Pressable } from 'react-native'
import React from 'react'
import globalStyles from '../styles/globalStyles'
import colors from '../styles/colors'
import Ionicons from "@expo/vector-icons/Ionicons";


const BackButton = ({onPress, text}) => {
  return (
      <Text onPress={onPress} style={[globalStyles.textBody, {color: colors.primary500, textAlign: 'left'}]}><Ionicons name='arrow-back'/> {text || 'Back'}</Text>
  )
}

export default BackButton 