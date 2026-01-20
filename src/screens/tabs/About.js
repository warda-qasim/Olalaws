import { ScrollView, StyleSheet, Text, TextInput, View ,Alert,TouchableOpacity, FlatList, Modal} from 'react-native'
import React, { useState , useEffect} from 'react'
import CustomInput from '../../components/CustomInput'
import CustomButton from '../../components/CustomButton'
import { Dropdown } from 'react-native-element-dropdown'
import { Calendar, SquarePen, Trash2 } from 'lucide-react-native'
import AddMoreBtn from '../../components/AddMoreBtn'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const About = () => {
    const navigation = useNavigation();
    const [submitting, setSubmitting] = useState(false);
     const [bio, setBio] = useState("");
const [clients, setClients] = useState([]);
const [deletingId, setDeletingId] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
const [editingClient, setEditingClient] = useState(null); // null = add
const [modalClientName, setModalClientName] = useState("");
const [saving, setSaving] = useState(false);


const [loading, setLoading] = useState(true);      // API loader
const [listLoading, setListLoading] = useState(true); // FlatList loader

useEffect(() => {
  const loadAboutFromProfile = async () => {
    try {
      setLoading(true);

      const lawyerId = await AsyncStorage.getItem("lawyerId");

      const res = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
      );

      const json = await res.json();

      setBio(json?.lawyer?.briefBio ?? "");

      if (Array.isArray(json.abouts)) {
        setClients(
          json.abouts.map((item, index) => ({
                id: `server-${item.lawyerClientId}-${index}`, 
            lawyerClientId: item.lawyerClientId,
            clientName: item.clientName,
          }))
        );
      }
    } catch (e) {
      console.log("Failed to load about", e);
    } finally {
      setLoading(false); // ✅ API finished
    }
  };

  loadAboutFromProfile();
}, []);

const openAddModal = () => {
  setEditingClient(null);
  setModalClientName("");
  setModalVisible(true);
};

const handleEdit = (item) => {
  setEditingClient(item);
  setModalClientName(item.clientName);
  setModalVisible(true);
};

// const handleAddMore = () => {
//   if (!clientName.trim()) {
//     Alert.alert("Missing", "Client name required");
//     return;
//   }

//   setClients(prev => [
//     ...prev,
//     {
//       _key: `local-${Date.now()}`, // ✅ UNIQUE
//       lawyerClientId: null,
//       clientName,
//     },
//   ]);

//   setClientName("");
// };

const handleSubmitBio = async () => {
  if (submitting) return;
  
  if (!bio) {
    Alert.alert("Empty", "Biography is required.");
    return;
  }
setSubmitting(true);
  // if (clients.length === 0) {
  //   Alert.alert("Empty", "Add at least one renowned client.");
  //   return;
  // }

  try {
    const lawyerIdStr = await AsyncStorage.getItem("lawyerId");

    if (!lawyerIdStr) {
      Alert.alert("Error", "Lawyer ID not found. Please login again.");
      return;
    }

    const payload = {
      lawyerId: Number(lawyerIdStr),
      briefBio: bio,
      rClientsName: clients.map(c => ({
        name: c.clientName
      }))
      
    };

    console.log("FINAL PAYLOAD:", payload);

    const res = await fetch(
      "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/About",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const json = await res.json();
    console.log("API RESPONSE:", json);

    if (res.ok && json?.data?.isSuccess === true) {
      Alert.alert("Success", json.data.message);
       navigation.navigate("Dashboard");
    } else {
      Alert.alert("Error", json?.data?.message || "Submission failed");
    }
  } catch (error) {
    console.log("CATCH ERROR:", error);
    Alert.alert("Error", error.message);
  } finally {
    setSubmitting(false);
  }
};
  const handleDelete = async (item) => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this client?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // 🔄 loader on for this row
  setDeletingId(item.id);
            const lawyerId = Number(await AsyncStorage.getItem("lawyerId"));

            // 🟢 UI optimistic update (fast UX)
            setClients(prev =>
              prev.filter(c => c.id !== item.id)
            );
           // 🔄 loader on for this row
  setDeletingId(item.id);
            // 🔴 backend delete
            const payload = {
              lawyerId,
              briefBio: bio ?? "",
              newClients: [],
              editClients: [],
              deleteClients: [
                {
                  lawyerClientId: item.lawyerClientId,
                  clientName: item.clientName,
                  lawyerId
                }
              ]
            };

            const res = await fetch(
              "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditAbout",
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              }
            );

            const json = await res.json();

            if (!res.ok || !json?.data?.isSuccess) {
              Alert.alert("Error", "Delete failed on server");
              console.log("Delete error:", json);
            }
          } catch (e) {
            Alert.alert("Error", "Something went wrong");
            console.log(e);
          } finally {
    setDeletingId(null);
  }
        }
      }
    ]
  );
};
const handleSaveClient = async () => {
  if (!modalClientName.trim()) {
    Alert.alert("Missing", "Client name required");
    return;
  }

  try {
    setSaving(true);
    const lawyerId = Number(await AsyncStorage.getItem("lawyerId"));

    const payload = {
      lawyerId,
      briefBio: bio ?? "",
      newClients: [],
      editClients: [],
      deleteClients: [],
    };

    if (editingClient) {
      // ✏️ EDIT
      payload.editClients.push({
        lawyerClientId: editingClient.lawyerClientId,
        clientName: modalClientName,
        lawyerId,
      });
    } else {
      // ➕ ADD
      payload.newClients.push({
        lawyerClientId: 0,
        clientName: modalClientName,
        lawyerId,
      });
    }

    const res = await fetch(
      "https://loving-turing.91-239-146-172.plesk.page/api/LawyerPostApi/EditAbout",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();

    if (res.ok && json?.data?.isSuccess) {
      // ✅ UI update
      if (editingClient) {
        setClients(prev =>
          prev.map(c =>
            c.id === editingClient.id
              ? { ...c, clientName: modalClientName }
              : c
          )
        );
      } else {
        setClients(prev => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            lawyerClientId: null,
            clientName: modalClientName,
          },
        ]);
      }

      setModalVisible(false);
    } else {
      Alert.alert("Error", "Save failed");
    }
  } catch (e) {
    Alert.alert("Error", "Something went wrong");
  } finally {
    setSaving(false);
  }
};

