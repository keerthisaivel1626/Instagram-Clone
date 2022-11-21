import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../src/components/screens/SplashScreen';
import LoginScreen from '../src/components/screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpScreen from '../src/components/screens/SignUpScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ForgotPassword from '../src/components/screens/ForgotPassword';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });

    GoogleSignin.configure({
      webClientId: '66915133418-c5rspu83ko0vdceik762dc6e32v9kn22.apps.googleusercontent.com',
      offlineAccess: true
    });
  }, []);
  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routeName = 'Splash';
  } else {
    routeName = 'Login';
  }
  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
