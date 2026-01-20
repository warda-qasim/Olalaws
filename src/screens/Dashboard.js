import {Linking, Image, StyleSheet, Text, View ,ScrollView,TouchableOpacity,FlatList,Alert, SectionList} from 'react-native'
import React, { useState,useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
  const navigation = useNavigation();
  const [topArticles, setTopArticles] = useState([]);
const [listArticles, setListArticles] = useState([]);
const [lawyer, setLawyer] = useState(null);

  const news=[
    {id:1, img: require('../assets/images/news.jpg'),title: "A Comprehensive Guide to Legal Frameworks",badge: "Criminal Law"},
    {id:2, img: require('../assets/images/news2.jpg'),title: "Legal Complexities: Key Insights",badge: "Civil Law"},

  ]
  const [legalInsight,setLegalInsight] = useState(null);
   const [sections, setSections] = useState([]);
    const law=[
    {id:1, img: require('../assets/images/law3.jpg'),title: "Foundations of Law: Essential Knowledge",badge: "Criminal Law"},
    {id:2, img: require('../assets/images/law2.jpg'),title: "The Role of Law in Society: A Detailed Analysis",badge: "Civil Law"},
  ]

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const lawyerId = await AsyncStorage.getItem('lawyerId');
      if (!lawyerId) {
        Alert.alert('Error', 'Lawyer ID missing');
        return;
      }

      const res = await fetch(
        `https://loving-turing.91-239-146-172.plesk.page/api/LawyerProfile/MainDashboard?lawyerId=${lawyerId}`
      );

      const json = await res.json();
        /* ---------- LAWYER INFO ---------- */
    if (json?.lawyer) {
      setLawyer(json.lawyer);
    }

if (json?.appointments?.length) {
  let count = 0;
  const sections = [];

  for (const day of json.appointments) {
    const limitedAppointments = [];

    for (const appt of day.appointments) {
      if (count === 3) break;

      limitedAppointments.push(appt);
      count++;
    }

    if (limitedAppointments.length) {
      sections.push({
        title: day.bookingDate,
        data: limitedAppointments
      });
    }

    if (count === 3) break;
  }

  setSections(sections);
}

    if (json?.articles?.length) {
      const firstTwo = json.articles.slice(0, 2);
      const nextTwo = json.articles.slice(2, 4);

      setTopArticles(firstTwo);
      setListArticles(nextTwo);
    }
      if (json?.legalInsight) {
      setLegalInsight(json.legalInsight);
    }
   
    } catch (e) {
      console.log('Dashboard Error:', e);
      Alert.alert('Error', 'Unable to load appointments');
    }
  };
const getYoutubeId = url => {
  const match = url?.match(/(?:\?|&)v=([^&]+)/);
  return match ? match[1] : null;
};

const getYoutubeThumbnail = id =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const openYoutube = async url => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log('Open YouTube error:', error);
    Alert.alert('Error', 'Unable to open YouTube');
  }
};

const videoId = getYoutubeId(legalInsight?.videoUrl);


    const renderItem = ({ item }) => (
        <View style={styles.rowV}>
     <View style={{flex:0.2}}>
       <Image source={{ uri: item.imageUrl }} style={styles.elips}/>
       </View>
       <View style={{flex:0.6,paddingHorizontal:7}}>
       <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:10,fontFamily: 'Montserrat-Regular'}]}>{item.id}</Text>
       <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:14,fontFamily: 'Montserrat-Bold'}]}>  {item.name}</Text>
      <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:10,fontFamily: 'Montserrat-Regular'}]}> {item.age}Y {item.gender}</Text>
      <View style={[styles.rowV,{margin:0}]}>
    <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:10,fontFamily: 'Montserrat-Medium'}]}>{item.bookingDate}-{item.time}</Text>
    <View style={{backgroundColor: 'rgba(229, 182, 53, 1)',borderRadius:20,padding:4}}>
    <Text style={[styles.txt,{color: 'white',fontSize:8,fontFamily: 'Montserrat-Medium'}]}>{item.mode}</Text>
    </View>
    </View>
       </View>
       <View style={{flex:0.3,}}>
        <TouchableOpacity>
        <Text style={[styles.txt,{color: '#E5B635',fontSize:10,fontFamily: 'Montserrat-Bold'}]}>See More Details</Text>
        </TouchableOpacity>
        <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:10,fontFamily: 'Montserrat-Medium',marginTop:15,}]}>Last Visit: {item.lastVisit ?? 'N/A'}</Text>
       </View>
     </View> 
  );

