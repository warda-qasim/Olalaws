import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,Alert, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import { Dropdown } from 'react-native-element-dropdown'
import { Calendar, SquarePen, Trash2 } from 'lucide-react-native'
import AddMoreBtn from '../components/AddMoreBtn'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'
const EditEducation = () => {
const [degreeType, setDegreeType] = useState(null);
  const [degree, setDegree] = useState(null);
  const [dtData, setDtData] = useState([]);
  const [degreeData, setDegreeData] = useState([]);
  const [dateOfCompletion, setDateOfCompletion] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
const [educationListBackup, setEducationListBackup] = useState([]);

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
console.log("DegreeData Fetch",json)
      setDtData(
        json.degreedata.degreeType.map((d) => ({
          label: d.typeName,
          value: d.degreeTypeId,
        }))
      );

      setDegreeData(
        json.degreedata.degree.map((d) => ({
          label: d.degreeName,
          value: d.degreeId,
        }))
      );
    };

    fetchDegreeData();
  }, []);

  /* ------------------ FETCH EXISTING EDUCATION ------------------ */
  useEffect(() => {
    const fetchProfile = async () => {
      const lawyerId = await AsyncStorage.getItem('lawyerId');
      const res = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      );
      const json = await res.json();
console.log("GetLawyerProfile Data",json)
      const list = json.qualifications.map((q) => ({
        lawyerQualificationId: q.lawyerQualificationId,
        degreeTypeId: q.degreeTypeId,
        degreeId: q.degreeId,
        completionYear: q.completionYear,
        isNew: false,
      }));

      setEducationList(list);
      setEducationListBackup(list); // 🔥 VERY IMPORTANT
    };

    fetchProfile();
  }, []);

  /* ------------------ ADD / EDIT ------------------ */
  const handleAddOrUpdate = () => {
    if (!degreeType || !degree || !dateOfCompletion) {
      Alert.alert('Missing', 'Fill all fields');
      return;
    }

    if (editingId) {
      setEducationList((prev) =>
        prev.map((i) =>
          i.lawyerQualificationId === editingId
            ? {
                ...i,
                degreeTypeId: degreeType,
                degreeId: degree,
                completionYear: dateOfCompletion,
              }
            : i
        )
      );
    } else {
      setEducationList((prev) => [
        ...prev,
        {
          lawyerQualificationId: 0,
          degreeTypeId: degreeType,
          degreeId: degree,
          completionYear: dateOfCompletion,
          isNew: true,
        },
      ]);
    }

    setDegreeType(null);
    setDegree(null);
    setDateOfCompletion('');
    setEditingId(null);
  };

  /* ------------------ EDIT CLICK ------------------ */
  const handleEdit = (item) => {
    setDegreeType(item.degreeTypeId);
    setDegree(item.degreeId);
    setDateOfCompletion(item.completionYear);
    setEditingId(item.lawyerQualificationId);
  };

const handleDelete = (item) => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this education?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

            const payload = {
              addLawyerExperience: [],
              editLawyerExperience: [],
              deleteLawyerExperience: [
                {
                  lawyerQualificationId: item.lawyerQualificationId,
                  lawyerId,
                  degreeTypeId: item.degreeTypeId,
                  degreeId: item.degreeId,
                  completionYear: item.completionYear,
                },
              ],
            };

            const res = await fetch(
              'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerQualification',
              {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              }
            );

            const json = await res.json();

            if (res.ok && json?.data?.isSuccess) {
              Alert.alert('Deleted', 'Education deleted successfully');

              // 🔥 UI se bhi remove
              setEducationList(prev =>
                prev.filter(
                  i => i.lawyerQualificationId !== item.lawyerQualificationId
                )
              );
            } else {
              Alert.alert('Error', 'Delete failed');
            }
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]
  );
};


  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async () => {
    const lawyerId = Number(await AsyncStorage.getItem('lawyerId'));

    const payload = {
      addLawyerExperience: educationList
        .filter((i) => i.isNew)
        .map((i) => ({
          lawyerQualificationId: 0,
          lawyerId,
          degreeTypeId: i.degreeTypeId,
          degreeId: i.degreeId,
          completionYear: i.completionYear,
        })),

      editLawyerExperience: educationList
        .filter((i) => !i.isNew)
        .map((i) => ({
          lawyerQualificationId: i.lawyerQualificationId,
          lawyerId,
          degreeTypeId: i.degreeTypeId,
          degreeId: i.degreeId,
          completionYear: i.completionYear,
        })),

     deleteLawyerExperience: educationListBackup
  .filter(item => deletedIds.includes(item.lawyerQualificationId))
  .map(item => ({
    lawyerQualificationId: item.lawyerQualificationId,
    lawyerId,
    degreeTypeId: item.degreeTypeId,
    degreeId: item.degreeId,
    completionYear: item.completionYear
  })),

    };

    const res = await fetch(
      'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditLawyerQualification',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();
    console.log("EditEducation Data",json)
    if (res.ok && json?.data?.isSuccess) {
      Alert.alert('Success', 'Education updated');
    } else {
      Alert.alert('Error', 'Update failed');
    }
  };

  


  return (
    <View style={styles.container}>
        <ScrollView>
   <Text style={styles.txt}>Add your Educational Details Here</Text>
   {educationList.map((item, index) => (
   <View key={index} style={styles.rowVi}>
    <View style={{flex:0.8}}>
       <Text style={styles.input}>{dtData.find((d) => d.value === item.degreeTypeId)?.label}</Text>
        <Text style={styles.txtede}>{degreeData.find((d) => d.value === item.degreeId)?.label}</Text>
         <Text style={styles.input}>{item.completionYear}</Text>
    </View>
    <View style={styles.diVi}>
      <TouchableOpacity onPress={() => handleEdit(item)}>
     <SquarePen size={24} color="#FFFFFF" />
     </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item)}>
                <Trash2 color="red" />
              </TouchableOpacity>
    </View>
   
   </View>
    ))}
     <Text style={styles.txte}>Degree Type</Text>
       <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={{ fontSize: 14 }}
              data={dtData}
              labelField="label"
              valueField="value"
              value={degreeType}
              onChange={(item) => setDegreeType(item.value)}
              placeholder="-- Select Degree Type --"
              placeholderStyle={styles.plch}
            />
             <Text style={styles.txte}>Degree</Text>
       <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={{ fontSize: 14 }}
              data={degreeData}
              labelField="label"
              valueField="value"
              value={degree}
              onChange={(item) => setDegree(item.value)}
              placeholder="-- Select Degree --"
              placeholderStyle={styles.plch}
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
           
            <AddMoreBtn title={editingId ? 'Update' : 'Add'} onPress={handleAddOrUpdate} />
     <CustomButton title="Save Changes" onPress={handleSubmit} />
     </ScrollView>
    </View>
  )
}

export default EditEducation

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

