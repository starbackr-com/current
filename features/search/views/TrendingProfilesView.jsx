import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import devLog from '../../../utils/internal';
import { globalStyles } from '../../../styles';
import { TrendingProfile } from '../components';
import { getUserData } from '../../../utils/nostrV2';

const TrendingPostView = () => {
  const [trendingProfiles, setTrendingProfiles] = useState([]);

  useEffect(() => {
    async function getTrendingProfiles() {
      try {
        const res = await fetch('https://api.nostr.band/v0/trending/profiles');
        if (!res.status === 200) {
          throw new Error('Request failed...');
        }
        const data = await res.json();
        const trending = data.profiles.map((note) => note.profile);
        const trendingPubkeys = data.profiles.map((item) => item.pubkey);
        getUserData(trendingPubkeys);
        setTrendingProfiles(trending);
      } catch (e) {
        devLog(e);
      }
    }
    getTrendingProfiles();
  }, []);
  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ flex: 1, width: '100%' }}>
        <FlashList
          data={trendingProfiles}
          renderItem={({ item }) => <TrendingProfile event={item} />}
          estimatedItemSize={300}
        />
      </View>
    </View>
  );
};

export default TrendingPostView;
