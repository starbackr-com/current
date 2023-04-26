import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Input from './Input';

const ExpandingSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={{ flex: 1, width: '100%' }}>
      <Input
        textInputConfig={{
          onFocus: () => {
            setIsOpen(true);
            console.log('focus');
          },
        }}
      />
    </View>
  );
};

export default ExpandingSearch;
