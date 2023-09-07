import { View, Text } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { globalStyles } from '../../../styles';
import { CustomKeyboardView, ExpandableInput } from '../../../components';
import { useImageJob } from '../hooks';
import publishImageJob from '../utils/publishImageJob';
import ImageGenResult from '../components/ImageGenResult';
import ImageGenRequest from '../components/ImageGenRequest';

const ImageGenScreen = () => {
  const events = useImageJob();
  const submitJob = (input) => {
    publishImageJob(input);
  };

  const renderEvent = ({ item }) => {
    if (item.kind === 65005) {
      return <ImageGenRequest event={item} />;
    }
    return <ImageGenResult event={item} />;
  };

  return (
    <CustomKeyboardView>
      <View style={globalStyles.screenContainer}>
        <FlatList
          data={events}
          renderItem={renderEvent}
          contentContainerStyle={{ gap: 12 }}
          style={{ flex: 1, width: '100%' }}
          showsVerticalScrollIndicator={false}
        />
        <ExpandableInput onSubmit={submitJob} />
      </View>
    </CustomKeyboardView>
  );
};

export default ImageGenScreen;
