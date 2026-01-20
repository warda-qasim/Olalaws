import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View ,Dimensions} from 'react-native'
import React from 'react'


const CustomInput = ({plc,onChangeText,value,keyboardType,editable}) => {
  return (
    
   
    <KeyboardAvoidingView>
        <TextInput placeholder={plc} editable={editable} keyboardType={keyboardType} value={value} onChangeText={onChangeText} placeholderTextColor='rgba(22, 35, 44, 0.4)' style={styles.input} />
    </KeyboardAvoidingView>
  
  )
}

export default CustomInput

const styles = StyleSheet.create({
    input: {fontFamily: 'Montserrat-Light',fontSize:15,height:40,color:'#16232C',padding:10,marginHorizontal:15,margin:10,borderRadius:8,borderColor: '#16232C99',borderWidth: 1}
})