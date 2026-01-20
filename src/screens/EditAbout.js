import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import CustomInput from '../components/CustomInput'
import { SquarePen, Trash2 } from 'lucide-react-native'
import AddMoreBtn from '../components/AddMoreBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditAbout = () => {

  const [bio, setBio] = useState('')
  const [clientName, setClientName] = useState('')
  const [clients, setClients] = useState([])
  const [deletedClients, setDeletedClients] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    const loadProfile = async () => {
      const lawyerId = await AsyncStorage.getItem('lawyerId')

      const res = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      )
      const json = await res.json()

      setBio(json?.lawyer?.briefBio ?? '')

      const formattedClients = (json.abouts || []).map(c => ({
        lawyerClientId: c.lawyerClientId,
        clientName: c.clientName,
        isEdited: false,
      }))

      setClients(formattedClients)
    }

    loadProfile()
  }, [])

  /* ---------------- ADD CLIENT ---------------- */
  const handleAddMore = () => {
    if (!clientName.trim()) {
      Alert.alert("Missing", "Client name required")
      return
    }

    setClients(prev => [
      ...prev,
      {
        lawyerClientId: null,
        clientName,
        isEdited: false,
      }
    ])

    setClientName('')
  }

  /* ---------------- EDIT CLIENT ---------------- */
  const handleEdit = (index) => {
    setClientName(clients[index].clientName)
    setEditingIndex(index)
  }

  const handleUpdate = () => {
    if (editingIndex === null) return

    setClients(prev =>
      prev.map((c, i) =>
        i === editingIndex
          ? { ...c, clientName, isEdited: true }
          : c
      )
    )

    setEditingIndex(null)
    setClientName('')
  }

 const handleDelete = async (index) => {
  const client = clients[index]

  if (!client.lawyerClientId) {
    setClients(prev => prev.filter((_, i) => i !== index))
    return
  }

  const lawyerId = Number(await AsyncStorage.getItem("lawyerId"))

  const payload = {
    lawyerId,
    briefBio: bio,
    newClients: [],
    editClients: [],
    deleteClients: [{
      lawyerClientId: client.lawyerClientId,
      clientName: client.clientName,
      lawyerId
    }]
  }

  await fetch("/EditAbout", {
    method: "PUT",
    body: JSON.stringify(payload)
  })

  setClients(prev => prev.filter((_, i) => i !== index))
}


  /* ---------------- SAVE TO BACKEND ---------------- */
  const handleSubmit = async () => {
    const lawyerId = Number(await AsyncStorage.getItem('lawyerId'))

    const payload = {
      lawyerId,
      briefBio: bio,

      newClients: clients
        .filter(c => !c.lawyerClientId)
        .map(c => ({
          lawyerClientId: 0,
          clientName: c.clientName,
          lawyerId
        })),

      editClients: clients
        .filter(c => c.lawyerClientId && c.isEdited)
        .map(c => ({
          lawyerClientId: c.lawyerClientId,
          clientName: c.clientName,
          lawyerId
        })),

      deleteClients: deletedClients.map(c => ({
        lawyerClientId: c.lawyerClientId,
        clientName: c.clientName,
        lawyerId
      }))
    }

    const res = await fetch(
      'https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditAbout',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )

    const json = await res.json()

    if (json?.data?.isSuccess) {
      Alert.alert('Success', 'About updated successfully')
      setDeletedClients([])
      setClients(prev => prev.map(c => ({ ...c, isEdited: false })))
    } else {
      Alert.alert('Error', 'Update failed')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>

        <Text style={styles.txt}>Edit Biography</Text>
        <CustomInput
          plc="Write biography here..."
          value={bio}
          onChangeText={setBio}
        />

        <Text style={[styles.txt, { fontSize: 16 }]}>Renowned Clients</Text>

        {clients.map((item, index) => (
          <View key={index} style={styles.rowVi}>
            <Text style={styles.txtede}>{item.clientName}</Text>

            <View style={styles.diVi}>
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <SquarePen size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Trash2 size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <CustomInput
          plc="Client name"
          value={clientName}
          onChangeText={setClientName}
        />

        <AddMoreBtn
          title={editingIndex !== null ? 'Update Client' : 'Add More'}
          onPress={editingIndex !== null ? handleUpdate : handleAddMore}
        />

        <CustomButton title="Save Changes" onPress={handleSubmit} />

      </ScrollView>
    </View>
  )
}

export default EditAbout


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

