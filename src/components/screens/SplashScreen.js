import { View, Dimensions, StyleSheet, Text, Image } from 'react-native';
import React from 'react';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const SplashScreen = ({ navigation }) => {

  setTimeout(() => {
    navigation.replace('Login')
  }, 3000);

  return (
    <View style={styles.container}>
      <View style={styles.titlecontainer}>
        <Image style={styles.logo} source={require('../../images/instagram.png')} />
      </View>
      <Text style={styles.from}>
        from
      </Text>
      <View style={styles.metacontainer}>
        <Image style={styles.metaimg} source={require('../../images/meta.png')} />
        <Text style={styles.title}>
          meta
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titlecontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height - 150,
  },
  logo: {
    width: width / 9,
    height: height / 19,
    // shadowColor: '#fff',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // elevation: 2,
    resizeMode: 'cover',
  },
  from: {
    fontSize: 18,
    fontWeight: '400',
    color: '#3897f1',
  },
  metacontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 2,
    height: height / 16,
  },
  metaimg: {
    width: width / 14,
    height: height / 30,
    marginRight: '2%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#242526',
  },
});