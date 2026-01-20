// import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import CustomButton from '../components/CustomButton'
// import CustomInput from '../components/CustomInput'
// import { SquarePen, Trash2 } from 'lucide-react-native'
// import AddMoreBtn from '../components/AddMoreBtn'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Dropdown } from 'react-native-element-dropdown'

// const EditLicense = () => {

//   const [licenses, setLicenses] = useState([])
//   const [deletedLicenses, setDeletedLicenses] = useState([])
//   const [editingId, setEditingId] = useState(null)

//   const [cities, setCities] = useState([])
//   const [selectedCity, setSelectedCity] = useState(null)
//   const [districtBar, setDistrictBar] = useState('')
//   const [cityBar, setCityBar] = useState('')

//   /* ------------------ LOAD CITIES (FROM DEGREE API) ------------------ */
//   useEffect(() => {
//     const loadCities = async () => {
//       const res = await fetch(
//         'https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData'
//       )
//       const json = await res.json()
// console.log("Get Degree Data",json)
//       const mappedCities = (json.cities || []).map(c => ({
//         label: c.cityName,
//         value: c.id,
//       }))

//       setCities(mappedCities)
//     }

//     loadCities()
//   }, [])

//   /* ------------------ LOAD EXISTING LICENSES ------------------ */
//   useEffect(() => {
//     const loadLicenses = async () => {
//       const lawyerId = await AsyncStorage.getItem('lawyerId')

//       const res = await fetch(
//         `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
//       )
//       const json = await res.json()
// console.log("Get Lawyer Profile",json)
//       const formatted = (json.licenses || []).map(l => ({
//         lawyerLicenseId: l.lawyerLicenseId,
//         licenseCityId: l.licenseCityId,
//         districtBar: l.districtBar,
//         cityBar: l.cityBar,
//         isNew: false,
//       }))

//       setLicenses(formatted)
//     }

//     loadLicenses()
//   }, [])
// const deleteLicenseFromBackend = async (item) => {
//   const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

//   const payload = {
//     totalYearOfExperience: 0,
//     lawyerId,

//     // REQUIRED empty arrays
//     addCasecategories: [],
//     editCasecategories: [],
//     deleteCasecategories: [],

//     addLawyerLicense: [],
//     editLawyerLicense: [],

//     deleteLawyerLicense: [
//       {
//         lawyerLicenseId: item.lawyerLicenseId,
//         licenseCityId: item.licenseCityId,
//         districtBar: item.districtBar,
//         cityBar: item.cityBar,
//       },
//     ],
//   };

//   const res = await fetch(
//     'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense',
//     {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     }
//   );

//   const json = await res.json();

//   if (res.ok && json?.data?.isSuccess) {
//     // frontend se bhi remove
//     setLicenses(prev => prev.filter(l => l.lawyerLicenseId !== item.lawyerLicenseId));
//     Alert.alert('Deleted', 'License deleted successfully');
//   } else {
//     Alert.alert('Error', 'Delete failed');
//   }
// };

//   /* ------------------ ADD / UPDATE ------------------ */
//   const handleAddOrUpdate = () => {
//     if (!selectedCity || !districtBar || !cityBar) {
//       Alert.alert('Missing fields')
//       return
//     }

//     if (editingId) {
//       setLicenses(prev =>
//         prev.map(l =>
//           l.lawyerLicenseId === editingId
//             ? { ...l, licenseCityId: selectedCity, districtBar, cityBar }
//             : l
//         )
//       )
//     } else {
//       setLicenses(prev => [
//         ...prev,
//         {
//           lawyerLicenseId: 0,
//           licenseCityId: selectedCity,
//           districtBar,
//           cityBar,
//           isNew: true,
//         },
//       ])
//     }

//     setEditingId(null)
//     setSelectedCity(null)
//     setDistrictBar('')
//     setCityBar('')
//   }

//   /* ------------------ EDIT ------------------ */
//   const handleEdit = (item) => {
//     setEditingId(item.lawyerLicenseId)
//     setSelectedCity(item.licenseCityId)
//     setDistrictBar(item.districtBar)
//     setCityBar(item.cityBar)
//   }

