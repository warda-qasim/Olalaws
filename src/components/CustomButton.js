import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomButton = ({title,onPress,disabled}) => {
  return (
    <View style={{margin:15}}>
    <TouchableOpacity style={styles.btn} disabled={disabled} onPress={onPress}>
        <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
    </View>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    btn: {
       backgroundColor: '#E5B635' ,
       borderRadius: 8,
       paddingVertical:10,
    },
    txt: {fontSize: 16,color: '#FFFFFF',fontFamily: 'Montserrat-Medium',textAlign: 'center'}
})