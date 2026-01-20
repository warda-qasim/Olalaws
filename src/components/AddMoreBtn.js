import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native';

const AddMoreBtn = ({title,onPress}) => {
  return (
    <View style={{margin:15}}>
    <TouchableOpacity style={styles.btn} onPress={onPress}>
        <View style={styles.rowV}>
            <Plus size={18} />
        <Text style={styles.txt}>{title}</Text>
        </View>
    </TouchableOpacity>
    </View>
  )
}

export default AddMoreBtn;

const styles = StyleSheet.create({
    btn: {
       backgroundColor: 'rgba(22, 35, 44, 0.2)' ,
       borderRadius: 8,
       paddingVertical:10,
    },
    txt: {marginLeft:8,fontSize: 14,color: '#16232C',fontFamily: 'Montserrat-Medium',textAlign: 'center'},
    rowV: {flexDirection: 'row',alignItems: 'center',justifyContent:'center'}
})