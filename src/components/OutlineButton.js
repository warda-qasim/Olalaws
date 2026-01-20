import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const OutlineButton = ({title,onPress}) => {
  return (
    <View style={{margin:15}}>
    <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
    </View>
  )
}

export default OutlineButton

const styles = StyleSheet.create({
    btn: {
       backgroundColor: '#FFFFFF' ,
       borderRadius: 8,
       paddingVertical:10,
       borderWidth:1,
       borderColor: '#16232C'
    },
    txt: {fontSize: 16,color: '#16232C',fontFamily: 'Montserrat-Medium',textAlign: 'center'}
})