import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import Header from '../components/Header'
import { CalendarCheck2, Eye, SquarePen, Scale, Star, User, UserRound, IdCard, Phone, PhoneCall, Mail, MapPin, GraduationCap, Newspaper, CircleStar } from 'lucide-react-native'
import AccordionItem from '../components/AccordionItem'
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from '../components/StarRating';
import AddMoreBtn from '../components/AddMoreBtn';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useNavigation } from '@react-navigation/native';


const UserProfile = () => {
  const navigation = useNavigation();
    const [activeTab, setActiveTab] = React.useState('About');
const [profile, setProfile] = useState(null);
const [imageData, setImageData] = useState(null);
  const [officeAddress, setOfficeAddress] = useState('');
    const [officeName, setOfficeName] = useState('');
    const [officeList, setOfficeList] = useState([]);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const lawyerId = await AsyncStorage.getItem("lawyerId");

  const res = await fetch(
    `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/GetLawyerProfile?lawyerId=${lawyerId}`
  );
      const json = await res.json();
      console.log(json)
      setProfile(json);
    } catch (e) {
      console.log('Profile error', e);
    }
  };

  fetchProfile();
}, []);
const handleAddMore = () => {
  if ( !officeName || !officeAddress) {
    Alert.alert("Missing Fields", "Please fill all fields.");
    return;
  }

  const newItem = {
   
    officeName,
    officeAddress,
  };

  setOfficeList([...officeList, newItem]);
  // Clear fields
  setOfficeAddress('');
  setOfficeName('');
};
const handleEdit = (index) => {
  const item = officeList[index];

  // Fill fields back for editing
  
  setOfficeName(item.officeName);
  setOfficeAddress(item.officeAddress);

  // Remove old from list
  const temp = [...officeList];
  temp.splice(index, 1);
  setOfficeList(temp);
};
const formatPhone = (num) => {
  if (!num) return '';
  return `+${num.slice(0,2)} ${num.slice(2,5)} ${num.slice(5,8)} ${num.slice(8)}`;
};

const formatCNIC = (cnic) => {
  if (!cnic || cnic.length !== 13) return '';
  return `${cnic.slice(0,5)}-${cnic.slice(5,12)}-${cnic.slice(12)}`;
};
const BASE_IMAGE_URL = 'https://loving-turing.91-239-146-172.plesk.page/images/';
const totalClients = profile?.abouts?.length || 0;

    return (
        <View style={styles.container}>
            <Header title='Manage Profile' />
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.main}>
                    <View style={styles.viewM}>
                        <Image source={{
    uri: profile?.lawyer.profilePic
      ? `${BASE_IMAGE_URL}${profile?.lawyer.profilePic}`
      : undefined,
  }} style={styles.img} />
                    </View>
                    <Text style={[styles.mytx, { fontFamily: 'Montserrat-Bold' }]}>{profile?.lawyer.firstName} {profile?.lawyer.lastName}</Text>
                    <View style={styles.rowView}>
                        {/* <Star size={15} color="#E5B635" /> */}
                         <Text>⭐</Text>
                        <Text style={[styles.mytx, { fontSize: 10, fontFamily: 'Montserrat-Regular', marginLeft: 5 }]}>{profile?.lawyer.rating} ({totalClients} + Clients)</Text>
                    </View>
                </View>
                <View style={styles.rowM}>
                    <View style={styles.Viw}>
                        <Eye size={25} color="#FFFFFF" />
                        <Text style={styles.txt}>Total Views</Text>
                        <Text style={styles.txte}>{profile?.lawyer.totalViews}</Text>
                    </View>
                    <View style={styles.Viw}>
                        <Scale size={25} color="#FFFFFF" />
                        <Text style={styles.txt}>Total Cases</Text>
                        <Text style={styles.txte}>{profile?.lawyer.totalCases}</Text>
                    </View>
                    <View style={styles.Viw}>
                        <CalendarCheck2 size={25} color="#FFFFFF" />
                        <Text style={styles.txt}>Total Bookings</Text>
                        <Text style={styles.txte}>{profile?.lawyer.totalBookings}</Text>
                    </View>
                </View>
                <View style={{ margin: 15 }}>
                    <Text style={[styles.mytx, { fontFamily: 'Montserrat-Bold' }]}>Biography</Text>
                    <View style={styles.card}>
                        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Regular' }]}>{profile?.lawyer?.briefBio}</Text>
                    </View>
                </View>
                <View style={styles.tabsContainer}>
  {['About', 'Office', 'Reviews'].map(tab => (
    <Text
      key={tab}
      onPress={() => setActiveTab(tab)}
      style={[
        styles.tab,
        activeTab === tab && styles.activeTab
      ]}
    >
      {tab}
    </Text>
  ))}
