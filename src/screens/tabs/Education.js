import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { Dropdown } from 'react-native-element-dropdown';
import { Calendar, SquarePen } from 'lucide-react-native';
import AddMoreBtn from '../../components/AddMoreBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Education = () => {
  const navigation = useNavigation();

  const [degreeType, setDegreeType] = useState(null);
  const [degree, setDegree] = useState(null);
  const [dateOfCompletion, setDateOfCompletion] = useState('');

  const [dtData, setDtData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);

  const [savedEducation, setSavedEducation] = useState([]); // GET DATA
  const [newEducation, setNewEducation] = useState([]);     // UI ADD

  const [open, setOpen] = useState(false);
  const [docDate, setDocDate] = useState(new Date(2000, 0, 1));

  /* ------------------ HELPERS ------------------ */
  const formatDate = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  /* ------------------ FETCH DEGREE DATA ------------------ */
  useEffect(() => {
    const fetchDegreeData = async () => {
      const res = await fetch(
        'https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData'
      );
      const json = await res.json();

      setDtData(
        json.degreedata.degreeType.map(d => ({
          label: d.typeName,
          value: d.degreeTypeId,
        }))
      );

      setDegreeData(
        json.degreedata.degree.map(d => ({
          label: d.degreeName,
          value: d.degreeId,
        }))
      );
    };

    fetchDegreeData();
  }, []);

  /* ------------------ FETCH PROFILE (GET) ------------------ */
  const fetchProfile = async () => {
    const lawyerId = await AsyncStorage.getItem('lawyerId');
    const res = await fetch(
      `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
    );
    const json = await res.json();
    setSavedEducation(json.qualifications || []);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ------------------ ADD (UI ONLY) ------------------ */
  const handleAdd = () => {
    if (!degreeType || !degree || !dateOfCompletion) {
      Alert.alert('Missing', 'Fill all fields');
      return;
    }

    const newItem = {
      degreeTypeId: degreeType,
      degreeId: degree,
      completionYear: dateOfCompletion,
    };

    setNewEducation(prev => [...prev, newItem]);

    setDegreeType(null);
    setDegree(null);
    setDateOfCompletion('');
  };

  /* ------------------ SUBMIT (POST ONLY) ------------------ */
  const handleSubmit = async () => {
    if (newEducation.length === 0) {
      Alert.alert('Empty', 'Please add at least one education');
      return;
    }

    const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

    const payload = newEducation.map(item => ({
      lawyerId,
      degreeTypeId: item.degreeTypeId,
      degreeId: item.degreeId,
      completionYear: item.completionYear,
    }));

    const res = await fetch(
      'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/Education',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();

    if (res.ok && json?.data?.isSuccess) {
      Alert.alert('Success', 'Education saved');
      setNewEducation([]);
      fetchProfile(); // refresh GET data
    } else {
      Alert.alert('Error', 'Failed to save education');
    }
  };

  /* ------------------ RENDER CARD ------------------ */
  const renderCard = (item, index) => (
    <View key={index} style={styles.rowVi}>
      <View style={{ flex: 0.8 }}>
        <Text style={styles.input}>
          {dtData.find(d => d.value === item.degreeTypeId)?.label || ''}
        </Text>
        <Text style={styles.txtede}>
          {degreeData.find(d => d.value === item.degreeId)?.label || ''}
        </Text>
        <Text style={styles.input}>{item.completionYear}</Text>
      </View>

      {'lawyerQualificationId' in item && (
        <View style={styles.diVi}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EditEducation', { education: item })
            }
          >
            <SquarePen size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.txt}>Add your Educational Details Here</Text>

        {dtData.length > 0 &&
          degreeData.length > 0 && (
            <>
              {savedEducation.map(renderCard)}
              {newEducation.map(renderCard)}
            </>
          )}

        <Text style={styles.txte}>Degree Type</Text>
        <Dropdown
          style={styles.dropdown}
          data={dtData}
          labelField="label"
          valueField="value"
          value={degreeType}
          onChange={item => setDegreeType(item.value)}
          placeholder="-- Select Degree Type --"
        />

        <Text style={styles.txte}>Degree</Text>
        <Dropdown
          style={styles.dropdown}
          data={degreeData}
          labelField="label"
          valueField="value"
          value={degree}
          onChange={item => setDegree(item.value)}
          placeholder="-- Select Degree --"
        />

     <Text style={styles.txte}>Date of Completion</Text>
                   <View style={styles.rowV}>
                     <View style={{ flex: 0.9 }}>
                 <Text style={{ marginLeft: 10, color: dateOfCompletion ? "#000" : "rgba(22,35,44,0.4)" }}>
                         {dateOfCompletion || "dd/mm/yyyy"}
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
                     date={docDate}
                     mode="date"
                     maximumDate={new Date()}
                     onConfirm={(date) => {
                       setOpen(false);
                       setDocDate(date);
                       setDateOfCompletion(formatDate(date)); // ✅ string stored
                     }}
                     onCancel={() => setOpen(false)}
                   />
      
        <AddMoreBtn title="Add" onPress={handleAdd} />
        <CustomButton title="Save Data" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Education;


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFFFF'
    },
    txt: {fontSize: 20,fontFamily: 'Montserrat-SemiBold',margin:20 },
    txte: {fontSize: 15,fontFamily: 'Montserrat-Medium',marginHorizontal:20},
    txtede: {fontSize: 16,fontFamily: 'Montserrat-Medium',paddingHorizontal:10, flexWrap: 'wrap',maxWidth: '79%', },
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

  selectedTextStyle: {
    fontSize: 14,
    color: '#16232C',
  },
  plch: {fontSize:14,color: 'rgba(22, 35, 44, 0.4)',fontFamily: 'Montserrat-Light'},
  rowV: {alignItems:'center',flexDirection: 'row',borderRadius:8,borderWidth:1,borderColor: 'rgba(22, 35, 44, 0.6)',height:42,marginHorizontal: 15,margin:10,},
  input: {fontSize: 14,padding:10,fontFamily: 'Montserrat-Light' },
  rowVi: {flexDirection: 'row',justifyContent: 'space-between',marginVertical:5,marginHorizontal:15,backgroundColor: 'rgba(22, 35, 44, 0.04)',borderRadius:15},
  diVi: {flexDirection: 'row',justifyContent: 'space-between',backgroundColor: '#E5B635',margin:10,padding:12,borderRadius:10,alignSelf: 'center'}
})









// import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,Alert, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import CustomButton from '../../components/CustomButton'
// import { Dropdown } from 'react-native-element-dropdown'
// import { Calendar, SquarePen, Trash2 } from 'lucide-react-native'
// import AddMoreBtn from '../../components/AddMoreBtn'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DatePicker from 'react-native-date-picker'
// import { useNavigation } from '@react-navigation/native'
// const Education = () => {
//   const navigation = useNavigation();
// const [degreeType, setDegreeType] = useState(null);
//   const [degree, setDegree] = useState(null);
//   const [dateOfCompletion, setDateOfCompletion] = useState('');

//   const [dtData, setDtData] = useState([]);
//   const [degreeData, setDegreeData] = useState([]);

//   const [savedEducation, setSavedEducation] = useState([]); // GET DATA
//   const [newEducation, setNewEducation] = useState([]);     // UI ADD

//   const [open, setOpen] = useState(false);
//   const [docDate, setDocDate] = useState(new Date(2000, 0, 1));

//   /* ------------------ HELPERS ------------------ */
//   const formatDate = (date) => {
//     const d = String(date.getDate()).padStart(2, '0');
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const y = date.getFullYear();
//     return `${d}/${m}/${y}`;
//   };

//   /* ------------------ FETCH DEGREE DATA ------------------ */
//   useEffect(() => {
//     const fetchDegreeData = async () => {
//       const res = await fetch(
//         'https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData'
//       );
//       const json = await res.json();
// console.log("DegreeData Fetch",json)
//       setDtData(
//         json.degreedata.degreeType.map((d) => ({
//           label: d.typeName,
//           value: d.degreeTypeId,
//         }))
//       );

//       setDegreeData(
//         json.degreedata.degree.map((d) => ({
//           label: d.degreeName,
//           value: d.degreeId,
//         }))
//       );
//     };

//     fetchDegreeData();
//   }, []);

//   /* ------------------ FETCH EXISTING EDUCATION ------------------ */
//   useEffect(() => {
//     const fetchProfile = async () => {
//       const lawyerId = await AsyncStorage.getItem('lawyerId');
//       const res = await fetch(
//         `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
//       );
//       const json = await res.json();
// console.log("GetLawyerProfile Data",json)
//       const list = json.qualifications.map((q) => ({
//         lawyerQualificationId: q.lawyerQualificationId,
//         degreeTypeId: q.degreeTypeId,
//         degreeId: q.degreeId,
//         completionYear: q.completionYear,
//         isNew: false,
//       }));

//       setSavedEducation(list);
     
//     };

//     fetchProfile();
//   }, []);
// const handleAdd = () => {
//   if (!degreeType || !degree || !dateOfCompletion) {
//     Alert.alert('Missing', 'Fill all fields');
//     return;
//   }

//   const newItem = {
//     degreeTypeId: degreeType,
//     degreeId: degree,
//     completionYear: dateOfCompletion,
//   };

//   setNewEducation(prev => [...prev, newItem]);

//   // clear fields
//   setDegreeType(null);
//   setDegree(null);
//   setDateOfCompletion('');
// };

//   /* ------------------ ADD / EDIT ------------------ */
// const handleSubmit = async () => {
//   if (newEducation.length === 0) {
//     Alert.alert('Empty', 'Please add at least one education');
//     return;
//   }

//   const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

//   const payload = newEducation.map(item => ({
//     lawyerId,
//     degreeTypeId: item.degreeTypeId,
//     degreeId: item.degreeId,
//     completionYear: item.completionYear,
//   }));

//   const res = await fetch(
//     'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/Education',
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     }
//   );

//   const json = await res.json();

//   if (res.ok && json?.data?.isSuccess) {
//     Alert.alert('Success', 'Education saved successfully');
//      setNewEducation([]);

//   } else {
//     Alert.alert('Error', 'Failed to save education');
//   }
// };

//  /* ------------------ RENDER CARD ------------------ */
//   const renderCard = (item, index) => (
//     <View key={index} style={styles.rowVi}>
//       <View style={{ flex: 0.8 }}>
//         <Text style={styles.input}>
//           {dtData.find(d => d.value === item.degreeTypeId)?.label || ''}
//         </Text>
//         <Text style={styles.txtede}>
//           {degreeData.find(d => d.value === item.degreeId)?.label || ''}
//         </Text>
//         <Text style={styles.input}>{item.completionYear}</Text>
//       </View>

//       {'lawyerQualificationId' in item && (
//         <View style={styles.diVi}>
//           <TouchableOpacity
//             onPress={() =>
//               navigation.navigate('EditEducation', { education: item })
//             }
//           >
//             <SquarePen size={24} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//         <ScrollView>
//    <Text style={styles.txt}>Add your Educational Details Here</Text>
//    {/* {dtData.length > 0 && degreeData.length > 0 &&
//    educationList.map((item, index) => (
//    <View key={index} style={styles.rowVi}>
//     <View style={{flex:0.8}}>
//        <Text style={styles.input}>{dtData.find(d => d.value === item.degreeTypeId)?.label || ''}</Text>
//         <Text style={styles.txtede}>{degreeData.find((d) => d.value === item.degreeId)?.label || ''}</Text>
//          <Text style={styles.input}>{item.completionYear}</Text>
//     </View>
//     <View style={styles.diVi}>
//       <TouchableOpacity onPress={() => navigation.navigate('EditEducation')}>
//      <SquarePen size={24} color="#FFFFFF" />
//      </TouchableOpacity>
     
//     </View>
   
//    </View>
//     ))} */}

//      {dtData.length > 0 &&
//           degreeData.length > 0 && (
//             <>
//               {savedEducation.map(renderCard)}
//               {newEducation.map(renderCard)}
//             </>
//           )}


//      <Text style={styles.txte}>Degree Type</Text>
//        <Dropdown
//               style={styles.dropdown}
//               selectedTextStyle={styles.selectedTextStyle}
//               itemTextStyle={{ fontSize: 14 }}
//               data={dtData}
//               labelField="label"
//               valueField="value"
//               value={degreeType}
//               onChange={(item) => setDegreeType(item.value)}
//               placeholder="-- Select Degree Type --"
//               placeholderStyle={styles.plch}
//             />
//              <Text style={styles.txte}>Degree</Text>
//        <Dropdown
//               style={styles.dropdown}
//               selectedTextStyle={styles.selectedTextStyle}
//               itemTextStyle={{ fontSize: 14 }}
//               data={degreeData}
//               labelField="label"
//               valueField="value"
//               value={degree}
//               onChange={(item) => setDegree(item.value)}
//               placeholder="-- Select Degree --"
//               placeholderStyle={styles.plch}
//             />
//              <Text style={styles.txte}>Date of Completion</Text>
//                    <View style={styles.rowV}>
//                      <View style={{ flex: 0.9 }}>
//                  <Text style={{ marginLeft: 10, color: dateOfCompletion ? "#000" : "rgba(22,35,44,0.4)" }}>
//                          {dateOfCompletion || "dd/mm/yyyy"}
//                        </Text>
           
//                      </View>
//                      <View style={{ flex: 0.15 }}>
//                        <TouchableOpacity
           
//                          onPress={() => setOpen(true)}
//                        >
//                          <Calendar size={32} color='#16232C' />
//                        </TouchableOpacity>
//                      </View>
//                    </View>
//                    <DatePicker
//                      modal
//                      open={open}
//                      date={docDate}
//                      mode="date"
//                      maximumDate={new Date()}
//                      onConfirm={(date) => {
//                        setOpen(false);
//                        setDocDate(date);
//                        setDateOfCompletion(formatDate(date)); // ✅ string stored
//                      }}
//                      onCancel={() => setOpen(false)}
//                    />
           
//             <AddMoreBtn title={'Add'} onPress={handleAdd} />
//      <CustomButton title="Save Data" onPress={handleSubmit} />
//      </ScrollView>
//     </View>
//   )
// }

// export default Education









 