//   /* ------------------ DELETE ------------------ */
//   const handleDelete = (item) => {
//     if (!item.isNew) {
//       setDeletedLicenses(prev => [...prev, item])
//     }

//     setLicenses(prev => prev.filter(l => l !== item))
//   }

//   /* ------------------ SUBMIT ------------------ */
//   const handleSubmit = async () => {
//     const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

//    const payload = {
//   totalYearOfExperience: 0,
//   lawyerId,

//   // 🔴 REQUIRED EVEN IF EMPTY
//   addCasecategories: [],
//   editCasecategories: [],
//   deleteCasecategories: [],

//   addLawyerLicense: licenses
//     .filter(l => l.isNew)
//     .map(l => ({
//       lawyerLicenseId: 0,
//       licenseCityId: l.licenseCityId,
//       districtBar: l.districtBar,
//       cityBar: l.cityBar,
//     })),

//   editLawyerLicense: licenses
//     .filter(l => !l.isNew)
//     .map(l => ({
//       lawyerLicenseId: l.lawyerLicenseId,
//       licenseCityId: l.licenseCityId,
//       districtBar: l.districtBar,
//       cityBar: l.cityBar,
//     })),

//   deleteLawyerLicense: deletedLicenses.map(l => ({
//     lawyerLicenseId: l.lawyerLicenseId,
//     licenseCityId: l.licenseCityId,
//     districtBar: l.districtBar,
//     cityBar: l.cityBar,
//   })),
// };


//     const res = await fetch(
//       'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense',
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       }
//     )

//     const json = await res.json()
// console.log("Edit Lawyer License",json)
//     if (res.ok && json?.data?.isSuccess) {
//       Alert.alert('Success', 'License updated')
//     } else {
//       Alert.alert('Error', 'Update failed')
//     }
//   }

//   return (
//     <View style={styles.container}>
//         <ScrollView>
//    <Text style={styles.txt}>Edit your License Details Here</Text>
//    {licenses.map((item, index) => (
//    <View key={index} style={styles.rowVi}>
//     <View style={{flex:0.8}}>
//        <Text style={styles.input}>{cities.find(c => c.value === item.licenseCityId)?.label}</Text>
//         <Text style={styles.txtede}>{item.districtBar}</Text>
//          <Text style={styles.input}>{item.cityBar}</Text>
//     </View>
//     <View style={styles.diVi}>
//       <TouchableOpacity onPress={() => handleEdit(item)}>
//      <SquarePen size={24} color="#FFFFFF" />
//      </TouchableOpacity>
//       <TouchableOpacity  onPress={() => deleteLicenseFromBackend(item)}>
//                 <Trash2 color="red" />
//               </TouchableOpacity>
//     </View> 
//    </View>
//     ))}
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
//             <AddMoreBtn title={editingId ? 'Update' : 'Add'} onPress={handleAddOrUpdate} />
//      <CustomButton title="Save Changes" onPress={handleSubmit} />
//      </ScrollView>
//     </View>
//   )
// }

// export default EditLicense

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

