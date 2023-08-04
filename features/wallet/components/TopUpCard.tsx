import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { colors, globalStyles } from '../../../styles';
import { FontAwesome5 } from '@expo/vector-icons';
import Purchases, { PurchasesStoreProduct } from 'react-native-purchases';
import { LoadingSpinner } from '../../../components';

type TopUpCardProps = {
  product: PurchasesStoreProduct;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    gap: 10,
  },
  containerPressed: {
    backgroundColor: colors.backgroundActive,
  },
  price: {
    ...globalStyles.textH2,
    marginBottom: 0,
  },
});

const TopUpCard = ({ product }: TopUpCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  if (isLoading) {
    return <LoadingSpinner size={24} />;
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerPressed : undefined,
      ]}
      onPress={async () => {
        setIsLoading(true);
        try {
          await Purchases.purchaseStoreProduct(product);
          setIsLoading(false);
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <FontAwesome5 name="coins" size={24} color={colors.primary500} />
      <Text style={styles.price}>${product.price}</Text>
    </Pressable>
  );
};

export default TopUpCard;
