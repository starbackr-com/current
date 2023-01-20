import { View, Text } from 'react-native'
import React from 'react'
import globalStyles from '../styles/globalStyles'
import { FlashList } from '@shopify/flash-list'
import { useDispatch, useSelector } from 'react-redux'
import CustomButton from '../components/CustomButton'
import { Pressable } from 'react-native'
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from '../styles/colors'
import { unfollowPubkey } from '../features/userSlice'

const UserItem = ({item}) => {
    const dispatch = useDispatch();
    const deleteHandler = () => {
        dispatch(unfollowPubkey(item.pubkey))
    };
    return (
        <View>
            <Text>{item.name || item.pubkey}</Text>
            <Pressable onPress={deleteHandler}><Ionicons name='close-circle-outline' size={32} color={colors.primary500}/></Pressable>
        </View>
    )
};

const SearchScreen = () => {
    const following = useSelector(state => state.user.followedPubkeys)
  return (
    <View style={globalStyles.screenContainer}>
      <Text style={globalStyles.textH1}>Following</Text>
      <View style={{height:'100%', width: '100%'}}>
      <FlashList data={following} renderItem={({item}) => <UserItem item={item}/>}/>
      </View>
      <CustomButton/>
    </View>
  )
}

export default SearchScreen