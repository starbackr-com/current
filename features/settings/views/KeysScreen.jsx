import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { globalStyles } from '../../../styles';
import { encodeSeckey, getValue } from '../../../utils';
import { CustomButton, Input } from '../../../components';

const Word = ({ word, index }) => (
  <View
    style={[
      {
        padding: 12,
        backgroundColor: '#222222',
        borderRadius: 5,
        width: '45%',
        margin: 6,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    ]}
  >
    <Text style={globalStyles.textBody}>{index + 1}</Text>
    <Text style={globalStyles.textBody}>{word}</Text>
  </View>
);

const KeysScreen = () => {
  const placeholder = [
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
    '****',
  ];

  const keyPlaceholder = 'nsec1*************************************************';
  const [mem, setMem] = useState();
  const [nsec, setNsec] = useState();

  const [show, setShow] = useState(false);

  useEffect(() => {
    async function getKeysFromStore() {
      const keys = await getValue('mem');
      if (keys) {
        setMem(JSON.parse(keys));
      } else {
        const sk = await getValue('privKey');
        const encodedSk = encodeSeckey(sk);
        setNsec(encodedSk);
      }
    }
    getKeysFromStore();
  }, []);

  const showHandler = async () => {
    setShow((prev) => !prev);
  };

  const copyHandler = async () => {
    await Clipboard.setStringAsync(nsec);
    alert('Copied key to clipboard!');
  };

  const copyKeysHandler = async () => {
    await Clipboard.setStringAsync(mem);
    alert('Copied key to clipboard!');
  };

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 3, width: '100%', alignItems: 'center' }}>
        {mem ? (
          <FlatList
            data={show ? mem : placeholder}
            renderItem={({ item, index }) => <Word word={item} index={index} />}
            style={{ width: '100%', flexGrow: 0 }}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            numColumns={2}
          />
        ) : undefined}
        {nsec ? (
          <Input
            textInputConfig={{
              editable: false,
              value: show ? nsec : keyPlaceholder,
              multiline: true,
            }}
            inputStyle={{ width: '90%' }}
          />
        ) : undefined}
        {show ? (
          <CustomButton
            text="Copy Keys"
            buttonConfig={{ onPress: copyKeysHandler }}
            containerStyles={{ marginBottom: 16 }}
          />
        ) : undefined}
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <CustomButton
          text="Copy nSec"
          buttonConfig={{ onPress: copyHandler }}
          containerStyles={{ marginBottom: 16 }}
        />
        <CustomButton
          text={show ? 'Hide Keys' : 'Show Keys'}
          buttonConfig={{ onPress: showHandler }}
          containerStyles={{ marginBottom: 16 }}
        />
      </View>
    </View>
  );
};

export default KeysScreen;
