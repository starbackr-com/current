import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import devLog from '../../../utils/internal';
import TrendingNote from '../components/TrendingNote';
import { globalStyles } from '../../../styles';
import TrendingImages from '../components/TrendingImages';

const TrendingPostView = () => {
  const [trendingNotes, setTrendingNotes] = useState([]);

  useEffect(() => {
    async function getTrendingNotes() {
      try {
        const res = await fetch('https://api.nostr.band/v0/trending/notes');
        if (!res.status === 200) {
          throw new Error('Request failed...');
        }
        const data = await res.json();
        const trending = data.notes.map((note) => note.event);
        setTrendingNotes(trending);
      } catch (e) {
        devLog(e);
      }
    }
    getTrendingNotes();
  }, []);
  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 1, width: '100%' }}>
        <FlashList
          data={trendingNotes}
          renderItem={({ item }) => <TrendingNote event={item} />}
          ListHeaderComponent={<TrendingImages />}
          estimatedItemSize={300}
        />
      </View>
    </View>
  );
};

export default TrendingPostView;
