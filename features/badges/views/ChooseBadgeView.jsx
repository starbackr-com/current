/* eslint-disable react/jsx-no-bind */
import { View, Text, SectionList } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../../styles';
import { AwardedBadge } from '../components';
import useAwardedBadges from '../hooks/useAwardedBadges';
import { CustomButton } from '../../../components';

const ChooseBadgeView = () => {
  const events = useAwardedBadges();
  const [active, setActive] = useState([]);
  const insets = useSafeAreaInsets();

  const sections = [
    { title: 'Active', data: active },
    { title: 'All Awarded', data: events },
  ];

  function submitHandler() {}

  function moveUp(index) {
    if (index === 0) {
      return;
    }
    const newArr = active.slice();
    const a = newArr[index];
    newArr[index] = newArr[index - 1];
    newArr[index - 1] = a;
    setActive(newArr);
  }

  function moveDown(index) {
    if (index === active.length - 1) {
      return;
    }
    const newArr = active.slice();
    const a = newArr[index];
    newArr[index] = newArr[index + 1];
    newArr[index + 1] = a;
    setActive(newArr);
  }

  function addActive(item) {
    const newArr = active.slice();
    newArr.push(item);
    setActive(newArr);
  }

  function removeActive(item) {
    const newArr = active.filter((badge) => badge !== item);
    setActive(newArr);
  }

  const renderItem = ({ item, index, section }) => {
    if (section.title === 'Active') {
      return (
        <AwardedBadge
          badgeUID={item}
          index={index}
          onUp={moveUp.bind(undefined, index)}
          onDown={moveDown.bind(undefined, index)}
          onRemove={removeActive.bind(undefined, item)}
          section={section.title}
          key={item}
        />
      );
    }
    return (
      <AwardedBadge
        badgeUID={item}
        index={index}
        onUp={moveUp.bind(undefined, index)}
        onDown={moveDown.bind(undefined, index)}
        onAdd={addActive.bind(undefined, item)}
        onRemove={removeActive.bind(undefined, item)}
        active={active.includes(item)}
        section={section.title}
      />
    );
  };

  return (
    <View style={globalStyles.screenContainer}>
      <View style={{ width: '100%' }}>
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                paddingVertical: 12,
                paddingHorizontal: 6,
                backgroundColor: colors.backgroundSecondary,
                marginBottom: 24,
              }}
            >
              <Text style={globalStyles.textBodyBold}>{title}</Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>
      <View style={{ position: 'absolute', bottom: insets.bottom + 12 }}>
        <CustomButton text="Save" buttonConfig={{ onPress: submitHandler }} />
      </View>
    </View>
  );
};

export default ChooseBadgeView;
