import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
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
        console.log(data);
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
      <FlatList
        style={{ width: '100%' }}
        data={trendingNotes}
        renderItem={({ item }) => <TrendingNote event={item} />}
        ListHeaderComponent={<TrendingImages />}
      />
    </View>
  );
};

export default TrendingPostView;
