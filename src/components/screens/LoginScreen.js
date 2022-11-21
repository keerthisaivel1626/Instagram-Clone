import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import React, { useContext, useState } from 'react';
import FormInput from '../FormInput';
import FormButton from '../FormButton';
import SocialButton from '../SocialButton';
import { AuthContext } from '../../../navigation/AuthProvider';
import FormInputPassword from '../FormInputPassword';

const { width, height } = Dimensions.get('window')

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, googleLogin } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ width: width - 40, height: height, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ width: '60%', height: '8%', marginBottom: '10%' }} source={require('../../images/logo.png')} />
        <FormInput
          keyboardType="email-address"
          placeholderText="Email"
          iconType="user"
          autoCaitalize="none"
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <FormInputPassword
          placeholderText="Password"
          iconType="lock"
          labelValue={password}
          secureTextEntry
          onChangeText={userPassword => setPassword(userPassword)}
        />
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={[styles.forgotbtn, { marginRight: 4 }]}>
          <Text style={styles.navbtntext}>Forgot Password?</Text>
        </TouchableOpacity>
        <FormButton
          buttonTitle="Login"
          onPress={() => login(email, password)}
        />
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', borderWidth: 0.2, borderColor: '#9b9b9b', width: '42%', height: 0 }} />

          <Text style={{ color: '#9b9b9b', fontSize: 14, fontWeight: '500', marginLeft: 12, marginRight: 12 }}>OR</Text>

          <View style={{ flexDirection: 'row', borderWidth: 0.2, borderColor: '#9b9b9b', width: '42%', height: 0 }} />
        </View>
        {Platform.OS === 'android' ? (
          <View>
            <SocialButton
              onPress={() => googleLogin()}
            />
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', marginTop: '30%' }}>
          <Text style={styles.navbtntext}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={[styles.forgotbtn, { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', }]}>
            <Text style={[styles.navbtntext, { color: '#9b9b9b', marginLeft: 4 }]}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instatext: {
    width: '60%',
    height: '10%',
    alignSelf: 'center',
    marginBottom: '8%'
  },
  forgotbtn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end'
  },
  navbtntext: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9b9b9b',
  }
});
