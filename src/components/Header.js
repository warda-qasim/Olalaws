import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MoveLeft } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

const Header = ({title}) => {
    const navigation= useNavigation();
  return (
    <View style={styles.bgC}>
     <View style={styles.rowV}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
     <MoveLeft size={23} color='#FFFFFF' />
     </TouchableOpacity>
     <Text style={styles.txt}>{title}</Text>
     </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    bgC: {
        backgroundColor: '#16232C'
    },
    rowV: {
        flexDirection: 'row',
       alignItems: 'center',
       marginVertical:15,
       marginHorizontal:20
    },
    txt: {
        fontSize: 16,fontFamily: 'Montserrat-SemiBold',color: '#FFFFFF',marginLeft:10
    }
})