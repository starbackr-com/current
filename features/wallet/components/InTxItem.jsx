import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import { getAge } from '../../shared/utils/getAge';

const InTxItem = ({ item }) => {
  let status = 'grey';
  if (item.status === 'paid' && item.type === 'in') {
    status = 'green';
  }
  return (
    <View
      style={{
        backgroundColor: colors.backgroundSecondary,
        padding: 6,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      }}
    >
      <Ionicons
        name={item.type === 'in' ? 'arrow-down' : 'arrow-up'}
        color={status}
        size={24}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <Text style={globalStyles.textBody}>{item.amount}</Text>
        <Text style={[globalStyles.textBodyS, { maxWidth: '80%' }]}>
          {item.memo || ''}
        </Text>
        <Text style={[globalStyles.textBodyS]}>{getAge(item.createdat)}</Text>
      </View>
    </View>
  );
};

export default InTxItem;
