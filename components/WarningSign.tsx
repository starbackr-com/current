import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../styles'

type WarningSignProps = {
  text: string,
  type: 'warning' | 'danger'
}

const WarningSign = ({text, type}: WarningSignProps) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Ionicons name='warning-outline' size={32} color={type === 'danger' ? colors.primary500 : 'red'}/>
      <Text>{text}</Text>
    </View>
  )
}

export default WarningSign