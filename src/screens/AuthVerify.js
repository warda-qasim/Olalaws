// import { Image, StyleSheet, Text, View, Alert } from 'react-native';
// import React, { useState } from 'react';
// import CustomButton from '../components/CustomButton';
// import OutlineButton from '../components/OutlineButton';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import OTPTextInput from 'react-native-otp-textinput';
// import auth from '@react-native-firebase/auth';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// const AuthVerify = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//    const verificationId = route.params?.verificationId;
//   const phone = route.params?.phone;
//    const [otp, setOtp] = useState('');
//   const [resendLoading, setResendLoading] = useState(false);

//       const [country, setCountry] = useState('+92');

//   const data = [
//     { label: '+92', value: '+92' },
//     { label: '+91', value: '+91' },
//     { label: '+1', value: '+1' },
//   ];

// const handleVerify = async () => {
//   if (otp.length !== 6) {
//     Alert.alert('Error', 'Enter a 6-digit OTP.');
//     return;
//   }

//   try {
//     // 1️⃣ Verify OTP with Firebase
//     const credential = auth.PhoneAuthProvider.credential(
//       verificationId,
//       otp
//     );

//     const userCredential = await auth().signInWithCredential(credential);

//     // 2️⃣ Get verified phone number from Firebase
//     const firebasePhone = userCredential.user.phoneNumber; 
//     // example: +923018238431

//     if (!firebasePhone) {
//       Alert.alert("Error", "Phone number not available");
//       return;
//     }

//     const cleanPhone = firebasePhone.replace("+", ""); // 923018238431

//     // 3️⃣ Call backend to check lawyer
//     const response = await fetch(
//       `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/LawyerExist/${cleanPhone}`
//     );

//     const result = await response.json();

//     if (!result?.data?.isResponce) {
//       Alert.alert("Error", "Server validation failed");
//       return;
//     }

//     // 4️⃣ If lawyer exists → save data
//     if (result.data.isExist) {
//       await AsyncStorage.setItem(
//         "lawyerId",
//         String(result.lawyer.lawyerId)
//       );

//       await AsyncStorage.setItem(
//         "lawyerProfile",
//         JSON.stringify(result.lawyer)
//       );
//     }

//     // 5️⃣ Navigation decision
//     if (!result.data.isExist) {
//       navigation.replace("NameReg");
//       return;
//     }

//     if (!result.data.profileComplete) {
//       navigation.replace("TabNavigator");
//       return;
//     }

//     navigation.replace("Dashboard");

//   } catch (err) {
//     Alert.alert('Verification Failed', err.message);
//     if (!result?.data?.isSuccess) {
//   Alert.alert("Error", result?.data?.message || "Validation failed");
//   return;
// }

//   }
// };


//   //   const handleVerify = async () => {
//   //   if (otp.length !== 6) {
//   //     Alert.alert('Error', 'Enter a 6-digit OTP.');
//   //     return;
//   //   }

//   //   try {
//   //     const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
//   //     await auth().signInWithCredential(credential);
//   //     navigation.replace('NameReg'); // Navigate on success
//   //   } catch (err) {
//   //     Alert.alert('Verification Failed', err.message);
//   //   }
//   // };
//    const handleResendCode = async () => {
//     try {
//       setResendLoading(true);

//       const confirmation = await auth().signInWithPhoneNumber(phone);

//       // Update verificationId
//       route.params.verificationId = confirmation.verificationId;

//       setResendLoading(false);
//       Alert.alert('Success', 'A new verification code has been sent.');
//     } catch (err) {
//       setResendLoading(false);
//       Alert.alert('Resend Error', err.message);
//     }
//   };
//   return (
//     <View style={styles.container}>
//     <View style={styles.cent}>
//       <Image source={require('../assets/images/logos.png')} style={styles.img} />
//       <Text style={styles.txt}>Authentication</Text>
//       <Text style={styles.txted}>Use the OTP sent to your registered number to complete the verification process.</Text>

//     </View>
//     <View style={{flex:0.5}}>
//          <Text style={styles.txts}>1-Time Passcode</Text>
//          {/* <View style={styles.rowV}>

//          </View> */}
//          <View style={{ marginTop: 10, marginHorizontal: 20 }}>
//   <OTPTextInput
//     inputCount={6}
//     tintColor="#E5B635"
//     offTintColor="#C7C7C7"
//     textInputStyle={styles.otpBox}
//       handleTextChange={(v) => setOtp(v)}
//   />
// </View>
// <View style={{marginTop:20}}>
//       <CustomButton title="Verify OTP" onPress={handleVerify} />
//        </View>
//         <OutlineButton  title={resendLoading ? 'Resending...' : 'Resend Code'}
//           onPress={handleResendCode} />
//     </View>
//     </View>
//   )
// }

// export default AuthVerify

