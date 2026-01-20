// import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import CustomButton from '../components/CustomButton'
// import CustomInput from '../components/CustomInput'
// import { SquarePen, Trash2 } from 'lucide-react-native'
// import AddMoreBtn from '../components/AddMoreBtn'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Dropdown } from 'react-native-element-dropdown'

// const EditExperience = () => {
// const [cases, setCases] = useState([]);
// const [deletedCases, setDeletedCases] = useState([]);
// const [editingExpId, setEditingExpId] = useState(null);

// const [specialize, setSpecialize] = useState(null); // caseCatogoryId
// const [experience, setExperience] = useState(null); // years
//   const [loading, setLoading] = useState(true);
//  const [caseCategories, setCaseCategories] = useState([]);
//   /* ------------------ LOAD EXISTING LICENSES ------------------ */
//   useEffect(() => {
//     const loadCases = async () => {
//       const lawyerId = await AsyncStorage.getItem('lawyerId')

//       const res = await fetch(
//         `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
//       )
//       const json = await res.json()
// console.log("Get Lawyer Profile",json)
//       const formatted = (json.experiences || []).map(l => ({
//         lawyerExperienceId: l.lawyerExperienceId,
//         caseCategoryId: l.caseCategoryId,
//         caseCategoryName: l.caseCategoryName,
//         experienceYears: l.experienceYears,
//         isNew: false,
//       }))

//       setCases(formatted)
//     }

//     loadCases()
//   }, [])

//   /* ------------------ ADD / UPDATE ------------------ */
//  const handleAddOrUpdateCase = () => {
//   if (!specialize || !experience) {
//     Alert.alert("Missing fields");
//     return;
//   }

//   if (editingExpId) {
//     setCases(prev =>
//       prev.map(c =>
//         c.lawyerExperienceId === editingExpId
//           ? { ...c, caseCatogoryId: specialize, experienceYears: experience }
//           : c
//       )
//     );
//   } else {
//     setCases(prev => [
//       ...prev,
//       {
//         lawyerExperienceId: 0,
//         caseCatogoryId: specialize,
//         experienceYears: experience,
//         isNew: true,
//       },
//     ]);
//   }

//   setEditingExpId(null);
//   setSpecialize(null);
//   setExperience(null);
// };


//   /* ------------------ EDIT ------------------ */
//  const handleEditCase = (item) => {
//   setEditingExpId(item.lawyerExperienceId);
//   setSpecialize(item.caseCatogoryId);
//   setExperience(item.experienceYears);
// };


//   /* ------------------ DELETE ------------------ */
// const deleteCaseFromBackend = async (item) => {
//   const lawyerId = Number(await AsyncStorage.getItem("lawyerId"));

//   const payload = {
//     totalYearOfExperience: 0,
//     lawyerId,

//     // 🔴 REQUIRED
//     addCasecategories: [],
//     editCasecategories: [],
//     deleteCasecategories: [
//       {
//         caseCatogoryId: item.caseCatogoryId,
//         lawyerExperienceId: item.lawyerExperienceId,
//       },
//     ],

//     // 🔴 LICENSE ARRAYS MUST BE EMPTY
//     addLawyerLicense: [],
//     editLawyerLicense: [],
//     deleteLawyerLicense: [],
//   };

//   const res = await fetch(
//     "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense",
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }
//   );

//   const json = await res.json();

//   if (res.ok && json?.data?.isSuccess) {
//     setCases(prev =>
//       prev.filter(c => c.lawyerExperienceId !== item.lawyerExperienceId)
//     );
//     Alert.alert("Deleted", "Case category deleted");
//   } else {
//     Alert.alert("Error", "Delete failed");
//   }
// };

//   /* ------------------ SUBMIT ------------------ */
// const handleSubmit = async () => {
//   const lawyerId = Number(await AsyncStorage.getItem("lawyerId"));

//   const payload = {
//     totalYearOfExperience: experience || 0,
//     lawyerId,

//     addCasecategories: cases
//       .filter(c => c.isNew)
//       .map(c => ({
//         caseCatogoryId: c.caseCatogoryId,
//         lawyerExperienceId: 0,
//       })),

//     editCasecategories: cases
//       .filter(c => !c.isNew)
//       .map(c => ({
//         caseCatogoryId: c.caseCatogoryId,
//         lawyerExperienceId: c.lawyerExperienceId,
//       })),