const BASE_IMAGE_URL = 'https://loving-turing.91-239-146-172.plesk.page/images/';
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <View style={styles.firstV}>
     <View style={styles.rowV}>
     <View style={{flex:0.8}}>
       <Image source={require('../assets/images/log.png')} style={styles.img}/>
       </View>
       <View style={styles.rowVie}>
       <TouchableOpacity>
       <Image source={require('../assets/images/not.png')} style={styles.notif}/>
       </TouchableOpacity>
        <TouchableOpacity>
       <Image source={require('../assets/images/menu.png')} style={styles.notif}/>
       </TouchableOpacity>
       </View>
     </View>
     <View style={styles.rowV}>
     <View style={{flex:0.2}}>
      {/* {uri: lawyer.profilePic } */}
      <TouchableOpacity onPress={()=>navigation.navigate('UserProfile')}>
        <Image source={{
           uri: lawyer.profilePic
             ? `${BASE_IMAGE_URL}${lawyer.profilePic}`
             : undefined,
         }} style={styles.elips} />
       </TouchableOpacity>
       </View>
       <View style={{flex:0.7}}>
       <Text style={[styles.txt,{fontFamily: 'Montserrat-Regular'}]}>Welcome Back</Text>
       <Text style={[styles.txt2,{fontFamily: 'Montserrat-Bold'}]}> {lawyer ? `${lawyer.firstName} ${lawyer.lastName}` : 'Loading...'}</Text>
       <Text style={[styles.txt,{fontFamily: 'Montserrat-Italic'}]}>President Dist. Bar Association</Text>
       </View>
       <View style={{flex:0.1}}>
         <Image source={require('../assets/images/fri.png')} style={styles.fri}/>
       </View>
     </View>
     </View>
     <View style={{flex:0.8}}>
     <View>
     <View style={styles.rowV}>
      
     <View style={styles.boxV}>
      <TouchableOpacity onPress={()=>navigation.navigate('NewDocument')}>
       <Image source={require('../assets/images/g1.png')} style={styles.gf}/>
        <Text style={[styles.mytx,{fontFamily: 'Montserrat-Bold'}]}>New Documents</Text>
         <Text style={[styles.mytxt,{fontFamily: 'Montserrat-Light'}]}>Quickly generate legal drafts by entering case details.</Text>
    </TouchableOpacity>
     </View>
     
        <View style={[styles.boxV,{backgroundColor: '#F8FAFC',}]}>
          <TouchableOpacity>
       <Image source={require('../assets/images/g3.png')} style={styles.gf}/>
        <Text style={[styles.mytx,{color:'#16232C',fontFamily: 'Montserrat-Bold'}]}>Client Cases</Text>
         <Text style={[styles.mytxt,{color:'rgba(22, 35, 44, 0.6)',fontFamily: 'Montserrat-Light'}]}>Track and manage all client case records easily.</Text>
    </TouchableOpacity>
     </View>
     </View>
      <View style={styles.rowV}>
      
   <View style={[styles.boxV,{backgroundColor: '#F8FAFC',}]}>
      <TouchableOpacity>
       <Image source={require('../assets/images/g2.png')} style={styles.gf}/>
        <Text style={[styles.mytx,{color:'#16232C',fontFamily: 'Montserrat-Bold'}]}>Legal Q&A Chat Bot</Text>
         <Text style={[styles.mytxt,{color:'rgba(22, 35, 44, 0.6)',fontFamily: 'Montserrat-Light'}]}>Ask legal questions & get instant answers anytime.</Text>
   </TouchableOpacity>
     </View>
        <View style={[styles.boxV,{backgroundColor: '#F8FAFC',}]}>
            <TouchableOpacity>
       <Image source={require('../assets/images/g4.png')} style={styles.gf}/>
        <Text style={[styles.mytx,{color:'#16232C',fontFamily: 'Montserrat-Bold'}]}>Translate Legal Docs</Text>
         <Text style={[styles.mytxt,{color:'rgba(22, 35, 44, 0.6)',fontFamily: 'Montserrat-Light'}]}>Instantly convert legal text between Urdu & English.</Text>
   </TouchableOpacity>
     </View>
     </View>
      <View style={styles.rowV}>
      </View>
     </View>
     <View>
      <View style={[styles.rowV,{marginHorizontal:15,margin:0}]}>
     <Text style={[styles.mytxte,{fontFamily: 'Montserrat-Bold'}]}>Appointments</Text>
     <TouchableOpacity>
     <Text style={[styles.mytxte,{fontFamily: 'Montserrat-Regular'}]}>View All</Text>
     </TouchableOpacity>
     </View>
     </View>
      

      <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      // renderSectionHeader={({ section }) => (
      //   <Text style={styles.sectionHeader}>
      //     {section.title}
      //   </Text>
      // )}
      showsVerticalScrollIndicator={false}
    />

     <View>
      <View style={[styles.rowV,{marginHorizontal:15,margin:0}]}>
     <Text style={[styles.mytxte,{fontFamily: 'Montserrat-Bold'}]}>Legal Insights</Text>
     <TouchableOpacity>
     <Text style={[styles.mytxte,{fontFamily: 'Montserrat-Regular'}]}>View All</Text>
     </TouchableOpacity>
     </View>
     </View>
 
 
     const videoId = getYoutubeId(legalInsight?.videoUrl);

