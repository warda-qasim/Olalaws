
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useRef } from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
import { useNavigation } from '@react-navigation/native'
import { Check, MoveLeft, MoveRight } from 'lucide-react-native'

const Intro = () => {
  const sliderRef = useRef(null)
  const navigation = useNavigation();
  const slides = [
    {
      key: 1,
      title: 'Welcome to OLA LAW \n Your Digital Legal Partner.',
      text: 'Welcome to OLA LAW — the all-in-one legal companion designed for modern lawyers. From managing appointments and maintaining detailed client case records to translating documents between Urdu and English, OLA LAW simplifies your daily legal tasks. Powered by AI, the app also helps you generate professional legal documents instantly, giving you more time to focus on what matters most — your clients. Experience smart, efficient, and accessible legal practice at your fingertips.',
       logo: require('../assets/images/logo.png'),
      image: require('../assets/images/bg.png'),
      backgroundColor: '#fff',
    },
    {
      key: 2,
      title: 'Track Clients & Case\nRecords Efficiently',
      text: 'Effortlessly create, update, and manage case records for every client. Keep all relevant documents, court dates, notes, and communications centralized and secure. With advanced organization and quick access, you’ll never lose track of case history or miss a critical update again.',
       logo: require('../assets/images/logo.png'),
      image: require('../assets/images/bg.png'),
      backgroundColor: '#fff',
    },
     {
      key: 3,
      title: 'Manage Your Calendar Like a Pro',
      text: 'Stay on top of your schedule with a built-in appointment system tailored for legal professionals. Book consultations, set reminders, and sync meetings — all within the app. Whether it’s court hearings or client meetings, OLA LAW ensures you’re always prepared and on time.',
       logo: require('../assets/images/logo.png'),
      image: require('../assets/images/bg.png'),
      backgroundColor: '#fff',
    },
     {
      key: 4,
      title: 'Translate Between Urdu & English Seamlessly',
      text: 'Break down language barriers with real-time legal translations between English and Urdu. From contracts and petitions to notices and affidavits, translate with accuracy and confidence. No need for external tools — everything you need is built right into the app.',
       logo: require('../assets/images/logo.png'),
      image: require('../assets/images/bg.png'),
      backgroundColor: '#fff',
    },
     {
      key: 5,
      title: 'AI-Powered Legal Drafting Generate Legal Document',
      text: 'Use intelligent AI to draft legally accurate documents including contracts, legal notices, affidavits, and more. Just input the key details, and let the AI generate complete, professional-grade content — saving hours of manual work and reducing risk of errors.',
       logo: require('../assets/images/logo.png'),
      image: require('../assets/images/bg.png'),
      backgroundColor: '#fff',
    },
  ]

  const onDone = () => {
    navigation.navigate('LoginSignup')
  }
  const onSkip = () => {
    navigation.navigate('LoginSignup')
  }

  const renderNextButton = () => {
    return(
      <View style={styles.rowf}>
       
      <Text style={[styles.txt,{marginRight:5,color: '#E5B635'}]}>Next</Text>
       <MoveRight size={20} color='#E5B635' />
      </View>
    )
  }

  const renderDoneButton = () => {

    return (
      <View style={styles.rowf}>
        <Check size={20} color='#E5B635' />
      <Text style={[styles.txt,{marginRight:5,color: '#E5B635'}]}>Done</Text>
      
      </View>
    )
  }
  const renderSkipButton = () => {
     return (
      <View style={styles.skipp}>
        <Text style={styles.txtskip}>Skip</Text>
      </View>
    )
  }

  const renderPrevButton = () => {
    return(
      <View style={styles.rowf}>
        <MoveLeft size={20} color='white' />
      <Text style={styles.txt}>Back</Text>
      </View>
    )
  }
  const renderItem = ({ item, index }) => {
    return (
      <View style={{flex: 1}}>
        <ImageBackground style={styles.bgIm} source={item.image}>
          <View style={styles.container}>
          
        <Image source={item.logo} style={styles.dImg} />
        <Text style={styles.mtxt}>{item.title}</Text>
         <Text style={styles.mtxte}>{item.text}</Text>
        </View>
       </ImageBackground>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
        <Text style={styles.txtskip}>Skip</Text>
      </TouchableOpacity>
      <AppIntroSlider
        ref={sliderRef}
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        onSkip={onSkip}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        dotStyle={{ backgroundColor: '#FFFFFF14' }}
        activeDotStyle={{ backgroundColor: '#E5B635' }}  
        renderPrevButton={renderPrevButton}   
        showNextButton={true}
        showPrevButton={true}
      />
    </View>
  )
}

export default Intro

const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  bgIm: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover'
  },
  rowf: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  txt: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft:5
  },
  dImg: {
    height: 92,
    width: 92,
    resizeMode: 'contain' 
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mtxt: {
    fontSize: 20,
    color: '#E5B635',
    fontFamily: 'Montserrat-Bold',
    marginHorizontal: 20,
    marginVertical:10,
    textAlign: 'center'
  },
  mtxte: {
     fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Light',
    marginHorizontal: 20,
    marginVertical: 10,
    textAlign: 'center'
  },
  skipBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
   position: 'absolute',
  top: 40,         // you can adjust for safe area
  right: 20,       // push to the right side
  zIndex: 5,    // make sure it's above everything
  paddingVertical: 5,
  paddingHorizontal: 15,
  borderRadius: 20
  },
  txtskip: {color: '#FFFFFF', fontFamily: 'Montserrat-Medium', fontSize: 14}
})