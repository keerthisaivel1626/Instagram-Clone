import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View,Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const height =Dimensions.get('window').height

const SocialButton = ({ onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.butttonConatiner} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <FontAwesome
          style={styles.icon}
          name="google"
          size={22}
          color="#fff"
        />
      </View>
      <View style={styles.btnTextWrapper}>
        <Text style={styles.buttonText}>Log In with Google</Text>
      </View>
    </TouchableOpacity>
  );
};
export default SocialButton;

const styles = StyleSheet.create({
  butttonConatiner: {
    width: '100%',
    marginTop: 10,
    height: height / 18,
    backgroundColor: '#de4d41',
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
