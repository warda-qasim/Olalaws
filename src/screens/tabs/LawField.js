import { ScrollView, StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { Dropdown } from 'react-native-element-dropdown'
import { SquarePen } from 'lucide-react-native'
import AddMoreBtn from '../../components/AddMoreBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const LawField = () => {
  const navigation = useNavigation();
  const [specialize, setSpecialize] = useState(null);
  const [experience, setExperience] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [lawFieldList, setLawFieldList] = useState([])
  const [licenses, setLicenses] = useState([]);
  const [caseCategories, setCaseCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [districtBar, setDistrictBar] = useState("");
  const [cityBar, setCityBar] = useState("");
  const [loading, setLoading] = useState(true)

  const expData = [
    { label: '1 Year', value: 1 },
    { label: '2 Years', value: 2 },
    { label: '3 Years', value: 3 },
    { label: '5 Years', value: 5 },
    { label: '6 Years', value: 6 },
    { label: '7 Years', value: 7 },
    { label: '8 Years', value: 8 },
    { label: '9 Years', value: 9 },
    { label: '10 Years', value: 10 },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const lawyerId = await AsyncStorage.getItem('lawyerId');
      if (!lawyerId) {
        Alert.alert('Error', 'Lawyer ID missing');
        setLoading(false);
        return;
      }

      // Load dropdowns data
      const degreeRes = await fetch(
        "https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData"
      );
      const degreeJson = await degreeRes.json();

      // ✅ Case Categories
      let mappedCases = [];
      if (Array.isArray(degreeJson?.degreedata?.caseCategory)) {
        mappedCases = degreeJson.degreedata.caseCategory.map(item => ({
          label: item.name,
          value: item.caseCategoryId,
        }));
        setCaseCategories(mappedCases);
      }

      // ✅ Cities
      let mappedCities = [];
      if (degreeJson?.cities?.length) {
        mappedCities = degreeJson.cities.map(item => ({
          label: item.cityName,
          value: item.id,
        }));
        setCities(mappedCities);
      }

      // Load existing profile data
      const profileRes = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      );
      const profileJson = await profileRes.json();

      console.log('Profile Response:', JSON.stringify(profileJson, null, 2));

      // ✅ Set existing cases
      if (profileJson.experiences?.length) {
        setLawFieldList(
          profileJson.experiences.map(e => ({
            caseCategoryId: e.caseCategoryId, // Fixed typo
            caseCategoryName: e.caseCategoryName,
            lawyerExperienceId: e.lawyerExperienceId,
            experienceYears: e.experience,
            isNew: false,
          }))
        );
      }

      // ✅ Set existing licenses - AFTER cities are loaded
      if (profileJson.licenses?.length) {
        setLicenses(
          profileJson.licenses.map(l => ({
            lawyerLicenseId: l.lawyerLicenseId,
            licenseCityId: l.licenseCityId,
            cityName: mappedCities.find(c => c.value === l.licenseCityId)?.label || 'Unknown City',
            districtBar: l.districtBar || '',
            cityBar: l.cityBar || '',
            isNew: false,
          }))
        );
      }

    } catch (e) {
      console.log('LawField Error:', e);
      Alert.alert('Error', 'Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    if (!specialize || !experience) {
      Alert.alert('Missing fields', 'Please select specialization and experience');
      return;
    }

    if (!selectedCity || !districtBar || !cityBar) {
      Alert.alert('Missing license details', 'Please fill all license fields');
      return;
    }

    const label = caseCategories.find(c => c.value === specialize)?.label;
    const cityName = cities.find(c => c.value === selectedCity)?.label;

    // ➕ ADD CASE
    setLawFieldList(prev => [
      ...prev,
      {
        caseCategoryId: specialize, // Fixed typo
        caseCategoryName: label,
        lawyerExperienceId: 0,
        experienceYears: experience,
        isNew: true,
      },
    ]);

    // ➕ ADD LICENSE
    setLicenses(prev => [
      ...prev,
      {
        lawyerLicenseId: 0,
        licenseCityId: selectedCity,
        cityName: cityName,
        districtBar,
        cityBar,
        isNew: true,
      },
    ]);

    // 🔄 RESET FORM
    setSpecialize(null);
    setExperience(null);
    setSelectedCity(null);
    setDistrictBar('');
    setCityBar('');
  };

  const handleSubmit = async () => {
    if (lawFieldList.length === 0) {
      Alert.alert('Missing Data', 'Please add at least one specialization');
      return;
    }

    if (licenses.length === 0) {
      Alert.alert('Missing Data', 'Please add at least one license');
      return;
    }

    const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

    // Calculate total years of experience
    const totalYears = Math.max(...lawFieldList.map(c => c.experienceYears));

    const payload = {
      lawyerId,
      totalYearOfExperience: totalYears,
      experiences: lawFieldList.map(c => ({
        caseCategoryId: c.caseCategoryId, // Fixed: was caseCatogoryId
        lawyerExperienceId: c.lawyerExperienceId || 0,
        experienceYears: c.experienceYears, // Added: was missing
      })),
      lawyerLicense: licenses.map(l => ({
        lawyerLicenseId: l.lawyerLicenseId || 0,
        licenseCityId: l.licenseCityId,
        districtBar: l.districtBar,
        cityBar: l.cityBar,
      })),
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(
        'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/LawField',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      console.log('Submit response:', json);

      if (json?.data?.isSuccess) {
        Alert.alert('Success', 'Data saved successfully');
      } else {
        Alert.alert('Failed', json?.message || 'Submission failed');
      }
    } catch (e) {
      console.log('Submit error:', e);
      Alert.alert('Error', 'Unable to submit');
    }
  };
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E5B635" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.txt}>Add your Specialization Law Fields</Text>

      {/* Existing Specializations */}
      {lawFieldList.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Your Specializations:</Text>
          {lawFieldList.map((item, index) => (
            <View key={`${item.caseCatogoryId}-${index}`} style={styles.rowVi}>
              <View style={{flex:0.8}}>
                <Text style={styles.input}>{item.caseCategoryName}</Text>
                <Text style={styles.txtede}>{item.experienceYears} Years Experience</Text>
              </View>
              <TouchableOpacity style={styles.diVi} onPress={()=>navigation.navigate('EditExperience')}>
                <SquarePen size={22} color="white" />

              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Existing Licenses */}
      {licenses.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Your Licenses:</Text>
          {licenses.map((item, index) => (
            <View key={`license-${index}`} style={styles.rowVi}>
              <View style={{flex:0.8}}>
                <Text style={styles.input}>City: {item.cityName}</Text>
                <Text style={styles.txtede}>District Bar: {item.districtBar}</Text>
                <Text style={styles.txtede}>City Bar: {item.cityBar}</Text>
              </View>
              
              <TouchableOpacity style={styles.diVi}  onPress={()=>navigation.navigate('EditLicense')}>
                <SquarePen size={22} color="white" />

              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Add New Form */}
      <Text style={styles.txte}>Specialization Field</Text>
      <Dropdown
        style={styles.dropdown}
        data={caseCategories}
        labelField="label"
        valueField="value"
        value={specialize}
        onChange={item => setSpecialize(item.value)}
        placeholder="-- Select Specialization Field --"
        placeholderStyle={styles.plch}
      />

      <Text style={styles.txte}>Year of Experience</Text>
      <Dropdown
        style={styles.dropdown}
        data={expData}
        labelField="label"
        valueField="value"
        value={experience}
        onChange={item => setExperience(item.value)}
        placeholder="-- Select Option --"
        placeholderStyle={styles.plch}
      />

      <Text style={styles.txte}>License City</Text>
      <Dropdown
        style={styles.dropdown}
        data={cities}
        labelField="label"
        valueField="value"
        value={selectedCity}
        onChange={item => setSelectedCity(item.value)}
        placeholder="-- Select City --"
        placeholderStyle={styles.plch}
      />

      <Text style={styles.txte}>District Bar</Text>
      <CustomInput
        plc="District Bar"
        value={districtBar}
        onChangeText={setDistrictBar}
      />

      <Text style={styles.txte}>City Bar</Text>
      <CustomInput
        plc="City Bar"
        value={cityBar}
        onChangeText={setCityBar}
      />

      <AddMoreBtn title="Add More" onPress={handleAddMore} />
      <CustomButton title="Save Data" onPress={handleSubmit} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  txte: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  diVi: {backgroundColor: '#E5B635',margin:10,padding:12,borderRadius:10,alignSelf: 'center'},
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  plch: {
    color: '#999',
  },
  rowVi: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row'
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  txtede: {
    fontSize: 14,
    color: '#666',
  },
});

export default LawField;



// import { ScrollView, StyleSheet, Text, TextInput, View ,Alert, TouchableOpacity, FlatList} from 'react-native'
// import React, { useEffect, useState } from 'react'
// import CustomInput from '../../components/CustomInput'
// import CustomButton from '../../components/CustomButton'
// import { Dropdown } from 'react-native-element-dropdown'
// import { SquarePen } from 'lucide-react-native'
// import AddMoreBtn from '../../components/AddMoreBtn'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// const LawField = () => {
//   const [specialize, setSpecialize] = useState(null);
//   const [experience, setExperience] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
// const [lawFieldList, setLawFieldList] = useState([])
// const [licenses, setLicenses] = useState([]);
//   const [caseCategories, setCaseCategories] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [districtBar, setDistrictBar] = useState("");
//   const [cityBar, setCityBar] = useState("");
// const [list, setList] = useState([])
// const [input, setInput] = useState('')
// const [loading, setLoading] = useState(true)

//   const expData = [
//     { label: '1 Year', value: 1 },
//     { label: '2 Years', value: 2 },
//     { label: '3 Years', value: 3 },
//     { label: '5 Years', value: 5 },
//     { label: '6 Years', value: 6 },
//     { label: '7 Years', value: 7 },
//     { label: '8 Years', value: 8 },
//     { label: '9 Years', value: 9 },
//     { label: '10 Years', value: 10 },
//   ];

//   useEffect(() => {
//     loadData();
//     loadProfile(); // 👈 EXISTING specialization + licenses

//   }, []);
// const handleAddMore = () => {
//   if (!specialize || !experience) {
//     Alert.alert('Missing fields')
//     return
//   }

//   if (!selectedCity || !districtBar || !cityBar) {
//     Alert.alert('Missing license details')
//     return
//   }

//   const label = caseCategories.find(c => c.value === specialize)?.label

//   // ➕ ADD CASE (TOP par)
//   setLawFieldList(prev => [
//     {
//       caseCatogoryId: specialize,
//       caseCategoryName: label,
//       lawyerExperienceId: 0,
//       experienceYears: experience,
//       isNew: true,
//     },
//     ...prev,
//   ])

//   // ➕ ADD LICENSE (TOP par)
//   setLicenses(prev => [
//     {
//       lawyerLicenseId: 0,
//       licenseCityId: selectedCity,
//       districtBar,
//       cityBar,
//       isNew: true,
//     },
//     ...prev,
//   ])

//   // 🔄 RESET FORM
//   setSpecialize(null)
//   setExperience(null)
//   setSelectedCity(null)
//   setDistrictBar('')
//   setCityBar('')
// }

// const loadProfile = async () => {
//   try {
//     const lawyerId = await AsyncStorage.getItem('lawyerId')

//     const res = await fetch(
//       `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
//     )
//     const json = await res.json()

//     setLawFieldList(
//       (json.experiences || []).map(e => ({
//         caseCatogoryId: e.caseCategoryId,
//         caseCategoryName: e.caseCategoryName,
//         lawyerExperienceId: e.lawyerExperienceId,
//         experienceYears: e.experience,
//         isNew: false,
//       }))
//     )

//     setLicenses(
//       (json.licenses || []).map(l => ({
//         lawyerLicenseId: l.lawyerLicenseId,
//         licenseCityId: l.licenseCityId,
//         districtBar: l.districtBar,
//         cityBar: l.cityBar,
//         isNew: false,
//       }))
//     )
//   } catch (e) {
//     console.log(e)
//   } finally {
//     setLoading(false) // 🔥 IMPORTANT
//   }
// }







//   const loadData = async () => {
//     try {
//       const lawyerId = await AsyncStorage.getItem('lawyerId');
//       if (!lawyerId) {
//         Alert.alert('Error', 'Lawyer ID missing');
//         return;
//       }

//       const res = await fetch(
//         "https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData"
//       );

//       const json = await res.json();

//       // ✅ Case Categories
//       if (Array.isArray(json?.degreedata?.caseCategory)) {
//         const mappedCases = json?.degreedata?.caseCategory?.map(item => ({
//           label: item.name,           // REQUIRED
//           value: item.caseCategoryId, // REQUIRED
//         }));
//         setCaseCategories(mappedCases);
//       }
//       // ✅ Cities
//       if (json?.cities?.length) {
//         const mappedCities = json.cities.map(item => ({
//           label: item.cityName,
//           value: item.id,
//         }));
//         setCities(mappedCities);
//       }
//       console.log("FULL GetDegreeData RESPONSE:", json);
//       console.log("caseCategory:", json?.degreedata?.caseCategory);

//     } catch (e) {
//       console.log('LawField Error:', e);
//       Alert.alert('Error', 'Unable to load data');
//     }
//   };
// const handleSubmit = async () => {
//   if (lawFieldList.length === 0 || licenses.length === 0) {
//     Alert.alert('Missing', 'Please add at least one specialization and license');
//     return;
//   }

//   const lawyerIdStr = await AsyncStorage.getItem('lawyerId');
//   if (!lawyerIdStr) {
//     Alert.alert('Error', 'Lawyer ID missing');
//     return;
//   }

//   const payload = {
//     lawyerId: Number(lawyerIdStr),
//     totalYearOfExperience: getTotalExperience(), // ✅ FIX

//     experiences: lawFieldList.map(i => ({
//       caseCatogoryId: i.caseCatogoryId,
//       lawyerExperienceId: 0,
//     })),

//     // ✅ ONLY new licenses
//     lawyerLicense: licenses.filter(l => l.lawyerLicenseId === 0)
//   };

//   console.log('LAW FIELD PAYLOAD:', payload);

//   try {
//     const res = await fetch(
//       'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/LawField',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       }
//     );

//     const json = await res.json();

//     if (json?.data?.isSuccess) {
//       Alert.alert('Success');
//       setLicenses([]); // 🔥 important
//     } else {
//       Alert.alert('Error', 'Submission failed');
//     }
//   } catch (e) {
//     Alert.alert('Error', 'Unable to submit');
//   }
// };

 
// const handleSubmit = async () => {
//   const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

//   const payload = {
//     lawyerId,
//     totalYearOfExperience: experience,

//     experiences: lawFieldList.map(c => ({
//       caseCatogoryId: c.caseCatogoryId,
//       lawyerExperienceId: c.lawyerExperienceId || 0,
//     })),

//     lawyerLicense: licenses.map(l => ({
//       lawyerLicenseId: l.lawyerLicenseId || 0,
//       licenseCityId: l.licenseCityId,
//       districtBar: l.districtBar,
//       cityBar: l.cityBar,
//     })),
//   }

//   const res = await fetch(
//     'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/LawField',
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     }
//   )

//   const json = await res.json()

//   if (json?.data?.isSuccess) {
//     Alert.alert('Success')
//   } else {
//     Alert.alert('Failed')
//   }
// }


//   return (
//   <View style={styles.container}>
//   <FlatList
//     data={lawFieldList}
//     keyExtractor={(item, index) =>
//       `${item.caseCatogoryId}-${index}`
//     }
//     ListHeaderComponent={
//       <>
//         <Text style={styles.txt}>
//           Add your Specialization Law Fields
//         </Text>
//       </>
//     }
//     renderItem={({ item }) => (
//       <View style={styles.rowVi}>
//         <View>
//           <Text style={styles.input}>
//             {item.caseCategoryName}
//           </Text>
//           <Text style={styles.txtede}>
//             {item.experienceYears} Years Experience
//           </Text>
//         </View>
//       </View>
//     )}
//     ListFooterComponent={
//       <>
//         <Text style={styles.txte}>Specialization Field</Text>

//         <Dropdown
//           style={styles.dropdown}
//           data={caseCategories}
//           labelField="label"
//           valueField="value"
//           value={specialize}
//           onChange={item => setSpecialize(item.value)}
//           placeholder="-- Select Specialization Field --"
//           placeholderStyle={styles.plch}
//         />

//         <Text style={styles.txte}>Year of Experience</Text>

//         <Dropdown
//           style={styles.dropdown}
        //   data={expData}
        //   labelField="label"
        //   valueField="value"
        //   value={experience}
        //   onChange={item => setExperience(item.value)}
        //   placeholder="-- Select Option --"
        //   placeholderStyle={styles.plch}
        // />

        // <Text style={styles.txte}>License City</Text>

        // <Dropdown
        //   style={styles.dropdown}
        //   data={cities}
        //   labelField="label"
        //   valueField="value"
        //   value={selectedCity}
        //   onChange={item => setSelectedCity(item.value)}
        //   placeholder="-- Select City --"
        //   placeholderStyle={styles.plch}
        // />

        // <Text style={styles.txte}>District Bar</Text>
        // <CustomInput
        //   plc="District Bar"
//           value={districtBar}
//           onChangeText={setDistrictBar}
//         />

//         <Text style={styles.txte}>City Bar</Text>
//         <CustomInput
//           plc="City Bar"
//           value={cityBar}
//           onChangeText={setCityBar}
//         />

//         <AddMoreBtn title="Add More" onPress={handleAddMore} />
//         <CustomButton title="Next" onPress={handleSubmit} />
//       </>
//     }
//     contentContainerStyle={{ paddingBottom: 30 }}
//   />
// </View>

//   )
// }

// export default LawField;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF'
//   },
//   txt: { fontSize: 20, fontFamily: 'Montserrat-SemiBold', margin: 20 },
//   txte: { fontSize: 15, fontFamily: 'Montserrat-Medium', marginHorizontal: 20 },
//   dropdown: {
//     height: 42,
//     borderWidth: 1,
//     borderColor: '#16232C',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     justifyContent: 'center',
//     marginVertical: 8,
//     marginHorizontal: 15
//   },

//   selectedTextStyle: {
//     fontSize: 14,
//     color: '#16232C',
//   },
//   txtede: {fontSize: 16,fontFamily: 'Montserrat-Medium',paddingHorizontal:10, flexWrap: 'wrap',maxWidth: '79%', },
//   plch: { fontSize: 14, color: 'rgba(22, 35, 44, 0.4)', fontFamily: 'Montserrat-Light' },
//   rowV: { alignItems: 'center', flexDirection: 'row', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(22, 35, 44, 0.6)', height: 42, marginHorizontal: 15, margin: 10, },
//   input: { fontSize: 14, padding: 10, fontFamily: 'Montserrat-Light' },
//   rowVi: {flexDirection: 'row',justifyContent: 'space-between',marginVertical:5,marginHorizontal:15,backgroundColor: 'rgba(22, 35, 44, 0.04)',borderRadius:15},
//  diVi: {backgroundColor: '#E5B635',margin:10,padding:12,borderRadius:10,alignSelf: 'center'}
// })












//   <View style={styles.container}>
//       <ScrollView>
//         <Text style={styles.txt}>Add your Specialization Law Fields</Text>
        
//           {/* {lawFieldList.map((item, index) => (
//    <View key={index} style={styles.rowVi}>
//     <View>
//        <Text style={styles.input}>{item.caseCategoryName}</Text>
//         <Text style={styles.txtede}> {item.experienceYears} Years Experience</Text>
//     </View>
//     <View style={styles.diVi}>
//       <TouchableOpacity>
//      <SquarePen size={24} color="#FFFFFF" />
//      </TouchableOpacity>
    
//     </View>
   
//    </View>
//     ))} */}

//     <FlatList
//   data={lawFieldList}
//   keyExtractor={(item, index) =>
//     `${item.caseCatogoryId}-${index}`
//   }
//   renderItem={({ item }) => (
//     <View style={styles.rowVi}>
//       <View>
//         <Text style={styles.input}>{item.caseCategoryName}</Text>
//         <Text style={styles.txtede}>
//           {item.experienceYears} Years Experience
//         </Text>
//       </View>
//     </View>
//   )}
// />


//         <Text style={styles.txte}>Specialization Field</Text>
//         <Dropdown
//           style={styles.dropdown}
//           selectedTextStyle={styles.selectedTextStyle}
//           itemTextStyle={{ fontSize: 14 }}
//           data={caseCategories}
//           labelField="label"
//           valueField="value"
//           value={specialize}                    
//           onChange={(item) => setSpecialize(item.value)}
//           placeholder="-- Select Specialization Field --"
//           placeholderStyle={styles.plch}
//         />
//         <Text style={styles.txte}>Year of Experience</Text>
//         <Dropdown
//           style={styles.dropdown}
//           selectedTextStyle={styles.selectedTextStyle}
//           itemTextStyle={{ fontSize: 14 }}
//           data={expData}
//           labelField="label"
//           valueField="value"
//           value={experience}
//           onChange={(item) => setExperience(item.value)}
//           placeholder="-- Select Option --"
//           placeholderStyle={styles.plch}
//         />
        
 
//         <Text style={styles.txte}>License City</Text>
//         <Dropdown
//           style={styles.dropdown}
//           data={cities}
//           labelField="label"
//           valueField="value"
//           value={selectedCity}
//           onChange={(item) => setSelectedCity(item.value)}
//           placeholder="-- Select City --"
//           placeholderStyle={styles.plch}
//         />
//         <Text style={styles.txte}>District Bar</Text>
//         <CustomInput plc='District Bar' keyboardType='default' value={districtBar} onChangeText={setDistrictBar} />
//         <Text style={styles.txte}>City Bar</Text>
//         <CustomInput plc='City Bar' keyboardType='default' value={cityBar} onChangeText={setCityBar} />
   

//         <AddMoreBtn title='Add More' onPress={handleAddMore} />
//     <CustomButton
//    title={"Next"}
//   onPress={ handleSubmit}
// />
//       </ScrollView>
//     </View>