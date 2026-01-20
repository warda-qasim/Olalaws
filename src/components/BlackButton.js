import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const BlackButton = ({title,onPress}) => {
  return (
    <View style={{margin:15}}>
    <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
    </View>
  )
}

export default BlackButton

const styles = StyleSheet.create({
    btn: {
       backgroundColor: '#16232C' ,
       borderRadius: 8,
       paddingVertical:10,
    },
    txt: {fontSize: 16,color: '#FFFFFF',fontFamily: 'Montserrat-Medium',textAlign: 'center'}
})