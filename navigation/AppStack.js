import React, { useEffect, useState, useContext, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../src/components/screens/Home';
import MessageScreen from '../src/components/screens/MessageScreen';
import ProfileScreen from '../src/components/screens/ProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AddPostScreen from '../src/components/screens/AddPostScreen';
import ChatScreen from '../src/components/screens/ChatScreen';
import EditProfileScreen from '../src/components/screens/EditProfileScreen';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../navigation/AuthProvider';
import CommentScreen from '../src/components/screens/CommentScreen';
import moment from 'moment';
import SearchScreen from '../src/components/screens/SearchScreen';
import LikeCommentFollowerScreen from '../src/components/screens/LikeCommentFollowerScreen';
import ReelScreen from '../src/components/screens/ReelScreen';
import PostReelScreen from '../src/components/screens/PostReelScreen'
import RBSheet from 'react-native-raw-bottom-sheet';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabBar({ navigation }) {
  const [userProfile, setUserProfile] = useState(null)
  const { user, logout } = useContext(AuthContext);
  const refRBSheet = useRef();

  const getuserProfile = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        setUserProfile(documentSnapshot.data())
      })
  }

  useEffect(() => {
    getuserProfile()
  }, [])

  return (
    <>
      <>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#fff',
            },
          }}
          height={240}>
          <Text style={{ fontSize: 16, fontWeight: '400', color: '#000', textAlign: 'center', marginTop: '1%' }}>
            Login
          </Text>
          <TouchableOpacity activeOpacity={0.7} style={{ justifyContent: 'center', alignItems: 'center', marginTop: '12%' }}
            onPress={() => {
              firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  status: firestore.FieldValue.serverTimestamp()
                }).then(() => {
                  logout()
                }).catch((err) => console.log('err', err))
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '400', color: '#3897f1' }}>
              Log out {user.email}
            </Text>
          </TouchableOpacity>
        </RBSheet>
      </>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          tabBarStyle: {
            height: 52,
            shadowColor: '#fff'
          },
          tabBarLabelStyle: {
            marginBottom: 10
          },
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '',
            headerShown: true,
            headerLeft: () => (
              <Image style={{ width: 110, height: 40, marginLeft: '6%' }} source={require('../src/images/logo.png')} />
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <AntDesign style={{ marginRight: '12%' }} name="plussquareo" color='#000' size={26} onPress={() => navigation.navigate('AddPost')} />
                <AntDesign style={{ marginRight: '6%' }} name="message1" color='#000' size={24} onPress={() => navigation.navigate('Messages')} />
              </View>
            ),
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen name='Search' component={SearchScreen}
          options={({ route }) => ({
            title: "",
            headerShown: false,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                color={color}
                size={30}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Reel"
          component={ReelScreen}
          options={({ route }) => ({
            headerShown: false,
            title: '',
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ width: 33, height: 33, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                {focused ?
                  <Image style={{ width: 26, height: 26 }} source={require('../src/images/reels.png')} />
                  :
                  <Image style={{ width: 24, height: 24 }} source={require('../src/images/reel.png')} />
                }
              </View>
            ),
          })}
        />
        <Tab.Screen name="LCF" component={LikeCommentFollowerScreen}
          options={({ route }) => ({
            title: "Activity",
            headerShown: true,
            headerShadowVisible: false,
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                color={color}
                size={30}
              />
            )
          })}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name='lock-closed-outline' size={20} color='#000' />
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#000', marginLeft: 4 }}>{userProfile?.email}</Text>
              </View>
            ),
            tabBarLabel: () => null,
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ backgroundColor: focused ? '#000' : '#fff', width: 35, height: 35, borderRadius: 35 / 2, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: 30, height: 30, borderRadius: 15 }} source={{ uri: userProfile?.userImg ? userProfile?.userImg : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png' }} />
              </View>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <SimpleLineIcons style={{ marginRight: '12%' }} name="menu" color='#000' size={24} onPress={() => refRBSheet.current.open()} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  )
}

function AppStack({ navigation }) {
  const [userProfile, setUserProfile] = useState(null)
  const { user } = useContext(AuthContext);

  const getuserProfile = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        setUserProfile(documentSnapshot.data())
      })
  }

  useEffect(() => {
    getuserProfile()
  }, [])

  return (
    <Stack.Navigator>
      <Stack.Screen name='Tab' component={TabBar} options={{ headerShown: false, headerShadowVisible: false, }} />
      <Stack.Screen
        name="AddPost"
        component={AddPostScreen}
        options={{
          title: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="ReelPost"
        component={PostReelScreen}
        options={{
          title: '',
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="HomeProfile"
        component={ProfileScreen}
        options={({ route }) => ({
          headerShadowVisible: false,
          headerTitle: () => (
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#000' }}>{route.params.email}</Text>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          headerShadowVisible: false,
          title: userProfile?.email,
          headerTitleStyle: {
            color: '#000'
          },
        }}
      />
      <Stack.Screen
        name="Chats"
        component={ChatScreen}
        options={({ route }) => ({
          headerShadowVisible: false,
          headerTitle: () => (
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#000' }}>{route.params.userName}</Text>
              <Text style={{ fontSize: 12, fontWeight: '400', color: '#949494' }}>{moment(route.params.status).calendar()}</Text>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ route }) => ({
          headerShadowVisible: false,
          headerShown: false
        })}
      />
      <Stack.Screen
        name="comments"
        component={CommentScreen}
        options={({ route }) => ({
          title: 'Comment'
        })}
      />
    </Stack.Navigator>
  )
}
export default AppStack;
