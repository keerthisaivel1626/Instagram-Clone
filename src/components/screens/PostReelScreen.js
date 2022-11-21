import {
  Text,
  View,
  TextInput,
  Platform,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import React, { useState, useContext } from 'react';
import { styles } from '../../../styles/AddPostStyles'
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../navigation/AuthProvider';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const PostReelScreen = ({ item, navigation }) => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      mediaType: 'any',
      cropping: true,
    }).then(image => {
      const imageUrl = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUrl);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      cropping: true,
    }).then(image => {
      const imageUrl = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUrl);
    });
  };

  const videolaunch = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(video => {
      const videoUrl = Platform.OS === 'ios' ? video.sourceURL : video.path;

      setVideo(videoUrl);
    });
  };

  const submitPost = async () => {
    const videoUrl = await uploadVideo();
    const imageUrl = await uploadImage();

    firestore()
      .collection('reels')
      .add({
        userId: user.uid,
        email: user.email,
        text: post,
        reelImg: imageUrl,
        reelvideo: videoUrl,
        reelTime: firestore.Timestamp.fromDate(new Date()),
        likesbyusers: []
      })
      .then(() => {
        ToastAndroid.show(
          'Reel has been uploaded successfully',
          ToastAndroid.SHORT,
        );
        setPost(post);
        navigation.goBack();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUrl = image;
    let filename = uploadUrl.substring(uploadUrl.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');

    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`reels/photos/${filename}`);

    const task = storageRef.putFile(uploadUrl);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      ToastAndroid.show(
        'Reel image has been uploaded successfully',
        ToastAndroid.SHORT,
      );
      setImage(url);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const uploadVideo = async () => {
    if (video == null) {
      return null;
    }
    const uploadUrl = video;

    let filename = uploadUrl.substring(uploadUrl.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');

    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`reels/videos/${filename}`);
    const metadata = {
      contentType: 'video/mp4',
    };

    const task = storageRef.putFile(uploadUrl, metadata);

    task.on('state_changed', taskSnapshot => {
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await storageRef.putFile(uploadUrl);

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      ToastAndroid.show(
        'Reel video has been uploaded successfully',
        ToastAndroid.SHORT,
      );
      setVideo(video);
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <View style={{ backgroundColor: '#000', position: 'relative', flex: 1 }}>
      {uploading ? (
        <View style={[styles.StatusWrapper, {
          backgroundColor: 'transparent', position: 'absolute', zIndex: 2, height: height, justifyContent: 'center', alignSelf: 'center'
        }]}>
          < ActivityIndicator size="large" color="#3897f1" />
        </View>
      ) : (
        <View style={styles.btncontainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name='cross' color='#fff' size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={submitPost}>
            <Text style={styles.submitbtntext}>Post Reel</Text>
          </TouchableOpacity>
        </View>
      )
      }
      <View style={[styles.InputWrapper, { height: height }]}>
        {image != null ? (
          <View style={{
            width: width, height: height, zIndex: 1,
            position: 'absolute',
          }}>
            <Image style={styles.imageWrapper} source={{ uri: image }} />
          </View>
        ) : (
          <Video
            style={{
              width: width, height: height, zIndex: 1,
              position: 'absolute',
            }}
            source={{ uri: video }}
            resizeMode='cover'
          />
        )}
        <TextInput
          style={[styles.Inputfield, {
            backgroundColor: 'transparent',
            zIndex: 2, color: '#fff', height: height,
          }]}
          // placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={content => setPost(content)}
        />
      </View>
      <ActionButton
        style={[styles.actionButtonIcon, { backgroundColor: 'transparent', zIndex: 2 }]}
        buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title=""
          onPress={takePhotoFromCamera}>
          <Icon name="camera" style={[styles.actionButtonIcon, { backgroundColor: 'transparent', zIndex: 2 }]} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title=""
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images" style={[styles.actionButtonIcon, { backgroundColor: 'transparent', zIndex: 2 }]} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3498db" title="" onPress={videolaunch}>
          <Icon name="md-videocam-sharp" style={[styles.actionButtonIcon, { backgroundColor: 'transparent', zIndex: 2 }]} />
        </ActionButton.Item>
      </ActionButton>
    </View >
  );
};

export default PostReelScreen;