const renderClientItem = ({ item }) => (
  <View style={styles.rowVi}>
    <View style={{flex:0.8, justifyContent: "center" }}>
      <Text style={styles.txtede}>{item.clientName}</Text>
    </View>
 <View style={styles.diVi}>
      <TouchableOpacity onPress={() => handleEdit(item)}>
     <SquarePen size={24} color="#FFFFFF" />
     </TouchableOpacity>

   
  {deletingId === item.id ? (
    <ActivityIndicator size="small" color="red" />
  ) : (
    <TouchableOpacity onPress={() => handleDelete(item)}>
      <Trash2 color="red" />
    </TouchableOpacity>
  )}

    </View>
   
  </View>
);
if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#E5B635" />
      <Text style={{ marginTop: 10 }}>Loading profile…</Text>
    </View>
  );
}

  return (
    <SafeAreaView style={styles.container}>
        {/* <ScrollView> */}
   <Text style={styles.txt}>Add Brief Biography </Text>
   
     <Text style={styles.txte}>Biography</Text>
    <CustomInput plc='write here...' keyboardType='default' value={bio} onChangeText={setBio} />

   <Text style={[styles.txt,{fontSize: 16}]}>Renowned Clients</Text>
     <Text style={styles.txte}>Specialization Field</Text>
     {/* {clients.map((item,index) => (
   <View key={index} style={styles.rowVi}>
    <View style={{justifyContent:'center'}}>
    
        <Text style={styles.txtede}>{item.clientName}</Text>
    
    </View>
    <View style={styles.diVi}>
     <TouchableOpacity
       onPress={() => navigation.navigate("EditAbout")}
    >
     <SquarePen size={24} color="#FFFFFF" />
     </TouchableOpacity>
    </View>
    
   </View>
    ))} */}
 <FlatList
  data={clients}
  keyExtractor={(item) => item.id}
  renderItem={renderClientItem}
  contentContainerStyle={{ paddingBottom: 40 }}
  showsVerticalScrollIndicator={false}
  initialNumToRender={15}
  maxToRenderPerBatch={20}
  windowSize={10}
  removeClippedSubviews
  onLoadStart={() => setListLoading(true)}
  onMomentumScrollEnd={() => setListLoading(false)}
  ListFooterComponent={
    listLoading ? (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="small" color="#E5B635" />
      </View>
    ) : null
  }
  ListEmptyComponent={
  <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
    No clients added yet
  </Text>
}
/>

    
   <AddMoreBtn title="Add Client" onPress={openAddModal} />

     <CustomButton
  title={submitting ? "Saving..." : "Finish"}
  onPress={handleSubmitBio}
  disabled={submitting}
/>

     {/* </ScrollView> */}
     <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>
        {editingClient ? "Edit Client" : "Add Client"}
      </Text>

      <CustomInput
        plc="Client Name"
        value={modalClientName}
        onChangeText={setModalClientName}
      />

      {saving ? (
        <ActivityIndicator size="small" color="#E5B635" />
      ) : (
        <View style={{ margin: 15,flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.outBtn}  onPress={() => setModalVisible(false)}>
           <Text style={styles.btntxt}>Cancel</Text>
       </TouchableOpacity>
        <TouchableOpacity style={[styles.outBtn,{backgroundColor: '#E5B635'}]}  onPress={handleSaveClient}>
           <Text style={[styles.btntxt,{color: 'white'}]}>Save</Text>
       </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
</Modal>
    </SafeAreaView>
  )
}

export default About;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFFFF'
    },
    btntxt: {
      fontSize: 15,
      fontFamily: 'Montserrat-Regular'
    },
    outBtn: {
      backgroundColor: 'white',
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderColor: '#E5B635'
    },
    modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
modalBox: {
  width: "85%",
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 20,
},
modalTitle: {
  fontSize: 18,
  fontFamily: "Montserrat-SemiBold",
  marginBottom: 10,
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
 txtede: {fontSize: 16,fontFamily: 'Montserrat-Medium',paddingHorizontal:10, },
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