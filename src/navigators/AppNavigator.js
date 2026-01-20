import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import IntroSlider from "../screens/IntroSlider";
import LoginSignup from "../screens/LoginSignup";
import AuthVerify from "../screens/AuthVerify";
import TabNavigator from "./TabNavigator";
import Dashboard from "../screens/Dashboard";
import NewDocument from "../screens/NewDocument";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import NameReg from "../screens/NameReg";
import Intro from "../screens/tabs/Intro";
import UserProfile from "../screens/UserProfile";
import EditLawyerIntro from "../screens/EditLawyerIntro";
import EditEducation from "../screens/EditEducation";
import EditLicense from "../screens/EditLicense";
import EditExperience from "../screens/EditExperience";
import EditCase from "../screens/EditCase";
import EditAbout from "../screens/EditAbout";

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setInitialRoute("TabNavigator"); // User is logged in
      } else {
        setInitialRoute("IntroSlider"); // User is not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  if (!initialRoute) {
    // While checking auth state, show loader
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#E5B635" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="IntroSlider" component={IntroSlider} />
        <Stack.Screen name="LoginSignup" component={LoginSignup} />
        <Stack.Screen name="AuthVerify" component={AuthVerify} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="NewDocument" component={NewDocument} />
        <Stack.Screen name="Intro" component={Intro} />
         <Stack.Screen name="EditLawyerIntro" component={EditLawyerIntro} />
        <Stack.Screen name="NameReg" component={NameReg} />
         <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="EditEducation" component={EditEducation} />
          <Stack.Screen name="EditLicense" component={EditLicense} />
            <Stack.Screen name="EditExperience" component={EditExperience} />
              <Stack.Screen name="EditCase" component={EditCase} />
              <Stack.Screen name="EditAbout" component={EditAbout} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
