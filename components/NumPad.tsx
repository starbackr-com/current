import { View, Text, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import React from 'react';
import { colors } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from './LoadingSpinner';

type NumPadProps = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  onConfirm: (event: GestureResponderEvent) => void;
  isLoading: boolean;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 1,
    backgroundColor: colors.backgroundSecondary,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 1,
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.backgroundActive,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
  },
});

const NumPad = ({ setValue, value, onConfirm, isLoading }:NumPadProps) => {
  const addHandler = (num: string) => {
    setValue((prev) => prev + num);
  };
  const deleteHandler = () => {
    if (!value || value.length < 1) {
      return;
    }
    setValue((prev) => prev.slice(0,-1));
  };
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('1')}}
        >
          <Text style={styles.buttonText}>1</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('2')}}
        >
          <Text style={styles.buttonText}>2</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('3')}}
        >
          <Text style={styles.buttonText}>3</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('4')}}
        >
          <Text style={styles.buttonText}>4</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('5')}}
        >
          <Text style={styles.buttonText}>5</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('6')}}
        >
          <Text style={styles.buttonText}>6</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('7')}}
        >
          <Text style={styles.buttonText}>7</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('8')}}
        >
          <Text style={styles.buttonText}>8</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('9')}}
        >
          <Text style={styles.buttonText}>9</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        {value.length > 0 ? <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={deleteHandler}
        >
          <Ionicons name="backspace" size={24} color="white" />
        </Pressable> : <View style={styles.button}></View>}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={() => {addHandler('0')}}
        >
          <Text style={styles.buttonText}>0</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonActive : undefined,
          ]}
          onPress={onConfirm}
        >
          {isLoading ? <LoadingSpinner size={32}/> : <Ionicons name="checkbox" size={32} color={colors.primary500} />}
        </Pressable>
      </View>
    </View>
  );
};

export default NumPad;
