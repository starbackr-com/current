import { View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../../../styles';
import DVMSelectionItem from '../components/DVMSelectionItem';

const DvmSelectionScreen = ({ navigation }) => (
  <View style={globalStyles.screenContainer}>
    <View style={{ flex: 1, gap: 10 }}>
      <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
        <DVMSelectionItem
          text="Generate Image"
          icon={<Ionicons name="image" color={colors.primary500} size={24} />}
          color={colors.primary500}
          onPress={() => {
            navigation.navigate('ImageGen');
          }}
        />
        <DVMSelectionItem
          text="Generate Text"
          icon={
            <Ionicons name="text" color="#7f35ab" size={24} />
          }
          color="#7f35ab"
        />
      </View>
      <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
        <DVMSelectionItem
          text="Summarize Note"
          icon={<Ionicons name="document" color="#6495ed" size={24} />}
          color="#6495ed"
        />
      </View>
    </View>
  </View>
);

export default DvmSelectionScreen;
