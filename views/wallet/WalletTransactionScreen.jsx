import { View } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { globalStyles } from '../../styles';
import useTransactionHistory from '../../features/wallet/hooks/useTransactionHistory';
import { InTxItem, OutTxItem } from '../../features/wallet/components';
import PressableIcon from '../../components/PressableIcon';

const WalletTransactionScreen = () => {
  const txHistory = useTransactionHistory();
  const renderTx = ({ item }) => {
    if (item.type === 'in') {
      return <InTxItem item={item} />;
    }
    return <OutTxItem item={item} />;
  };
  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 1, width: '100%' }}>
        <FlashList
          data={txHistory}
          renderItem={renderTx}
          estimatedItemSize={32}
        />
      </View>
    </View>
  );
};

export default WalletTransactionScreen;
