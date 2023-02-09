import { View, Text, Button } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'

const FeedImage = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Button title='Image' onPress={() => {navigation.navigate('ImageModal', {imageUri: ['https://pbs.twimg.com/media/FodTWXvWIAAQxn9?format=jpg&name=large','https://pbs.twimg.com/media/Foc4UTYWYAEPLXb?format=jpg&name=large']})}}/>
    </View>
  )
}

export default FeedImage