import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

const FormButton = ({ buttonTitle, ...rest}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.butttonConatiner} {...rest}>
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};
export default FormButton;

const styles = StyleSheet.create({
  butttonConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#3897f1',
    borderRadius: 3,
    padding: 10,
    width: '99%',
    marginBottom:'3%',
    marginTop:'10%',
    alignItems:'center',
    alignSelf:'center',
    marginLeft:'5%',
    marginRight:'5%'
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});
