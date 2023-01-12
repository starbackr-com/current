import { View, Text, Button } from 'react-native'
import React from 'react'
import { deleteValue } from '../utils/secureStore'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../features/authSlice'


const SettingsView = () => {
    const state = useSelector(state => state.auth.isLoggedIn)
    const dispatch = useDispatch();
    const logoutHandler = () => {
        deleteValue('privKey')
        dispatch(logOut())
    }
    const test = () => {
        console.log(state)
    }

  return (
    <View>
      <Button title='Log Out' onPress={logoutHandler}>SettingsView</Button>
      <Button title='Test' onPress={test}></Button>
    </View>
  )
}

export default SettingsView