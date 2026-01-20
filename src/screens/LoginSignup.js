import { Image, StyleSheet, Text, TextInput, View, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../components/CustomButton'
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
const LoginSignup = () => {
  const navigation = useNavigation();
  const [country, setCountry] = useState('+92');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const data = [
    { label: '+92', value: '+92' },
  ];
auth().settings.appVerificationDisabledForTesting = false;
auth().settings.forceRecaptchaFlowForTesting = true;

 const handleSignIn = async () => {
  if (!phone.trim()) {
    Alert.alert("Error", "Please enter your phone number.");
    return;
  }

  const fullNumber = country + phone;

  try {
    setLoading(true);

    // Force reCAPTCHA fallback
    auth().settings.appVerificationDisabledForTesting = false;
    auth().settings.forceRecaptchaFlowForTesting = true;

    const confirmation = await auth().signInWithPhoneNumber(fullNumber);

    setLoading(false);

  navigation.navigate('AuthVerify', {
  verificationId: confirmation.verificationId,
  phone: fullNumber,
});

  } catch (error) {
    setLoading(false);
    Alert.alert("Firebase Error", error.message);
  }
};


  return (
     <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: '#FFFFFF' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
    <View style={styles.container}>
      <View style={styles.cent}>
        <Image source={require('../assets/images/logos.png')} style={styles.img} />
        <Text style={styles.txt}>Login/Sign up</Text>
        <Text style={styles.txted}>Sign in to streamline your legal practice with OLA LAW’s smart tools.</Text>

      </View>
      <View style={{ flex: 0.5 }}>
        <Text style={styles.txts}>Whats Your Phone Number?</Text>
        <View style={styles.rowV}>
          <View style={{ flex: 0.2 }}>
            <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={{ fontSize: 14 }}
              data={data}
              labelField="label"
              valueField="value"
              value={country}
              onChange={(item) => setCountry(item.value)}
            />
          </View>
          <View style={{ flex: 0.75 }}>
            <KeyboardAvoidingView>
            <TextInput placeholder='300 00 00 000' style={styles.input} value={phone} onChangeText={setPhone}
              maxLength={10} placeholderTextColor='rgba(22, 35, 44, 0.4)' keyboardType='number-pad' />
              </KeyboardAvoidingView>
          </View>
        </View>
        <CustomButton title="Next" onPress={handleSignIn}  disabled={loading}  />
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginSignup

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  cent: { flex: 0.4, justifyContent: 'center', alignItems: 'center', paddingTop: 20 },
  img: { height: 92, width: 92, marginTop: 20 },
  txt: { fontSize: 20, fontFamily: 'Montserrat-Bold', color: '#E5B635', margin: 14, textAlign: 'center' },
  txted: { fontSize: 14, fontFamily: 'Montserrat-Light', color: '#16232C', textAlign: 'center', marginHorizontal: 20 },
  txts: { fontSize: 16, fontFamily: 'Montserrat-Medium', color: '#16232C', marginHorizontal: 18 },
  rowV: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 15 },
  input: { fontSize: 16, color: '#16232C', borderRadius: 8, borderWidth: 1, padding: 10 },
  dropdown: {
    height: 42,
    borderWidth: 1,
    borderColor: '#16232C',
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },

  selectedTextStyle: {
    fontSize: 16,
    color: '#16232C',
  },
})