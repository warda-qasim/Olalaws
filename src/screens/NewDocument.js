import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import CustomInput from '../components/CustomInput'
import { Dropdown } from 'react-native-element-dropdown'
import { Calendar } from 'lucide-react-native'
import BlackButton from '../components/BlackButton'
import { useNavigation } from '@react-navigation/native'

const NewDocument = () => {
    const navigation = useNavigation();
        const [contract, setContract] = useState(null);
        
         const data = [
      { label: 'Partnership Agreement', value: 'Partnership Agreement' },
      { label: 'Employment Contract', value: 'Employment Contract' },
      { label: 'Non-Disclosure Agreement (NDA)', value: 'Non-Disclosure Agreement (NDA)' },
    ];
  return (
    <View style={styles.container}>
    <Header title='New Document'/>
    <View style={{marginTop:20}}>
 <Text style={styles.txte}>Document Title</Text>
    <CustomInput plc='Enter document title' />
     <Text style={styles.txte}>First Party</Text>
    <CustomInput plc='First Party' />
     <Text style={styles.txte}>Second Party</Text>
    <CustomInput plc='Second Party' />
    <Text style={styles.txte}>City</Text>
       <Dropdown
              style={styles.dropdown}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={{ fontSize: 14 }}
              data={data}
              labelField="label"
              valueField="value"
              value={contract}
              onChange={(item) => setContract(item.value)}
              placeholder="-- Select Option --"
              placeholderStyle={styles.plch}
            />
             <Text style={styles.txte}>Date</Text>
            <View style={styles.rowV}>
                <View style={{flex:0.9}}>
          <TextInput keyboardType='number-pad' placeholder='dd/mm/yyyy' placeholderTextColor='rgba(22, 35, 44, 0.4)' style={styles.input} />
          </View>
          <View style={{flex:0.1}}>
          <Calendar size={24} color='#16232C' />
          </View>
            </View>
            <BlackButton title='Generate Document' onPress={()=>navigation.navigate('')} />
      </View>
    </View>
  )
}

export default NewDocument

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#FFFFFF'
    },
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
  rowV: {alignItems:'center',flexDirection: 'row',borderRadius:8,borderWidth:1,borderColor: 'rgba(22, 35, 44, 0.6)',height:42,marginHorizontal: 15,margin:10,},
  selectedTextStyle: {
    fontSize: 14,
    color: '#16232C',
  },
    plch: {fontSize:14,color: 'rgba(22, 35, 44, 0.4)',fontFamily: 'Montserrat-Light'}
})