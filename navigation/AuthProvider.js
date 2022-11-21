import React, { createContext, useState } from 'react';
import auth, { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ToastAndroid } from 'react-native'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          if (email && password) {
            try {
              await auth().signInWithEmailAndPassword(email, password);
            } catch (error) {
              if (error.code === 'auth/invalid-email') {
                ToastAndroid.show('Invalid email address', ToastAndroid.SHORT)
              } else if (error.code === 'auth/user-not-found') {
                ToastAndroid.show('User not found', ToastAndroid.SHORT)
              } else if (error.code === 'auth/wrong-password') {
                ToastAndroid.show('Invalid password', ToastAndroid.SHORT)
              } else if (error.code === 'auth/network-request-failed') {
                ToastAndroid.show('Network request failed', ToastAndroid.SHORT)
              }
              else {
                console.log(error);
              }
            }
          } else {
            ToastAndroid.show('Please enter email and password ', ToastAndroid.SHORT)
          }
        },

        googleLogin: async () => {
          try {
            const { idToken } = await GoogleSignin.signIn()
            const googleCradential = auth.GoogleAuthProvider.credential(idToken)
            console.log('google', googleCradential)
            await auth().signInWithCredential(googleCradential)
          } catch (error) {
            if (error) {
              ToastAndroid.show('Something went wrong', ToastAndroid.SHORT)
            } else {
              console.log(error);
            }
          }

        },
        forgotpassword: async (email) => {
          if (email) {
            try {
              firebase.auth().sendPasswordResetEmail(email).then(() => {
                ToastAndroid.show(`Please check your email :${email}`, ToastAndroid.LONG,)
              })
            } catch (error) {
              if (error.code === 'auth/invalid-email') {
                ToastAndroid.show('Invalid email address', ToastAndroid.SHORT)
              } else if (error.code === 'auth/user-not-found') {
                ToastAndroid.show('User not found', ToastAndroid.SHORT)
              } else if (error.code === 'auth/network-request-failed') {
                ToastAndroid.show('Network request failed', ToastAndroid.SHORT)
              }
              else {
                console.log(error);
              }
            }
          } else {
            ToastAndroid.show('please enter your email address', ToastAndroid.SHORT)
          }

        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider >
  );
};