</View>
<View style={{ marginTop: 10 }}>
  {activeTab === 'About' && (
    <>
   <AccordionItem
  title="Personal Information"
  icon={<UserRound size={20} color="#000" />}
>
  <View style={{ backgroundColor: '#F7F7F7', padding: 12, borderRadius: 10 }}>
    <View style={[styles.rowView,{margin:0}]}>
      <View style={{flex:0.8,}}>
    
    <Text style={styles.txted}> {profile?.lawyer.firstName} {profile?.lawyer.lastName}</Text>
    <View style={[styles.rowView,{margin:0,alignItems:'center',}]}>
     <IdCard size={16} color="#E5B635" />
    <Text style={[styles.txtede,{ marginTop: 4 ,marginLeft:5}]}>{formatCNIC(profile?.lawyer.cnic)}</Text>
    </View>
     <View style={[styles.rowView,{margin:0,alignItems:'center',}]}>
     <PhoneCall size={16} color="#E5B635" />
    <Text style={[styles.txtede,{marginLeft:5}]}>{formatPhone(profile?.lawyer.contact)}</Text>
    </View>
     <View style={[styles.rowView,{margin:0,alignItems:'center',}]}>
     <Mail size={16} color="#E5B635" />
    <Text style={[styles.txtede,{marginLeft:5}]}>{profile?.lawyer.email || '—'}</Text>
    </View>
     <View style={[styles.rowView,{margin:0,alignItems:'center',}]}>
     <MapPin size={16} color="#E5B635" />
    <Text style={[styles.txtede,{marginLeft:5}]}>{profile?.lawyer.city || '—'}</Text>
    </View>
</View>
<View style={{flex:0.2,justifyContent: 'center',}}>
    <TouchableOpacity
      style={{
        alignSelf: 'baseline',
        backgroundColor: '#E5B635',
        padding: 10,
        borderRadius: 8,     
      }}
      onPress={()=>navigation.navigate('EditLawyerIntro')}
    >
      <SquarePen size={18} color="#fff" />
    </TouchableOpacity>
    </View>
    </View>
  </View>
</AccordionItem>
 <AccordionItem
  title="Education/Certificate"
  icon={<GraduationCap size={20} color="#000" />}
>
  <View style={{ backgroundColor: '#F7F7F7', padding: 12, borderRadius: 10 }}>
    <View style={[styles.rowView,{margin:0}]}>
      <View style={{flex:0.8,}}>
        {profile?.qualifications?.map((item) => (
          <>
    <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light' }]}>{item.degreeTypeName}</Text>
        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Medium',fontSize:16 }]}>{item.degreeName}</Text>
            <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light' }]}>{item.completionYear}</Text>
        </>
        ))}
</View>
<View style={{flex:0.2,justifyContent: 'center',}}>
    <TouchableOpacity
      style={{
        alignSelf: 'baseline',
        backgroundColor: '#E5B635',
        padding: 10,
        borderRadius: 8,     
      }}
      onPress={()=>navigation.navigate('EditEducation')}
    >
      <SquarePen size={18} color="#fff" />
    </TouchableOpacity>
    </View>
    </View>
  </View>
</AccordionItem>
<AccordionItem
  title="Licenses"
  icon={<Newspaper size={20} color="#000" />}
>
  <View style={{ backgroundColor: '#F7F7F7', padding: 12, borderRadius: 10 }}>
    <View style={[styles.rowView,{margin:0}]}>
      <View style={{flex:0.8,}}>
        {profile?.licenses?.map((item) => (
          <>
    <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light' }]}>{item.cityBar}</Text>
        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Medium',fontSize:16 }]}>{item.districtBar}</Text>
            <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light' }]}>{item.licenseCityName}</Text>
        </>
        ))}
</View>
<View style={{flex:0.2,justifyContent: 'center',}}>
    <TouchableOpacity
      style={{
        alignSelf: 'baseline',
        backgroundColor: '#E5B635',
        padding: 10,
        borderRadius: 8,     
      }}
      onPress={()=>navigation.navigate('EditLicense')}
    >
      <SquarePen size={18} color="#fff" />
    </TouchableOpacity>
    </View>
    </View>
  </View>
</AccordionItem>
<AccordionItem
  title="Professional Expertise"
  icon={<CircleStar size={20} color="#000" />}
>
  <View style={{ backgroundColor: '#F7F7F7', padding: 12, borderRadius: 10 }}>
    <View style={[styles.rowView,{margin:0}]}>
      <View style={{flex:0.8,}}>
        {profile?.experiences?.map((item) => (
          <>
        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Medium',fontSize:16 }]}>{item.caseCategoryName}</Text>
            <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light' }]}>{item.experienceYears} Year of Experience</Text>
        </>
        ))}
</View>
<View style={{flex:0.2,justifyContent: 'center',}}>
    <TouchableOpacity
      style={{
        alignSelf: 'baseline',
        backgroundColor: '#E5B635',
        padding: 10,
        borderRadius: 8,     
      }}
      onPress={()=>navigation.navigate('EditExperience')}
    >
      <SquarePen size={18} color="#fff" />
    </TouchableOpacity>
    </View>
    </View>
  </View>
</AccordionItem>
</>
  )}

  {activeTab === 'Office' && (
    <View style={styles.container}>
     
   {officeList.map((item, index) => (
   <View key={index} style={styles.rowVi}>
    <View>
       <Text style={[styles.txtes,{marginHorizontal:0}]}>{item.officeName}</Text>
        <Text style={styles.txteded}>{item.officeAddress}</Text>
    </View>
    <View style={styles.diVi}>
      <TouchableOpacity onPress={() => handleEdit(index)}>
     <SquarePen size={24} color="#FFFFFF" />
     </TouchableOpacity>
    </View>
   
   </View>
    ))}
   
             
             <Text style={styles.txtes}>Office Name</Text>
    <CustomInput plc='Office Name' editable={true} keyboardType='default' value={officeName} onChangeText={setOfficeName} />
    {/* {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>} */}
      <Text style={styles.txtes}>Office Address</Text>
    <CustomInput plc='Office Address' editable={true} keyboardType='default' value={officeAddress} onChangeText={setOfficeAddress} />
    {/* {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>} */}
            <AddMoreBtn title='Add More' onPress={handleAddMore} />
  
    
    </View>
  )}

  {activeTab === 'Reviews' && (
    <>
    <View>
      <View style={styles.cardt}>
         {profile?.reviews?.map((item) => (
          <>
          <View style={styles.revRow}>
            <View style={{flex:0.2,}}>
       <Image source={require('../assets/images/elips.png')} style={styles.imgsd} />
      </View>
       <View style={{flex:0.8}}>
        <View style={styles.starRow}>
          <Text style={[styles.mytx, { fontFamily: 'Montserrat-Medium',fontSize:16 }]}>{item?.clientName}</Text>
          <StarRating rating={item?.rating || 0} />
          </View>
            <Text style={[styles.mytx, { fontFamily: 'Montserrat-Regular' }]}>{item?.appointmentDate} </Text>
       </View>
       </View>
        <View style={[styles.starRow,styles.brd,{margin:15}]}>
          <View style={{flex:0.5}}>
 <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light' }]}>Appointment Type</Text>
        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Medium',fontSize:16 }]}>{item.appointmentType}</Text>
            </View>
             <View style={{borderLeftWidth:2,borderLeftColor: '#E5B635',flex:0.5,}}>
 <Text style={[styles.mytx, { fontFamily: 'Montserrat-Light',marginLeft:10 }]}>Status</Text>
        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Medium',fontSize:16,marginLeft:10 }]}>{item.status}</Text>
            </View>
      </View>
      <View style={styles.brd}>
        <Text style={[styles.mytx, { fontFamily: 'Montserrat-Regular' }]}>{item.reviewText}</Text>
      </View>
      </>
         ))}
      </View>
     
    </View>
    </>
  )}
