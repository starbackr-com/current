import { Text, Pressable } from 'react-native'
import React from 'react'
import globalStyles from '../styles/globalStyles'
import colors from '../styles/colors'
import Ionicons from "@expo/vector-icons/Ionicons";


const BackButton = ({onPress}) => {
  return (
      <Text onPress={onPress} style={[globalStyles.textBody, {color: colors.primary500}]}><Ionicons name='arrow-back'/> Back</Text>
  )
}

export default BackButton 