//     deleteCasecategories: [],

//     // 🔴 REQUIRED EMPTY LICENSE ARRAYS
//     addLawyerLicense: [],
//     editLawyerLicense: [],
//     deleteLawyerLicense: [],
//   };

//   const res = await fetch(
//     "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense",
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     }
//   );

//   const json = await res.json();

//   if (res.ok && json?.data?.isSuccess) {
//     Alert.alert("Success", "Experience updated");
//   } else {
//     Alert.alert("Error", "Update failed");
//   }
// };

// const expData = [
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

//   return (
//     <View style={styles.container}>
//         <ScrollView>
//    <Text style={styles.txt}>Edit your Experience Details Here</Text>
//    {cases.map((item, index) => (
//    <View key={index} style={styles.rowVi}>
//     <View style={{flex:0.8}}>
//        <Text style={styles.input}>{cities.find(c => c.value === item.licenseCityId)?.label}</Text>
//         <Text style={styles.txtede}>{item.districtBar}</Text>
//          <Text style={styles.input}>{item.cityBar}</Text>
//     </View>
//     <View style={styles.diVi}>
//       <TouchableOpacity onPress={() => handleEditCase(item)}>
//      <SquarePen size={24} color="#FFFFFF" />
//      </TouchableOpacity>
//       <TouchableOpacity  onPress={() => deleteCaseFromBackend(item)}>
//                 <Trash2 color="red" />
//               </TouchableOpacity>
//     </View> 
//    </View>
//     ))}
//        <Text style={styles.txte}>Specialization Field</Text>
//                <Dropdown
//                  style={styles.dropdown}
//                  selectedTextStyle={styles.selectedTextStyle}
//                  itemTextStyle={{ fontSize: 14 }}
//                  data={caseCategories}
//                  labelField="label"
//                  valueField="value"
//                  value={specialize}                    
//                  onChange={(item) => setSpecialize(item.value)}
//                  placeholder="-- Select Specialization Field --"
//                  placeholderStyle={styles.plch}
//                />
//                 <Text style={styles.txte}>Year of Experience</Text>
//                        <Dropdown
//                          style={styles.dropdown}
//                          selectedTextStyle={styles.selectedTextStyle}
//                          itemTextStyle={{ fontSize: 14 }}
//                          data={expData}
//                          labelField="label"
//                          valueField="value"
//                          value={experience}
//                          onChange={(item) => setExperience(item.value)}
//                          placeholder="-- Select Option --"
//                          placeholderStyle={styles.plch}
//                        />
//             <AddMoreBtn title={editingId ? 'Update' : 'Add'} onPress={handleAddOrUpdateCase} />
//      <CustomButton title="Save Changes" onPress={handleSubmit} />
//      </ScrollView>
//     </View>
//   )
// }

// export default EditExperience

// const styles = StyleSheet.create({
//     container: {
//         flex:1,
//         backgroundColor: '#FFFFFF'
//     },
//     txt: {fontSize: 20,fontFamily: 'Montserrat-SemiBold',margin:20 },
//     txte: {fontSize: 15,fontFamily: 'Montserrat-Medium',marginHorizontal:20},
//     txtede: {fontSize: 16,fontFamily: 'Montserrat-Medium',paddingHorizontal:10, flexWrap: 'wrap',maxWidth: '79%', },
//     dropdown: {
//     height: 42,
//     borderWidth: 1,
//     borderColor: '#16232C',
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     justifyContent: 'center',
//     marginVertical:8,
//     marginHorizontal:15
//   },

//   selectedTextStyle: {
//     fontSize: 14,
//     color: '#16232C',
//   },
//   plch: {fontSize:14,color: 'rgba(22, 35, 44, 0.4)',fontFamily: 'Montserrat-Light'},
//   rowV: {alignItems:'center',flexDirection: 'row',borderRadius:8,borderWidth:1,borderColor: 'rgba(22, 35, 44, 0.6)',height:42,marginHorizontal: 15,margin:10,},
//   input: {fontSize: 14,padding:10,fontFamily: 'Montserrat-Light' },
//   rowVi: {flexDirection: 'row',justifyContent: 'space-between',marginVertical:5,marginHorizontal:15,backgroundColor: 'rgba(22, 35, 44, 0.04)',borderRadius:15},
//   diVi: {flex:0.2,flexDirection: 'row',justifyContent: 'space-between',backgroundColor: '#E5B635',margin:10,padding:12,borderRadius:10,alignSelf: 'center'}
// })