const EditLicense = () => {
  const [licenses, setLicenses] = useState([])
  const [deletedLicenses, setDeletedLicenses] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [districtBar, setDistrictBar] = useState('')
  const [cityBar, setCityBar] = useState('')
  const [loading, setLoading] = useState(true)

  /* ------------------ LOAD ALL DATA ------------------ */
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const lawyerId = await AsyncStorage.getItem('lawyerId')
      
      if (!lawyerId) {
        Alert.alert('Error', 'Lawyer ID missing')
        setLoading(false)
        return
      }

      // ✅ Load cities
      const degreeRes = await fetch(
        'https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData'
      )
      const degreeJson = await degreeRes.json()
      console.log("Get Degree Data", JSON.stringify(degreeJson, null, 2))

      if (degreeJson?.cities?.length) {
        const mappedCities = degreeJson.cities.map(c => ({
          label: c.cityName,
          value: c.id,
        }))
        setCities(mappedCities)
      }

      // ✅ Load existing licenses
      const profileRes = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      )
      const profileJson = await profileRes.json()
      console.log("Get Lawyer Profile - Full Response:", JSON.stringify(profileJson, null, 2))

      // ⚠️ Check multiple possible field names
      const licensesData = profileJson.licenses || profileJson.lawyerLicenses || profileJson.license || []
      
      console.log("Licenses found:", licensesData)

      if (Array.isArray(licensesData) && licensesData.length > 0) {
        const formatted = licensesData.map(l => ({
          lawyerLicenseId: l.lawyerLicenseId || l.id || 0,
          licenseCityId: l.licenseCityId || l.cityId || 0,
          districtBar: l.districtBar || '',
          cityBar: l.cityBar || '',
          isNew: false,
        }))

        setLicenses(formatted)
      } else {
        console.log("No licenses found in response")
        setLicenses([])
      }

    } catch (error) {
      console.log('Load error:', error)
      Alert.alert('Error', 'Unable to load data')
    } finally {
      setLoading(false)
    }
  }

  /* ------------------ DELETE FROM BACKEND ------------------ */
  const deleteLicenseFromBackend = async (item) => {
    try {
      const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

      const payload = {
        totalYearOfExperience: 0,
        lawyerId,

        // REQUIRED empty arrays
        addCasecategories: [],
        editCasecategories: [],
        deleteCasecategories: [],

        addLawyerLicense: [],
        editLawyerLicense: [],

        deleteLawyerLicense: [
          {
            lawyerLicenseId: item.lawyerLicenseId,
            licenseCityId: item.licenseCityId,
            districtBar: item.districtBar,
            cityBar: item.cityBar,
          },
        ],
      }

      console.log('Delete payload:', JSON.stringify(payload, null, 2))

      const res = await fetch(
        'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const json = await res.json()
      console.log('Delete response:', json)

      if (res.ok && json?.data?.isSuccess) {
        setLicenses(prev => prev.filter(l => l.lawyerLicenseId !== item.lawyerLicenseId))
        Alert.alert('Deleted', 'License deleted successfully')
      } else {
        Alert.alert('Error', json?.message || 'Delete failed')
      }
    } catch (error) {
      console.log('Delete error:', error)
      Alert.alert('Error', 'Unable to delete')
    }
  }

  /* ------------------ ADD / UPDATE ------------------ */
  const handleAddOrUpdate = () => {
    if (!selectedCity || !districtBar || !cityBar) {
      Alert.alert('Missing fields', 'Please fill all fields')
      return
    }

    if (editingId) {
      // Update existing
      setLicenses(prev =>
        prev.map(l =>
          l.lawyerLicenseId === editingId
            ? { ...l, licenseCityId: selectedCity, districtBar, cityBar }
            : l
        )
      )
    } else {
      // Add new
      setLicenses(prev => [
        ...prev,
        {
          lawyerLicenseId: 0,
          licenseCityId: selectedCity,
          districtBar,
          cityBar,
          isNew: true,
        },
      ])
    }

    setEditingId(null)
    setSelectedCity(null)
    setDistrictBar('')
    setCityBar('')
  }

  /* ------------------ EDIT ------------------ */
  const handleEdit = (item) => {
    setEditingId(item.lawyerLicenseId)
    setSelectedCity(item.licenseCityId)
    setDistrictBar(item.districtBar)
    setCityBar(item.cityBar)
  }

  /* ------------------ DELETE (LOCAL) ------------------ */
  const handleDelete = (item) => {
    if (!item.isNew) {
      setDeletedLicenses(prev => [...prev, item])
    }

    setLicenses(prev => prev.filter(l => l !== item))
  }

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async () => {
    if (licenses.length === 0 && deletedLicenses.length === 0) {
      Alert.alert('No changes', 'Please add or modify licenses')
      return
    }

    try {
      const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

      const payload = {
        totalYearOfExperience: 0,
        lawyerId,

        // 🔴 REQUIRED EVEN IF EMPTY
        addCasecategories: [],
        editCasecategories: [],
        deleteCasecategories: [],

        addLawyerLicense: licenses
          .filter(l => l.isNew)
          .map(l => ({
            lawyerLicenseId: 0,
            licenseCityId: l.licenseCityId,
            districtBar: l.districtBar,
            cityBar: l.cityBar,
          })),

        editLawyerLicense: licenses
          .filter(l => !l.isNew)
          .map(l => ({
            lawyerLicenseId: l.lawyerLicenseId,
            licenseCityId: l.licenseCityId,
            districtBar: l.districtBar,
            cityBar: l.cityBar,
          })),

        deleteLawyerLicense: deletedLicenses.map(l => ({
          lawyerLicenseId: l.lawyerLicenseId,
          licenseCityId: l.licenseCityId,
          districtBar: l.districtBar,
          cityBar: l.cityBar,
        })),
      }

      console.log('Submit payload:', JSON.stringify(payload, null, 2))

      const res = await fetch(
        'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const json = await res.json()
      console.log("Edit Lawyer License Response:", json)

      if (res.ok && json?.data?.isSuccess) {
        Alert.alert('Success', 'License updated successfully')
        setDeletedLicenses([]) // Clear deleted list
        // Reload to get fresh data
        loadData()
      } else {
        Alert.alert('Error', json?.message || 'Update failed')
      }
    } catch (error) {
      console.log('Submit error:', error)
      Alert.alert('Error', 'Unable to submit')
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#E5B635" />
        <Text style={{ marginTop: 10, fontFamily: 'Montserrat-Medium' }}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.txt}>Edit your License Details Here</Text>
        
        {/* Show message if no licenses */}
        {licenses.length === 0 && (
          <Text style={[styles.txte, { textAlign: 'center', marginVertical: 20, color: '#666' }]}>
            No licenses found. Add your first license below.
          </Text>
        )}

        {/* Display existing licenses */}
        {licenses.map((item, index) => (
          <View key={index} style={styles.rowVi}>
            <View style={{ flex: 0.8 }}>
              <Text style={styles.input}>
                {cities.find(c => c.value === item.licenseCityId)?.label || 'Unknown City'}
              </Text>
              <Text style={styles.txtede}>District: {item.districtBar}</Text>
              <Text style={styles.txtede}>City Bar: {item.cityBar}</Text>
            </View>
            <View style={styles.diVi}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <SquarePen size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteLicenseFromBackend(item)}>
                <Trash2 color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add/Edit form */}
        <Text style={styles.txte}>License City</Text>
        <Dropdown
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={{ fontSize: 14 }}
          data={cities}
          labelField="label"
          valueField="value"
          value={selectedCity}
          onChange={(item) => setSelectedCity(item.value)}
          placeholder="-- Select City --"
          placeholderStyle={styles.plch}
        />
        
        <Text style={styles.txte}>District Bar</Text>
        <CustomInput 
          plc='District Bar' 
          keyboardType='default' 
          value={districtBar} 
          onChangeText={setDistrictBar} 
        />
        
        <Text style={styles.txte}>City Bar</Text>
        <CustomInput 
          plc='City Bar' 
          keyboardType='default' 
          value={cityBar} 
          onChangeText={setCityBar} 
        />
        
        <AddMoreBtn 
          title={editingId ? 'Update' : 'Add'} 
          onPress={handleAddOrUpdate} 
        />
        
        <CustomButton 
          title="Save Changes" 
          onPress={handleSubmit} 
        />
      </ScrollView>
    </View>
  )
}

export default EditLicense

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
    marginHorizontal: 20,
    marginTop: 10
  },
  txtede: { 
    fontSize: 14, 
    fontFamily: 'Montserrat-Medium', 
    paddingHorizontal: 10, 
    flexWrap: 'wrap', 
    maxWidth: '79%',
    marginTop: 3
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
    fontFamily: 'Montserrat-Medium',
    fontWeight: '600'
  },
  rowVi: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 5, 
    marginHorizontal: 15, 
    backgroundColor: 'rgba(22, 35, 44, 0.04)', 
    borderRadius: 15,
    paddingVertical: 10
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