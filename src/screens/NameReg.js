import { ScrollView, Image,StyleSheet, Text, View,Alert,TouchableOpacity,PermissionsAndroid,ActivityIndicator, Modal} from 'react-native'
import React, { useState,useEffect } from 'react'
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NameReg = () => {
    const navigation = useNavigation();
       const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
 const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone,setPhone] = useState('')

useEffect(() => {
  const user = auth().currentUser;

  if (!user) {
    Alert.alert("Error", "User not authenticated");
    return;
  }

  setPhone(user.phoneNumber); // comes from Firebase
}, []);

const formatPhoneForApi = (phone) => {
  return phone.replace(/\D/g, ""); // removes + and spaces
};

const handleSubmit = async () => {
  if (!firstName || !lastName ) {
    setModalMessage('Please fill all fields.');
      setModalVisible(true);
    return;
  }
 const user = auth().currentUser;

  if (!user) {
    Alert.alert("Error", "User not authenticated");
    return;
  }

  try {
    setLoading(true);

    // ⭐ Now build the API payload exactly how backend wants
      const payload = {
      phoneNo: formatPhoneForApi(user.phoneNumber),      
      firstName: firstName,
      lastName: lastName,
      firbaseToken: user.uid       
    };

    console.log("Payload Sending 👉", payload);

    // 📡 POST to API
    const response = await fetch(
      "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/Createlawyer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorMsg = await response.text();
      Alert.alert("API Error", errorMsg);
      setLoading(false);
      return;
    }

   const result = await response.json();

console.log("FULL API RESPONSE 👉", result);

if (!result.lawyer?.lawyerId) {
   Alert.alert("Error", result.message || "Lawyer not created");
  return;
}

await AsyncStorage.setItem(
  "lawyerId",
  String(result.lawyer.lawyerId)
);

await AsyncStorage.setItem(
  "lawyerProfile",
  JSON.stringify({
    lawyerId: result.lawyer.lawyerId,
    firstName: firstName,
    lastName: lastName,
    phoneNo: formatPhoneForApi(user.phoneNumber),
  })
);



    console.log("API Success:", result);

    Alert.alert("Success", "Lawyer has been created!");
       navigation.replace('Intro'); 
  } catch (error) {
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
       
            <View style={styles.myV}>             
   <Text style={styles.txt}>Let’s Get Started with Basics Information.</Text>
       </View>
       <View style={{flex:0.7}}>
    <Text style={styles.txte}>First Name</Text>
    <CustomInput plc='First Name' keyboardType='default' value={firstName} onChangeText={setFirstName} />
     <Text style={styles.txte}>Last Name</Text>
    <CustomInput plc='Last Name' keyboardType='default' value={lastName} onChangeText={setLastName} />
    
     
     <CustomButton title='Next' onPress={handleSubmit} />
     </View>
      {/* Modal for success/error messages */}
        <Modal
          transparent
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
     
    </View>
  )
}

export default NameReg;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFFFF'
    },
    txt: {fontSize: 20,fontFamily: 'Montserrat-SemiBold',margin:20 },
    txte: {fontSize: 15,fontFamily: 'Montserrat-Medium',marginHorizontal:20},
    dropdown: {
    height: 42,
    borderWidth: 1,
    borderColor: '#16232C',
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    marginVertical:8,
    marginHorizontal:15
  },
myV: {
    flex:0.3,

    justifyContent: 'center'
},
  selectedTextStyle: {
    fontSize: 14,
    color: '#16232C',
  },
  plch: {fontSize:14,color: 'rgba(22, 35, 44, 0.4)',fontFamily: 'Montserrat-Light'},
  rounde: {borderRadius: 50,elevation:5,backgroundColor: '#FFFFFF',padding:10,},
  cent: {alignItems: 'center',margin:10},
  imageStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
   margin:15,
    resizeMode: 'cover'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#CD7F32',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})