import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import { SquarePen, Trash2 } from 'lucide-react-native'
import AddMoreBtn from '../components/AddMoreBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dropdown } from 'react-native-element-dropdown'

const EditExperience = () => {
  const [cases, setCases] = useState([]);
  const [deletedCases, setDeletedCases] = useState([]);
  const [editingExpId, setEditingExpId] = useState(null);
  
  const [specialize, setSpecialize] = useState(null); // caseCatogoryId
  const [experience, setExperience] = useState(null); // years
  
  // ✅ ADD THESE MISSING STATES
  const [caseCategories, setCaseCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  /* ------------------ LOAD DATA ------------------ */
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

      // ✅ Load dropdown data (case categories)
      const degreeRes = await fetch(
        "https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData"
      );
      const degreeJson = await degreeRes.json();

      if (Array.isArray(degreeJson?.degreedata?.caseCategory)) {
        const mappedCases = degreeJson.degreedata.caseCategory.map(item => ({
          label: item.name,
          value: item.caseCategoryId,
        }));
        setCaseCategories(mappedCases);
      }

      // ✅ Load existing experiences
      const profileRes = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      );
      const profileJson = await profileRes.json();
      
      console.log("Get Lawyer Profile", profileJson);

      const formatted = (profileJson.experiences || []).map(l => ({
        lawyerExperienceId: l.lawyerExperienceId,
        caseCatogoryId: l.caseCategoryId,
        caseCategoryName: l.caseCategoryName,
        experienceYears: l.experience, // ⚠️ Check if it's 'experience' or 'experienceYears'
        isNew: false,
      }));

      setCases(formatted);
      
    } catch (error) {
      console.log('Load error:', error);
      Alert.alert('Error', 'Unable to load data');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ ADD / UPDATE ------------------ */
  const handleAddOrUpdateCase = () => {
    if (!specialize || !experience) {
      Alert.alert("Missing fields");
      return;
    }

    const categoryName = caseCategories.find(c => c.value === specialize)?.label;

    if (editingExpId) {
      // Update existing
      setCases(prev =>
        prev.map(c =>
          c.lawyerExperienceId === editingExpId
            ? { 
                ...c, 
                caseCatogoryId: specialize, 
                caseCategoryName: categoryName,
                experienceYears: experience 
              }
            : c
        )
      );
    } else {
      // Add new
      setCases(prev => [
        ...prev,
        {
          lawyerExperienceId: 0,
          caseCatogoryId: specialize,
          caseCategoryName: categoryName,
          experienceYears: experience,
          isNew: true,
        },
      ]);
    }

    setEditingExpId(null);
    setSpecialize(null);
    setExperience(null);
  };

  /* ------------------ EDIT ------------------ */
  const handleEditCase = (item) => {
    setEditingExpId(item.lawyerExperienceId);
    setSpecialize(item.caseCatogoryId);
    setExperience(item.experienceYears);
  };

  /* ------------------ DELETE ------------------ */
  const deleteCaseFromBackend = async (item) => {
    const lawyerId = Number(await AsyncStorage.getItem("lawyerId"));

    const payload = {
      totalYearOfExperience: 0,
      lawyerId,

      // 🔴 REQUIRED
      addCasecategories: [],
      editCasecategories: [],
      deleteCasecategories: [
        {
          caseCatogoryId: item.caseCatogoryId,
          lawyerExperienceId: item.lawyerExperienceId,
        },
      ],

      // 🔴 LICENSE ARRAYS MUST BE EMPTY
      addLawyerLicense: [],
      editLawyerLicense: [],
      deleteLawyerLicense: [],
    };

    console.log('Delete payload:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(
        "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (res.ok && json?.data?.isSuccess) {
        setCases(prev =>
          prev.filter(c => c.lawyerExperienceId !== item.lawyerExperienceId)
        );
        Alert.alert("Deleted", "Case category deleted");
      } else {
        Alert.alert("Error", "Delete failed");
      }
    } catch (error) {
      console.log('Delete error:', error);
      Alert.alert("Error", "Unable to delete");
    }
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async () => {
    if (cases.length === 0) {
      Alert.alert("No Data", "Please add at least one case category");
      return;
    }

    const lawyerId = Number(await AsyncStorage.getItem("lawyerId"));

    // Calculate max experience years
    const maxExperience = Math.max(...cases.map(c => c.experienceYears));

    const payload = {
      totalYearOfExperience: maxExperience,
      lawyerId,

      addCasecategories: cases
        .filter(c => c.isNew)
        .map(c => ({
          caseCatogoryId: c.caseCatogoryId,
          lawyerExperienceId: 0,
        })),

      editCasecategories: cases
        .filter(c => !c.isNew)
        .map(c => ({
          caseCatogoryId: c.caseCatogoryId,
          lawyerExperienceId: c.lawyerExperienceId,
        })),

      deleteCasecategories: [],

      // 🔴 REQUIRED EMPTY LICENSE ARRAYS
      addLawyerLicense: [],
      editLawyerLicense: [],
      deleteLawyerLicense: [],
    };

    console.log('Submit payload:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(
        "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (res.ok && json?.data?.isSuccess) {
        Alert.alert("Success", "Experience updated");
        // Reload data to get fresh state
        loadData();
      } else {
        Alert.alert("Error", json?.message || "Update failed");
      }
    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert("Error", "Unable to submit");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E5B635" />
        <Text style={{ marginTop: 10, fontFamily: 'Montserrat-Medium' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.txt}>Edit your Experience Details Here</Text>
        
        {/* Display existing cases */}
        {cases.map((item, index) => (
          <View key={index} style={styles.rowVi}>
            <View style={{ flex: 0.8 }}>
              <Text style={styles.input}>{item.caseCategoryName}</Text>
              <Text style={styles.txtede}>{item.experienceYears} Years Experience</Text>
            </View>
            <View style={styles.diVi}>
              <TouchableOpacity onPress={() => handleEditCase(item)}>
                <SquarePen size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCaseFromBackend(item)}>
                <Trash2 color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Form to add/edit */}
        <Text style={styles.txte}>Specialization Field</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={{ fontSize: 14 }}
          data={caseCategories}
          labelField="label"
          valueField="value"
          value={specialize}
          onChange={(item) => setSpecialize(item.value)}
          placeholder="-- Select Specialization Field --"
          placeholderStyle={styles.plch}
        />

        <Text style={styles.txte}>Year of Experience</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={{ fontSize: 14 }}
          data={expData}
          labelField="label"
          valueField="value"
          value={experience}
          onChange={(item) => setExperience(item.value)}
          placeholder="-- Select Option --"
          placeholderStyle={styles.plch}
        />

        <AddMoreBtn 
          title={editingExpId ? 'Update' : 'Add'} 
          onPress={handleAddOrUpdateCase} 
        />
        <CustomButton title="Save Changes" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

export default EditExperience;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  txt: { 
    fontSize: 20, 
    fontFamily: 'Montserrat-SemiBold', 
    margin: 20 
  },
  txte: { 
    fontSize: 15, 
    fontFamily: 'Montserrat-Medium', 
    marginHorizontal: 20 
  },
  txtede: { 
    fontSize: 16, 
    fontFamily: 'Montserrat-Medium', 
    paddingHorizontal: 10, 
    flexWrap: 'wrap', 
    maxWidth: '79%' 
  },
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
  selectedTextStyle: {
    fontSize: 14,
    color: '#16232C',
  },
  plch: { 
    fontSize: 14, 
    color: 'rgba(22, 35, 44, 0.4)', 
    fontFamily: 'Montserrat-Light' 
  },
  rowV: { 
    alignItems: 'center', 
    flexDirection: 'row', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: 'rgba(22, 35, 44, 0.6)', 
    height: 42, 
    marginHorizontal: 15, 
    margin: 10 
  },
  input: { 
    fontSize: 14, 
    padding: 10, 
    fontFamily: 'Montserrat-Light' 
  },
  rowVi: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 5, 
    marginHorizontal: 15, 
    backgroundColor: 'rgba(22, 35, 44, 0.04)', 
    borderRadius: 15 ,marginBottom:10
  },
  diVi: { 
    flex: 0.2, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#E5B635', 
    margin: 10, 
    padding: 12, 
    borderRadius: 10, 
    alignSelf: 'center' 
  }
});

