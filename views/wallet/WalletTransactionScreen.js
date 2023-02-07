import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import globalStyles from '../../styles/globalStyles'
import { FlashList } from "@shopify/flash-list";
import { useGetTransactionsMutation } from '../../services/walletApi';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';


const WalletTransactionScreen = () => {
    const [trigger, result] = useGetTransactionsMutation();
    console.log(result)
    useEffect(() => {
        console.log('Ran')
        trigger();
    },[])
  return (
    <View style={globalStyles.screenContainer}>
      <View>
       {result.data && <Text>{result.data.message}</Text>}
      </View>
    </View>
  )
}

export default WalletTransactionScreen