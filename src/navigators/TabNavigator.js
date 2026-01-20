import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Intro from '../screens/tabs/Intro';
import Education from '../screens/tabs/Education';
import LawField from '../screens/tabs/LawField';
import About from '../screens/tabs/About';
import { StyleSheet, View,Image } from 'react-native';
import CustomTopTabBar from '../components/CustomTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#16232C' }}>

      {/* LOGO AT TOP */}
      <View style={styles.logoBox}>
        <Image
          source={require('../assets/images/hlogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* TOP TABS */}
      <Tab.Navigator
        tabBar={(props) => <CustomTopTabBar {...props} />}
        screenOptions={{ swipeEnabled: false }}
      >
        <Tab.Screen name="Intro" component={Intro} />
        <Tab.Screen name="Education" component={Education} />
        <Tab.Screen name="LawField" component={LawField} />
        <Tab.Screen name="About" component={About} />
      </Tab.Navigator>

    </SafeAreaView>
  );
}
export default TabNavigator;

const styles = StyleSheet.create({
  logoBox: {
    paddingTop: 25,
    paddingBottom: 15,
   
  },
  logo: {
    width: 142,
    height: 24,
    marginLeft:20
  },
});