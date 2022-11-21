import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Platform,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { styles } from '../../../styles/EditProfileStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import RBSheet from 'react-native-raw-bottom-sheet';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const refRBSheet = useRef();

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        fname: userData.fname,
        about: userData.about,
        phone: userData.phone,
        userImg: imgUrl,
      })
      .then(() => {
        navigation.navigate('Profile')
      });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', taskSnapshot => {
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(image);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 320,
      height: 280,
      cropping: true,
      compressImageQuality: 0.1,
    }).then(image => {
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Entypo name="cross" color="#000" size={30} />
        </TouchableOpacity>
        {uploading ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="small" color="#3897f1" />
          </View>
        ) : (
          <TouchableOpacity onPress={handleUpdate}>
            <Entypo name="check" color="#3897f1" size={30} />
          </TouchableOpacity>
        )}
      </View>
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
        <Text style={styles.chooseimg}>Choose Picture</Text>
        <View
          style={{
            borderBottomWidth: 1,
            marginBottom: 20,
          }}
        />

        <View style={{flexDirection: 'row', backgroundColor: '#fff'}}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
              marginLeft: 10,
            }}
            onPress={takePhotoFromCamera}>
            <View
              style={{
                position: 'relative',
                borderRadius: 20,
                // overflow: 'hidden',

                height: 40,
                width: 40,
                backgroundColor: 'grey',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#fff',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 2,
              }}>
              <MaterialCommunityIcons name="camera" size={25} color="white" />
            </View>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                padding: 12,
              }}>
              From Camera
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
              marginLeft: 10,
            }}
            onPress={choosePhotoFromLibrary}>
            <View
              style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',

                height: 40,
                width: 40,
                backgroundColor: 'grey',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#fff',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 2,
              }}>
              <MaterialCommunityIcons
                name="folder-image"
                size={25}
                color="white"
              />
            </View>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                padding: 12,
              }}>
              From Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>

      <View style={{alignItems: 'center', marginTop: 14}}>
        <View
          style={{
            height: 100,
            width: 100,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <ImageBackground
              source={{
                uri: image
                  ? image
                  : userData
                  ? userData.userImg ||
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'
                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png',
              }}
              style={styles.imgbg}
              imageStyle={{borderRadius: 50}}
            />
            <View
              style={{
                bottom: '25%',
                left: '75%',
                backgroundColor: '#fff',
                width: 26,
                height: 26,
                borderRadius: 26 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons name="add-circle" size={25} color="#3897f1" />
            </View>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            marginTop: 10,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
          }}>
          {userData ? userData.fname : ''}
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontSize: 14,
            fontWeight: '500',
            color: '#000',
          }}>
          {userData ? userData.email : ''}
        </Text>
      </View>

      <View style={styles.actioncontainer}>
        <FontAwesome style={styles.icon} name="user-o" color="#333" size={20} />
        <View
          style={{
            borderRightWidth: 1,
            height: '110%',
            padding: 5,
            borderColor: '#949494',
          }}
        />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#666666"
          autoCorrect={false}
          value={userData ? userData.fname : ''}
          onChangeText={txt => setUserData({...userData, fname: txt})}
          style={styles.textInput}
        />
      </View>
      <View style={styles.actioncontainer}>
        <Ionicons
          style={styles.icon}
          name="ios-clipboard-outline"
          color="#333"
          size={20}
        />
        <View
          style={{
            borderRightWidth: 1,
            height: '110%',
            padding: 4,
            borderColor: '#949494',
          }}
        />
        <TextInput
          multiline
          numberOfLines={2}
          placeholder="Tell Us Something About Yourself"
          placeholderTextColor="#666666"
          value={userData ? userData.about : ''}
          onChangeText={txt => setUserData({...userData, about: txt})}
          autoCorrect={true}
          style={styles.textInput}
        />
      </View>

      <View style={styles.actioncontainer}>
        <Feather style={styles.icon} name="phone" color="#333" size={20} />
        <View
          style={{
            borderRightWidth: 1,
            height: '110%',
            padding: 4,
            borderColor: '#949494',
          }}
        />
        <TextInput
          placeholder="Phone"
          placeholderTextColor="#666666"
          keyboardType="number-pad"
          autoCorrect={false}
          maxLength={10}
          value={userData ? userData.phone : ''}
          onChangeText={txt => setUserData({...userData, phone: txt})}
          style={styles.textInput}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
