import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Lucide from 'lucide-react-native';

const CustomTopTabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    Intro: Lucide.CircleUserRound,
    Education: Lucide.GraduationCap,
    LawField: Lucide.Scale,
    About: Lucide.Info,
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const Icon = icons[route.name];

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}
          >
            <Icon
              size={22}
              color={focused ? '#E5B635' : '#FFFFFF'}
              strokeWidth={2}
            />

            <Text
              style={[
                styles.label,
                { color: focused ? '#E5B635' : '#FFFFFF' },
              ]}
            >
              {route.name}
            </Text>

            {focused && <View style={styles.activeLine} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const COLOR = '#E5B635';

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    backgroundColor: '#16232C',
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    alignItems: 'center',
    paddingTop: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginTop:8
  },
  activeLine: {
    width: 68,
    height: 3,
    backgroundColor: COLOR,
    borderRadius: 3,
    marginTop: 3,
  },
});
export default CustomTopTabBar;