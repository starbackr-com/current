import { View, Text } from 'react-native';
import React, { memo, useMemo } from 'react';
import { useParseContent } from '../../../hooks';
import { globalStyles } from '../../../styles';

const IssuedBy = memo(({ rawText }) => {
  const contentObj = useMemo(() => ({ content: rawText }), [rawText]);
  const content = useParseContent(contentObj);
  return (
    <View>
      <Text style={globalStyles.textBody}>{content}</Text>
    </View>
  );
});

export default IssuedBy;
