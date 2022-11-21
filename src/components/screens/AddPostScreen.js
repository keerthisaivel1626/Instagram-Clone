import {
  Text,
  View,
  TextInput,
  Platform,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView, Dimensions
} from 'react-native';
import React, { useState, useContext } from 'react';
import { styles } from '../../../styles/AddPostStyles';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../navigation/AuthProvider';
import Video from 'react-native-video';
  
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const AddPostScreen = ({ item, navigation }) => {
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
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
      mediaType: 'video'
    }).then(video => {
      const videoUrl = Platform.OS === 'ios' ? video.sourceURL : video.path;

      setVideo(videoUrl);
    });
  };

  const submitPost = async () => {
    const videoUrl = await uploadVideo();
    const imageUrl = await uploadImage();

    firestore()
      .collection('posts')
      .add({
        userId: user.uid,
        email: user.email,
        post: post,
        postImg: imageUrl,
        postvideo: videoUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likesbyusers: []
      })
      .then(() => {
        ToastAndroid.show(
          'Post has been uploaded successfully',
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

    const storageRef = storage().ref(`photos/${filename}`);

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
        'Image has been uploaded successfully',
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

    const storageRef = storage().ref(`videos/${filename}`);
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
        'Video has been uploaded successfully',
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
    <View style={styles.container}>
      <View style={styles.InputWrapper}>
        {image != null ? (
          <View style={{ width: width, height: height / 2 }}>
            <Image style={styles.imageWrapper} source={{ uri: image }} />
          </View>
        ) : (
          <Video
            style={{ width: width, height: height / 3.7 }}
            source={{ uri: video }}
            resizeMode='cover'
          />
        )}
        <TextInput
          style={styles.Inputfield}
          placeholder="What's on your mind?"
          multiline
          numberOfLines={4}
          value={post}
          onChangeText={content => setPost(content)}
        />
        {uploading ? (
          <View style={styles.StatusWrapper}>
            <Text style={{ fontSize: 15, color:'#3897f1', fontWeight: '500' }}>
              {transferred} % Completed
            </Text>
            <ActivityIndicator size="large" color='#3897f1' />
          </View>
        ) : (
          <TouchableOpacity style={styles.submitbtn} onPress={submitPost}>
            <Text style={styles.submitbtntext}>Post</Text>
          </TouchableOpacity>
        )}
      </View>
      <ActionButton
        style={styles.actionButtonIcon}
        buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title=""
          onPress={takePhotoFromCamera}>
          <Icon name="camera" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title=""
          onPress={choosePhotoFromLibrary}>
          <Icon name="md-images" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor="#3498db" title="" onPress={videolaunch}>
          <Icon name="md-videocam-sharp" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export default AddPostScreen;
