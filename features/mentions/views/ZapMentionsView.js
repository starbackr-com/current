import { useZapMentions } from '../hooks';
import { ZapMention } from '../components';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { globalStyles } from '../../../styles';

const ZapMentionsView = ({ navigation }) => {
  const data = useZapMentions();
  const renderItem = ({ item }) => {
    return <ZapMention item={item} />;
  };

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 1, width: '100%' }}>
        <FlashList
          data={data}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          estimatedItemSize={100}
        />
      </View>
    </View>
  );
};

export default ZapMentionsView;
