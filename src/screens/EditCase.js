import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import { SquarePen, Trash2 } from 'lucide-react-native'
import AddMoreBtn from '../components/AddMoreBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Dropdown } from 'react-native-element-dropdown'

const EditCase = () => {

  const [cases, setCases] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [caseCategoryId, setCaseCategoryId] = useState(null)
  const [experienceYears, setExperienceYears] = useState(null)

  const [caseCategories, setCaseCategories] = useState([])

  /* ------------------ LOAD CITIES (FROM DEGREE API) ------------------ */
  useEffect(() => {
    const loadCases = async () => {
      const res = await fetch(
        'https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetDegreeData'
      )
      const json = await res.json()
console.log("Get Degree Data",json)
      const mapped = (json?.degreedata?.caseCategory || []).map(c => ({
          label: c.caseCategoryName,
          value: c.caseCatogoryId,
        }))
        setCaseCategories(mapped)
    }

    loadCases()
  }, [])

  /* ------------------ LOAD EXISTING LICENSES ------------------ */
  useEffect(() => {
    const loadProfile = async () => {
      const lawyerId = await AsyncStorage.getItem('lawyerId')

      const res = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      )
      const json = await res.json()
console.log("Get Lawyer Profile",json)
       const mapped = (json.caseCategories || []).map(c => ({
        lawyerExperienceId: c.lawyerExperienceId,
        caseCatogoryId: c.caseCatogoryId,
        experienceYears: c.experienceYears,
        isNew: false,
      }))

      setCases(mapped)
    }

    loadProfile()
  }, [])
const deleteLicenseFromBackend = async (item) => {
  const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

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
  };

  const res = await fetch(
    'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  const json = await res.json();

  if (res.ok && json?.data?.isSuccess) {
    // frontend se bhi remove
    setLicenses(prev => prev.filter(l => l.lawyerLicenseId !== item.lawyerLicenseId));
    Alert.alert('Deleted', 'License deleted successfully');
  } else {
    Alert.alert('Error', 'Delete failed');
  }
};

  /* ------------------ ADD / UPDATE ------------------ */
  const handleAddOrUpdate = () => {
     if (!caseCategoryId || !experienceYears) {
      Alert.alert('Fill all fields')
      return
    }

   
    if (editingId) {
      setCases(prev =>
        prev.map(c =>
          c.lawyerExperienceId === editingId
            ? { ...c, caseCatogoryId: caseCategoryId, experienceYears }
            : c
        )
      )
    } else {
      setCases(prev => [
        ...prev,
        {
          lawyerExperienceId: 0,
          caseCatogoryId: caseCategoryId,
          experienceYears,
          isNew: true,
        },
      ])
    }

    setEditingId(null)
    setCaseCategoryId(null)
    setExperienceYears(null)
  }

  /* ------------------ EDIT ------------------ */
  

  const handleEdit = (item) => {
    setEditingId(item.lawyerExperienceId)
    setCaseCategoryId(item.caseCatogoryId)
    setExperienceYears(item.experienceYears)
  }

  /* ---------------- DELETE (BACKEND IMMEDIATE) ---------------- */
  const handleDelete = async (item) => {
    const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

    const payload = {
      totalYearOfExperience: 0,
      lawyerId,

      addCasecategories: [],
      editCasecategories: [],
      deleteCasecategories: [
        {
          caseCatogoryId: item.caseCatogoryId,
          lawyerExperienceId: item.lawyerExperienceId,
        },
      ],

      addLawyerLicense: [],
      editLawyerLicense: [],
      deleteLawyerLicense: [],
    }

    const res = await fetch('https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerLicense', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (res.ok && json?.data?.isSuccess) {
      setCases(prev =>
        prev.filter(c => c.lawyerExperienceId !== item.lawyerExperienceId)
      )
    } else {
      Alert.alert('Delete failed')
    }
  }


  /* ------------------ SUBMIT ------------------ */
 const handleSubmit = async () => {
    const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

    const payload = {
      totalYearOfExperience: experienceYears || 0,
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

      addLawyerLicense: [],
      editLawyerLicense: [],
      deleteLawyerLicense: [],
    }
     const res = await fetch(`${API}/LawyerPostApi/EditLawyerLicense`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const json = await res.json()

    if (res.ok && json?.data?.isSuccess) {
      Alert.alert('Success', 'Experience updated')
    } else {
      Alert.alert('Update failed')
    }
  }


  return (
    <View style={styles.container}>
        <ScrollView>
   <Text style={styles.txt}>Edit your Case Details Here</Text>
   {licenses.map((item, index) => (
   <View key={index} style={styles.rowVi}>
    <View style={{flex:0.8}}>
       <Text style={styles.input}>{caseCategories.find(c => c.value === item.caseCatogoryId)?.label}</Text>
        <Text style={styles.txtede}>{item.experienceYears} Years</Text>
    </View>
    <View style={styles.diVi}>
      <TouchableOpacity onPress={() => handleEdit(item)}>
     <SquarePen size={24} color="#FFFFFF" />
     </TouchableOpacity>
      <TouchableOpacity  onPress={() => handleDelete(item)}>
                <Trash2 color="red" />
              </TouchableOpacity>
    </View> 
   </View>
    ))}
        <Text style={styles.txte}>License City</Text>
        <Dropdown
          style={styles.dropdown}
          data={caseCategories}
          labelField="label"
          valueField="value"
          value={caseCategoryId}
          onChange={(item) => setCaseCategoryId(item.value)}
          placeholder="-- Select Case Category --"
          placeholderStyle={styles.plch}
        />
        <Dropdown
        data={[
          { label: '1 Year', value: 1 },
          { label: '2 Years', value: 2 },
          { label: '3 Years', value: 3 },
          { label: '5 Years', value: 5 },
        ]}
        labelField="label"
        valueField="value"
        value={experienceYears}
        onChange={item => setExperienceYears(item.value)}
        placeholder="Experience"
      />
            <AddMoreBtn title={editingId ? 'Update' : 'Add'} onPress={handleAddOrUpdate} />
     <CustomButton title="Save Changes" onPress={handleSubmit} />
     </ScrollView>
    </View>
  )
}

export default EditCase

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
  diVi: {flex:0.2,flexDirection: 'row',justifyContent: 'space-between',backgroundColor: '#E5B635',margin:10,padding:12,borderRadius:10,alignSelf: 'center'}
})

