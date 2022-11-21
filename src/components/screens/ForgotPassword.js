import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../navigation/AuthProvider'
import FormInput from '../FormInput'
import FormButton from '../FormButton'

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const { forgotpassword } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <View style={styles.formcontainer}>
        <Text style={styles.text}>Trouble with logging in?</Text>
        <Text style={[styles.text, { fontSize: 14, color: '#c0c0c0', fontWeight: '400' }]}>
          Enter your email address and we'll send
          you a link to rest your password.
        </Text>
        <FormInput 
          keyboardType="email-address"
          placeholderText="Enter Your Email"
          iconType="user"
          autoCaitalize="none"
          labelValue={email}
          onChangeText={userEmail => setEmail(userEmail)}
        />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20 }}>
        <TouchableOpacity
          onPress={() => forgotpassword(email)}
          style={styles.resttbtn}>
          <Text style={styles.navbtntext}>Send Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ justifyContent: 'center', alignItems: 'center', marginTop: '5%' }}>
          <Text style={[styles.navbtntext, { color: '#3897f1', fontWeight: '500' }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  formcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '8%',
    alignSelf: 'center'
  },
  resttbtn: {
    width: '100%',
    backgroundColor: '#3897f1',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  navbtntext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  }
})