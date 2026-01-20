import { ScrollView, Platform, Image, StyleSheet, Text, View, Alert, TouchableOpacity, PermissionsAndroid, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { Dropdown } from 'react-native-element-dropdown'
import { Calendar, Camera, User } from 'lucide-react-native'
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import DatePicker from 'react-native-date-picker'

const Intro = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [imageData, setImageData] = useState(null);
  const [city, setCity] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [dateOfBirth, setDob] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [dobDate, setDobDate] = useState(new Date(2000, 0, 1));      // Date object for picker

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData"
        );

        const json = await response.json();
      console.log("Get Degree Data",json)
        // Extract cities list
        const cities = json.cities || [];

        // Convert into dropdown format
        const formattedCities = cities.map((item) => ({
          label: item.cityName,
          value: item.id,
        }));

        setCityData(formattedCities);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch cities");
      }
    };

    fetchCities();
  }, []);

  //   useEffect(() => {
  //   const loadCachedProfile = async () => {
  //     try {
  //       const stored = await AsyncStorage.getItem("lawyerProfile");
  //       if (!stored) return;

  //       const lawyer = JSON.parse(stored);

  //       setFirstName(lawyer.firstName ?? "");
  //       setLastName(lawyer.lastName ?? "");
  //     } catch (e) {
  //       console.log("Failed to load cached profile", e);
  //     }
  //   };

  //   loadCachedProfile();
  // }, []);

  useEffect(() => {
    const loadProfileFromApi = async () => {
      try {
        const lawyerId = await AsyncStorage.getItem("lawyerId");

        const res = await fetch(
          `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
        );

        const json = await res.json();
         console.log("Get Lawyer Profile",json)
        const lawyer = json.lawyer;

        // ✅ Set all fields
        setFirstName(lawyer.firstName ?? "");
        setLastName(lawyer.lastName ?? "");
        setGender(lawyer.gender?.trim() ?? "");
        setEmail(lawyer.email ?? "");
        setCnic(formatCNIC(lawyer.cnic ?? ""));
        setDob(lawyer.dateOfBirth && lawyer.dateOfBirth !== "0001-01-01"
          ? lawyer.dateOfBirth
          : ""
        );

        // phone (readonly)
        setPhone(formatPhone(lawyer.contact ?? ""));

        // city dropdown
        if (lawyer.cityId) {
          setCity({
            label: lawyer.city,
            value: lawyer.cityId,
          });
        }

        // profile image (already uploaded image)
        if (lawyer.profilePic) {
          setImageUrl(lawyer.profilePic);
        }

      } catch (e) {
        console.log("Failed to load profile", e);
      }
    };

    loadProfileFromApi();
  }, []);
  useEffect(() => {
    const user = auth().currentUser;

    if (user?.phoneNumber) {
      setPhone(formatPhone(user.phoneNumber));
    }
  }, []);

  const requestCameraPermission = async (isFirstImage) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        openGallery(isFirstImage);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = async (isFirstImage) => {
    const result = await launchImageLibrary({ mediaType: 'photo',includeBase64: true, });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      if (isFirstImage) {
        setImageData(result.assets[0]);
      }
    }
  };
  // const uploadImage = async () => {
  //   if (!imageData) {
  //     setModalMessage('Please select both images and enter a name.');
  //     setModalVisible(true);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // Upload first image
  //     const reference1 = storage().ref(imageData.assets[0].fileName);
  //     await reference1.putFile(imageData.assets[0].uri);
  //     const url1 = await reference1.getDownloadURL();



  //     // Store in Firestore
  //     await uploadItem(url1);
  //   } catch (error) {
  //     setModalMessage('Error uploading images. Please try again.');
  //     setModalVisible(true);
  //     setLoading(false);
  //   }
  // };
  const uploadItem = async (url1) => {
    try {
      await firestore().collection('bears').add({
        name: name,
        imageUrl: url1,
      });

      setModalMessage('Data successfully uploaded!');
      setModalVisible(true);

      // Clear fields after successful upload
      setName('');
      setImageData(null);

      setImageUrl('');

    } catch (error) {
      setModalMessage('Error uploading data to Firestore.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };
  const validate = () => {
    let newErrors = {};

    // if (!firstName.trim()) newErrors.firstName = "First name is required";
    // if (!lastName.trim()) newErrors.lastName = "Last name is required";

    if (!gender.trim()) newErrors.gender = "Gender is required";

    if (!cnic || cnic.replace(/\D/g, "").length !== 13)
      newErrors.cnic = "CNIC must be 13 digits";

    if (!email.trim())
      newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!dateOfBirth || dateOfBirth.length !== 10)
      newErrors.dateOfBirth = "Invalid date of birth";

    if (!city)
      newErrors.city = "City is required";

   if (!imageData && !imageUrl)
  newErrors.image = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // if (!firstName || !lastName || !phone || !cnic || !email || !imageData || !city || !gender) {
    //   Alert.alert('Missing Info', 'Please fill all fields and upload image.');
    //   setModalMessage('Please select both images and enter a name.');
    //     setModalVisible(true);
    //   return;
    // }
    if (loading) return;
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const lawyerId = await AsyncStorage.getItem("lawyerId");
      // ⭐ Now build the API payload exactly how backend wants
      const payload = {
        lawyerId: Number(lawyerId),
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,        // You can add real date later
        gender: gender,             // Add gender dropdown later
        cnicNumber: cnic.replace(/-/g, ""), // remove dashes for backend
        city: city.label,             // city name
        cityId: city.value,           // city id
        email: email,
       profilePic: imageData  ? imageData.base64  : imageUrl || "", 
        isPicEdit: !!imageData
      };

      console.log("Payload Sending 👉", payload);

      // 📡 POST to API
      const response = await fetch(
        "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/Intro",
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
      console.log("API Success:", result);
      // Alert.alert("Success", "Your profile has been created!");
      setModalMessage("Your profile has been created!");
      setModalVisible(true);
      navigation.navigate('Education')
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };


  const formatPhone = (text) => {
    // Remove everything except digits
    let cleaned = text.replace(/\D/g, "");

    // Ensure it always starts with 92
    if (!cleaned.startsWith("92")) cleaned = "92" + cleaned;

    // Keep only 12 digits total (92 + 10 more)
    cleaned = cleaned.slice(0, 12);

    const num = cleaned.slice(2); // after 92

    let formatted = "+92";

    if (num.length > 0) formatted += " " + num.slice(0, 3);
    if (num.length > 3) formatted += " " + num.slice(3, 6);
    if (num.length > 6) formatted += " " + num.slice(6, 10);

    return formatted;
  };

  const formatCNIC = (text) => {
    let cleaned = text.replace(/\D/g, "");
    cleaned = cleaned.slice(0, 13); // limit digits

    let formatted = "";

    if (cleaned.length > 0) formatted = cleaned.slice(0, 5);
    if (cleaned.length > 5) formatted += "-" + cleaned.slice(5, 12);
    if (cleaned.length > 12) formatted += "-" + cleaned.slice(12, 13);

    return formatted;
  };
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const isFormValid =
    email &&
    cnic.replace(/\D/g, "").length === 13 &&
    city &&
    imageData &&
    dateOfBirth.length === 10;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.txt}>Let’s Get Started with Basics Information.</Text>
        <View style={styles.cent}>
         {/* {!imageData && imageUrl ? (
  <Image
    source={{
      uri: `https://loving-turing.91-239-146-172.plesk.page/images/${imageUrl}`
    }}
    style={styles.imageStyle}
  />
) : null} */}

 {imageData ? (
    // New picked image (base64 preview)
    <Image
      source={{ uri: `data:image/jpeg;base64,${imageData.base64}` }}
      style={styles.imageStyle}
    />
  ) : imageUrl ? (
    // Existing image from backend
    <Image
      source={{
        uri: `https://loving-turing.91-239-146-172.plesk.page/images/${imageUrl}`
      }}
      style={styles.imageStyle}
    />
  ) : (
    <User size={80} color="#999" />
  )}

          {errors.image && <Text style={styles.error}>{errors.image}</Text>}
          <TouchableOpacity
            style={styles.pickBtn}
            onPress={() => {
              if (Platform.OS === 'android') {
                requestCameraPermission(true);
              } else {
                openGallery(true);
              }
            }}
          >
            <View style={styles.rounde}>
              <Camera size={32} color="#16232C" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.txte, { marginTop: 10 }]}>Upload Your Profile Pic</Text>
        </View>
        <Text style={styles.txte}>First Name</Text>
        <CustomInput plc='First Name' editable={false} keyboardType='default' value={firstName} onChangeText={setFirstName} />
        {/* {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>} */}
        <Text style={styles.txte}>Last Name</Text>
        <CustomInput plc='Last Name' editable={false} keyboardType='default' value={lastName} onChangeText={setLastName} />
        <Text style={styles.txte}>Phone Number</Text>
        <CustomInput editable={false} plc='+92 300 00 00 000' keyboardType='number-pad' onChangeText={(text) => setPhone(formatPhone(text))} value={phone} />
        <Text style={styles.txte}>Gender</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={{ fontSize: 14 }}
          data={genderOptions}
          labelField="label"
          valueField="value"
          value={gender}
          onChange={(item) => setGender(item.value)}
          placeholder="-- Select Gender --"
          placeholderStyle={styles.plch}
        />
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
        <Text style={styles.txte}>CNIC</Text>
        <CustomInput plc='XXXXX-XXXXXXX-X' keyboardType='number-pad' value={cnic} onChangeText={(text) => setCnic(formatCNIC(text))} />
        {errors.cnic && <Text style={styles.error}>{errors.cnic}</Text>}
        <Text style={styles.txte}>Email Address</Text>
        <CustomInput plc='email' keyboardType='email-address' value={email} onChangeText={setEmail} />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        <Text style={styles.txte}>Date of Birth</Text>
        <View style={styles.rowV}>
          <View style={{ flex: 0.9 }}>
      <Text style={{ marginLeft: 10, color: dateOfBirth ? "#000" : "rgba(22,35,44,0.4)" }}>
              {dateOfBirth || "dd/mm/yyyy"}
            </Text>

          </View>
          <View style={{ flex: 0.15 }}>
            <TouchableOpacity

              onPress={() => setOpen(true)}
            >
              <Calendar size={32} color='#16232C' />
            </TouchableOpacity>
          </View>
        </View>
        <DatePicker
          modal
          open={open}
          date={dobDate}
          mode="date"
          maximumDate={new Date()}
          onConfirm={(date) => {
            setOpen(false);
            setDobDate(date);
            setDob(formatDate(date)); // ✅ string stored
          }}
          onCancel={() => setOpen(false)}
        />

        {errors.dateOfBirth && <Text style={styles.error}>{errors.dateOfBirth}</Text>}
        <Text style={styles.txte}>City</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={{ fontSize: 14 }}
          data={cityData}
          labelField="label"
          valueField="value"
          value={city}
          onChange={(item) => setCity(item)}
          placeholder="-- Select City --"
          placeholderStyle={styles.plch}
        />
        {errors.city && <Text style={styles.error}>{errors.city}</Text>}
        <View style={{ marginBottom: 10 }}>
          <CustomButton title={loading ? 'Saving…' : 'Next'} onPress={handleSubmit} disabled={loading} />
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default Intro

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  txt: { fontSize: 20, fontFamily: 'Montserrat-SemiBold', margin: 20 },
  txte: { fontSize: 15, fontFamily: 'Montserrat-Medium', marginHorizontal: 20 },
  dropdown: {
    height: 42,
    borderWidth: 1,
    borderColor: '#16232C',
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 15
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#16232C',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginBottom: 5
  },
  plch: { fontSize: 14, color: 'rgba(22, 35, 44, 0.4)', fontFamily: 'Montserrat-Light' },
  rounde: { borderRadius: 50, elevation: 5, backgroundColor: '#FFFFFF', padding: 10, },
  cent: { alignItems: 'center', margin: 10 },
  imageStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    margin: 15,
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
  rowV: { alignItems: 'center', flexDirection: 'row', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(22, 35, 44, 0.6)', height: 42, marginHorizontal: 15, margin: 10, },
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