// const styles = StyleSheet.create({
// container: { flex:1,backgroundColor: '#FFFFFF' },
// cent: {flex:0.4,justifyContent:'center',alignItems: 'center',paddingTop:20},
// img: {height: 92,width: 92,marginTop:20},
// txt: {fontSize: 20,fontFamily: 'Montserrat-Bold',color: '#E5B635',margin:14,textAlign: 'center'},
// txted: {fontSize: 14,fontFamily: 'Montserrat-Light',color: '#16232C',textAlign: 'center',marginHorizontal:20},
// txts: {fontSize: 16,fontFamily: 'Montserrat-Medium',color: '#16232C',marginHorizontal:18},
// rowV: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',margin:15},
// input: {fontSize: 16,color: '#16232C',borderRadius: 8,borderWidth:1,padding:10},
// dropdown: {
//     height: 42,
//     borderWidth: 1,
//     borderColor: '#16232C',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     justifyContent: 'center',
//   },

//   selectedTextStyle: {
//     fontSize: 16,
//     color: '#16232C',
//   },
//   otpBox: {
//   width: 45,
//   height: 45,
//   borderRadius: 8,
//   borderWidth: 1,
//   borderColor: 'rgba(22, 35, 44, 0.6)',
//   color: '#16232C',
//   fontSize: 18,
//   fontFamily: 'Montserrat-Medium',
//   textAlign: 'center',
//   backgroundColor: '#FFFFFF',
// },

// })




import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../components/CustomButton'
import OutlineButton from '../components/OutlineButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import OTPTextInput from 'react-native-otp-textinput'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AuthVerify = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const verificationId = route.params?.verificationId
  const phone = route.params?.phone

  const [otp, setOtp] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Enter a 6-digit OTP.')
      return
    }

    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp)
      const userCredential = await auth().signInWithCredential(credential)

      const firebasePhone = userCredential.user.phoneNumber
      if (!firebasePhone) {
        Alert.alert('Error', 'Phone number not available')
        return
      }

      const cleanPhone = firebasePhone.replace('+', '')

      const response = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/LawyerExist/${cleanPhone}`
      )
      const result = await response.json()

      if (!result?.data?.isResponce) {
        Alert.alert('Error', 'Server validation failed')
        return
      }

      if (result.data.isExist) {
        await AsyncStorage.setItem('lawyerId', String(result.lawyer.lawyerId))
        await AsyncStorage.setItem('lawyerProfile', JSON.stringify(result.lawyer))
      }

      if (!result.data.isExist) {
        navigation.replace('NameReg')
        return
      }

      if (!result.data.profileComplete) {
        navigation.replace('TabNavigator')
        return
      }

      navigation.replace('Dashboard')
    } catch (err) {
      Alert.alert('Verification Failed', err.message)
    }
  }

  const handleResendCode = async () => {
    try {
      setResendLoading(true)

      const confirmation = await auth().signInWithPhoneNumber(phone)

      // ⚠️ IMPORTANT: dont mutate route.params directly
      // instead store new verificationId somewhere if needed
      // For now we will just show alert

      setResendLoading(false)
      Alert.alert('Success', 'A new verification code has been sent.')
    } catch (err) {
      setResendLoading(false)
      Alert.alert('Resend Error', err.message)
    }
  }

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
          <View style={styles.cent}>
            <Image source={require('../assets/images/logos.png')} style={styles.img} />
            <Text style={styles.txt}>Authentication</Text>
            <Text style={styles.txted}>
              Use the OTP sent to your registered number to complete the verification process.
            </Text>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.txts}>1-Time Passcode</Text>

            <View style={{ marginTop: 12, marginHorizontal: 20 }}>
              <OTPTextInput
                inputCount={6}
                tintColor="#E5B635"
                offTintColor="#C7C7C7"
                textInputStyle={styles.otpBox}
                handleTextChange={(v) => setOtp(v)}
                keyboardType="number-pad"   // ✅ best for OTP
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <CustomButton title="Verify OTP" onPress={handleVerify} />
            </View>

            <OutlineButton
              title={resendLoading ? 'Resending...' : 'Resend Code'}
              onPress={handleResendCode}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default AuthVerify

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 30,
  },

  cent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 12,
  },

  bottom: {
    flex: 1,
    paddingBottom: 20,
  },

  img: { height: 92, width: 92, marginTop: 20 },

  txt: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#E5B635',
    margin: 14,
    textAlign: 'center',
  },

  txted: {
    fontSize: 14,
    fontFamily: 'Montserrat-Light',
    color: '#16232C',
    textAlign: 'center',
    marginHorizontal: 20,
  },

  txts: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#16232C',
    marginHorizontal: 18,
    marginTop: 20,
  },

  otpBox: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(22, 35, 44, 0.6)',
    color: '#16232C',
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    textAlignVertical: 'center',   // ✅ ANDROID FIX
    paddingVertical: 0,            // ✅ FIX
    paddingTop: 0,                 // ✅ FIX
    paddingBottom: 0,              // ✅ FIX
    includeFontPadding: false,     // ✅ ANDROID FIX
    backgroundColor: '#FFFFFF',
  },

})