{videoId && (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() => openYoutube(legalInsight.videoUrl)}
    style={{ margin: 15 }}
  >
    <View
      style={{
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: getYoutubeThumbnail(videoId) }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />

      {/* Play Button */}
      <View
        style={styles.playBtn} >
        <View
          style={styles.playView}
        >
          <Text style={{ color: '#E5B635', fontSize: 26 }}>▶</Text>
        </View>
      </View>
    </View>
</TouchableOpacity>
)}
{legalInsight && (
  <View style={{ marginHorizontal: 15 }}>
   
     <View style={{marginVertical:10}}>
     <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:10,fontFamily: 'Montserrat-Regular'}]}>{legalInsight.date}</Text>
       <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:14,fontFamily: 'Montserrat-Bold'}]}>{legalInsight.title}</Text>
      <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:10,fontFamily: 'Montserrat-Regular'}]}>An informative overview of legal principles and their applications.</Text>
    </View>
     </View>
     )}
     <View style={[styles.rowV,{marginHorizontal:15,margin:0}]}>
     <Text style={[styles.mytxte,{fontFamily: 'Montserrat-Bold'}]}>Recent Articles</Text>
     <TouchableOpacity>
     <Text style={[styles.mytxte,{fontFamily: 'Montserrat-Regular'}]}>View All</Text>
     </TouchableOpacity>
     </View>

      <FlatList 
      data={topArticles}
    numColumns={2}
      keyExtractor={(item) => item.articlesID.toString()}
      renderItem={({item})=>(
         <View style={styles.flt}>
     <Image source={{ uri: item.imageUrl }} style={styles.myg}/>
     <View style={{marginVertical:10}}>
      <View style={{backgroundColor: 'rgba(229, 182, 53, 0.08)',borderRadius:20,padding:5,alignSelf:'baseline'}}>
<Text style={[styles.txt,{color: '#E5B635',fontSize:10,fontFamily: 'Montserrat-Regular'}]}>{item.badge}</Text>
    </View>
     
       <Text style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:14,fontFamily: 'Montserrat-Bold'}]}>{item.title}</Text>
    </View>
     </View>
      )}
      />

       <FlatList 
      data={listArticles}
        keyExtractor={(item) => item.articlesID.toString()}
      renderItem={({item})=>(
         <View style={styles.fltv}>
          <View style={styles.rowVf}>
           
     <Image source={{ uri: item.imageUrl }} style={styles.mygv}/>
     
     <View style={{flex: 1,marginLeft:10 }}>
      <View style={{backgroundColor: 'rgba(229, 182, 53, 0.08)',borderRadius:20,padding:5,alignSelf:'flex-start'}}>
<Text style={[styles.txt,{color: '#E5B635',fontSize:10,fontFamily: 'Montserrat-Regular'}]}>{item.badge}</Text>
    </View>
     
       <Text numberOfLines={2} ellipsizeMode='tail' style={[styles.txt,{color: 'rgba(22, 35, 44, 1)',fontSize:14,fontFamily: 'Montserrat-Bold',}]}>{item.title}</Text>
    </View>

    </View>
     </View>
      )}
      />
    
     </View>
     </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container: { flex:1,backgroundColor: '#FFFFFF'},
    flt: {margin:10, width: '44%', borderRadius: 8 ,backgroundColor: 'white',padding:10, elevation: 5, },
    fltv: {margin:10,  borderRadius: 8 ,backgroundColor: 'white',padding:10, elevation: 5, },
    rowV: {flexDirection: 'row',justifyContent: 'space-between',margin:12,alignItems: 'center'},
    rowVf: {flexDirection: 'row',alignItems: 'center'},
    rowVie:{flexDirection: 'row',flex:0.2},
    img:{height: 24,width:142,resizeMode: 'contain'},
    myg:{height: 80,width:'100%',borderRadius:8},
    mygv:{height: 64,width:64,borderRadius:8},
     gf:{height: 48,width:48,resizeMode: 'contain'},
    fri:{height: 56,width:32,resizeMode: 'contain'},
     notif:{height: 24,width:24,resizeMode: 'contain',margin:5},
     elips:{height: 56,width:56,resizeMode: 'contain'},
    firstV:{flex:0.2,backgroundColor: '#16232C'},
    txt: {color: '#FFFFFF',fontSize: 12},
    txt2: { color: '#E5B635',fontSize: 18},
    mytx: {color: '#FFFFFF',fontSize: 14,marginTop:18},
     mytxt: {color: '#FFFFFF',fontSize: 10,},
      mytxte: {color: '#16232C',fontSize: 16,},
    boxV: {backgroundColor: '#E5B635',borderRadius: 10,padding:10,flex:0.5,marginHorizontal:5,height:160},
    vid: {height: 180,width:'100%',borderRadius:8},
    playBtn: { position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.25)',},
          playView: {
            width: 50,
            height: 50,
            borderRadius: 32,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }
})