</View>

            </ScrollView>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    main: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15
    },
    brd: {
       borderBottomWidth:1,
      borderBottomColor: 'rgba(22, 35, 44, 0.08)',
      margin:10,
      paddingBottom:10
    },
    img: {
        height: 100,
        width: 100,
        margin: 2,
        resizeMode: 'cover',
        borderRadius: 50
    },
     imgsd: {
        height: 44,
        width: 44,
        margin: 2
    },
    starRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
     
    },
    viewM: {
        borderRadius: 55,
        borderWidth: 2,
        borderColor: 'rgba(229, 182, 53, 1)',
        margin: 10
    },
    cardt: {
      backgroundColor: 'white',
      borderWidth:1,
      borderRadius: 12,
      borderColor: 'rgba(22, 35, 44, 0.08)',
      margin:20,
      padding:5
    },
    revRow: {
      flexDirection: 'row',
      margin:10,
      borderBottomWidth:1,
      paddingVertical:10,
      borderBottomColor: 'rgba(22, 35, 44, 0.08)'
    },
    txted: {fontSize: 16, color: '#16232C', fontFamily: 'Montserrat-Medium'},
     txtede: {fontSize: 14, color: '#16232C', fontFamily: 'Montserrat-Regular'},
    mytx: { color: '#16232C', fontSize: 14, },
    rowView: { flexDirection: 'row', margin: 5 },
    rowM: { flexDirection: 'row', marginHorizontal: 15 },
    Viw: { backgroundColor: '#E5B635', borderRadius: 8, margin: 5, padding: 14, justifyContent: 'space-between' },
    txt: { fontSize: 12, color: '#FFFFFF', fontFamily: 'Montserrat-Regular' },
    txte: { fontSize: 18, color: '#FFFFFF', fontFamily: 'Montserrat-Bold' },
    card: {borderColor: 'rgba(22, 35, 44, 0.04)',borderWidth:1,padding:10,marginVertical: 10,borderRadius:10},
    tabsContainer: {
  flexDirection: 'row',
  backgroundColor: '#E5B635',
  borderRadius: 8,
  marginHorizontal: 15,

},

tab: {
  flex: 1,
  textAlign: 'center',
  paddingVertical: 10,
  color: '#FFFFFF',
  fontFamily: 'Montserrat-Regular',
  margin:5
},

activeTab: {
  backgroundColor: '#EED07C',
  fontFamily: 'Montserrat-Medium',
  fontSize: 14,
  borderRadius: 8,
  margin:5
},

    txtes: {fontSize: 15,fontFamily: 'Montserrat-Medium',marginHorizontal:20},
    txteded: {fontSize: 14,fontFamily: 'Montserrat-Regular',paddingHorizontal:10, flexWrap: 'wrap',maxWidth: '80%', },
   
  rowVi: {flexDirection: 'row',justifyContent: 'space-between',marginVertical:10,padding:10,marginHorizontal:15,backgroundColor: 'rgba(22, 35, 44, 0.04)',borderRadius:15},
  diVi: {backgroundColor: '#E5B635',margin:10,padding:12,borderRadius:10,alignSelf: 'center'}

})