import { View, Text } from 'react-native'
import React from 'react'
import BackButton from './BackButton'
import { useNavigation } from '@react-navigation/native'
import colors from '../styles/colors'

const BackHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={{width: '100%', backgroundColor: colors.backgroundPrimary, padding: 12}}>
      <BackButton onPress={() => {navigation.goBack();}}/>
    </View>
  )
}

export default BackHeader