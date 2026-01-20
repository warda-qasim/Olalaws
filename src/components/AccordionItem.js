import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';

const AccordionItem = ({ title, icon, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          {icon}
          <Text style={styles.title}>{title}</Text>
        </View>

        <ChevronDown
          size={20}
          color="#000"
          style={{
            transform: [{ rotate: open ? '0deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      {/* Content */}
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
};

export default AccordionItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
   margin:15,
    borderWidth:1,
    borderColor: 'rgba(22, 35, 44, 0.04)'

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    borderWidth:1,
    borderColor: 'rgba(22, 35, 44, 0.04)',
    margin:5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Montserrat-Medium'
  },
  content: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
});
