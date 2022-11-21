import { Text, View, Image, TouchableOpacity, FlatList, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../navigation/AuthProvider';
import { styles } from '../../../styles/ProfileStyles';
import firestore from '@react-native-firebase/firestore';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserPostDataVideo from '../UserPostDataVideo'
import UserPostData from '../UserPostData'
import SuggestionScreen from '../../components/screens/suggestionScreen'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = ({ navigation, route }) => {

  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [follow, setFollow] = useState(null);
  const [allusers, setAllUsers] = useState(null);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId || route.params.uid : user.uid)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const { userId, postImg, postvideo } = doc.data();
            list.push({
              id: doc.id,
              userId,
              postImg,
              postvideo
            });
          });
        });
      setPosts(list);
      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(route.params ? route.params.userId || route.params.uid : user.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            setUserData(documentSnapshot.data());
          }
        });
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    getUser();
    fetchPosts();
    navigation.addListener('focus', () => setLoading(!loading));
  }, [navigation, loading]);

  const MixedScreen = () => {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item }) => <UserPostData key={item.id} item={item} />}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  const VideoScreen = () => {
    return (
      <View style={[styles.container, { flex: 1 }]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={({ item }) => <UserPostDataVideo key={item.id} item={item} />}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  const onfollow = () => {
    const currentfollower = !userData.follower.includes(user.uid);
    const currentfollowing = !userData.follower.includes(user.uid);

    const following = firestore()
      .collection('users')
      .doc(user.uid)

    const follower = firestore()
      .collection('users')
      .doc(userData.uid)

    const batch = firestore().batch()
    batch.update(follower, { follower: currentfollower ? firestore.FieldValue.arrayUnion(user.uid) : firestore.FieldValue.arrayRemove(user.uid) })
    batch.update(following, { following: currentfollowing ? firestore.FieldValue.arrayUnion(userData.uid) : firestore.FieldValue.arrayRemove(userData.uid) })
    batch.commit();
  }

  const getfollower = () => {
    try {
      firestore()
        .collection('users')
        .doc(route.params ? route.params.userId || route.params.uid : user.uid)
        .onSnapshot((snapshot) => {
          setFollow(snapshot.data())
        })
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getfollower()
    getAllUser()
  }, [])

  const getAllUser = async () => {
    const list = [];
    try {
      await firestore()
        .collection('users')
        .where('uid', '!=', user.uid)
        .onSnapshot((snapshot) => {
          snapshot.docs.forEach(doc => {
            const { fname, follower, following, uid, email, userImg } = doc.data()
            list.push({
              id: doc.id,
              fname,
              follower,
              following,
              uid,
              email,
              userImg
            })
          })
          setAllUsers(list)
        })
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      <View
        style={{
          width: '100%',
          height: 280,
          marginTop: 14,
        }}>
        <View style={styles.maincontainer}>
          <Image
            style={styles.userImg}
            source={{
              uri: userData?.userImg
                ? userData?.userImg :
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'

            }}
          />
          <View style={styles.userInfoWrapper}>
            <View style={styles.userInfoItem}>
              <Text style={[styles.userInfoTitle, { color: '#000' }]}>{posts.length}</Text>
              <Text style={[styles.userInfoSubTitle, { color: '#000' }]}>Posts</Text>
            </View>
            <View style={styles.userInfoItem}>
              {route.params ?
                <>
                  {follow?.follower ?
                    <Text style={[styles.userInfoTitle, { color: '#000' }]}>{follow?.follower.length}</Text>
                    :
                    <Text style={[styles.userInfoTitle, { color: '#000' }]}>0</Text>
                  }
                </>
                :
                <>
                  {user.uid ?
                    <>
                      {follow?.follower ?
                        <Text style={[styles.userInfoTitle, { color: '#000' }]}>{follow?.follower.length}</Text>
                        :
                        <Text style={[styles.userInfoTitle, { color: '#000' }]}>0</Text>
                      }
                    </>
                    : null
                  }
                </>
              }
              <Text style={[styles.userInfoSubTitle, { color: '#000' }]}>Follower</Text>
            </View>
            <View style={styles.userInfoItem}>
              {route.params ?
                <>
                  {route.params ?
                    <>
                      {follow?.following ?
                        <Text style={[styles.userInfoTitle, { color: '#000' }]}>{follow?.following.length}</Text>
                        :
                        <Text style={[styles.userInfoTitle, { color: '#000' }]}>0</Text>
                      }
                    </>
                    : null
                  }
                </>
                :
                <Text style={[styles.userInfoTitle, { color: '#000' }]}>{follow?.following.length}</Text>
              }
              <Text style={[styles.userInfoSubTitle, { color: '#000' }]}>Following</Text>
            </View>
          </View>
        </View>
        <Text style={styles.userName}>
          {userData ? userData.fname : ''}
        </Text>
        <Text style={styles.aboutUser}>
          {userData ? userData.about : ''}
        </Text>

        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              {route.params.userId != user.uid ?
                <>
                  <TouchableOpacity
                    style={[styles.userBtn, { backgroundColor: '#fff', borderColor: '#ECECEC' }]}
                    onPress={() => navigation.navigate('Chats', { userName: userData.fname, uid: userData.uid, status: typeof (userData.status) == "string" ? userData.status : userData.status.toDate().toString() })}>
                    <Text style={[styles.userBtnTxt, { color: '#000' }]}>Message</Text>
                  </TouchableOpacity>
                  <>
                    {route.params.userId || route.params.uid != user.uid ?
                      <>
                        {userData?.follower.includes(user.uid) ?
                          <TouchableOpacity style={[styles.userBtn, { backgroundColor: '#fff', borderColor: '#ECECEC' }]}
                            onPress={onfollow}>
                            <Text style={[styles.userBtnTxt, { color: '#000' }]}>following</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity style={[styles.userBtn, { backgroundColor: '#3897f1', borderColor: '#3897f1' }]}
                            onPress={onfollow}>
                            <Text style={[styles.userBtnTxt, { color: '#fff' }]}>follow</Text>
                          </TouchableOpacity>

                        }
                      </>
                      :
                      null

                    }
                  </>

                </>
                :
                <>
                  <TouchableOpacity
                    style={styles.userBtnprofile}
                    onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={[styles.userBtnTxt, { color: '#000' }]}>Edit Profile</Text>
                  </TouchableOpacity>
                </>
              }
            </>

          ) : (
            <>
              <TouchableOpacity
                style={styles.userBtnprofile}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={[styles.userBtnTxt, { color: '#000' }]}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

      </View>
      <View style={{ width: width, height: height / 4, justifyContent: 'center' }}>
        {route.params ?
          <Text style={{ fontSize: 15, fontWeight: '400', color: '#000', marginLeft: '2%', marginBottom: '3%' }}>
            Suggested for you
          </Text>
          :
          <Text style={{ fontSize: 15, fontWeight: '400', color: '#000', marginLeft: '2%', marginBottom: '3%' }}>
            Discover people
          </Text>
        }
        <>
          {loading ?
            <ActivityIndicator size={45} color="#2e64e5" />
            :
            <FlatList horizontal
              data={allusers}
              onRefresh={() => getAllUser()}
              refreshing={loading}
              renderItem={({ item }) => (
                <SuggestionScreen item={item} />
              )}
              keyExtractor={item => item.id}
            />
          }
        </>

      </View>

      <View style={{ width: width, height: height }}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#000',
            headerShown: false,
            tabBarInactiveTintColor: '#949494',
            tabBarIndicatorStyle: {
              width: '50%', height: 1, backgroundColor: '#ECECEC'
            },
            tabBarStyle: {
              shadowColor: '#fff', marginBottom: 1,
            },

          }}>
          <Tab.Screen
            name="Image"
            component={MixedScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ color }) => (
                <Fontisto name="nav-icon-grid" color={color} size={20} />
              ),
            }}
          />
          <Tab.Screen
            name="Video"
            component={VideoScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: ({ color }) => (
                <Icon name="md-play-circle-outline" color={color} size={25} />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </ScrollView >
  );
};

export default ProfileScreen;
