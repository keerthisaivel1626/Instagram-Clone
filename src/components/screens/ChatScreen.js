import React, {
  useState,
  useEffect,
  useContext,
  useRef
} from 'react';
import { View, Image, TouchableOpacity, Dimensions, Text, ImageBackground, TextInput, Pressable, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Bubble, GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Entypo from 'react-native-vector-icons/Entypo';
import RBSheet from "react-native-raw-bottom-sheet";
import Video from 'react-native-video';
import { useTheme } from '@react-navigation/native'

const ChatScreen = ({ route }) => {
  const { colors } = useTheme()
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [video, setVideo] = useState(null);
  const [transferred, setTransferred] = useState(0);
  const [paused, setPaused] = useState(false);

  const playPaused = () => {
    setPaused(!paused);
  };
  const refRBSheet = useRef();

  const { uid } = route.params;

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
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {

    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

    const messageRef = firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')

    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map(docSnap => {
        const data = docSnap.data()
        if (!data.createdAt) {
          return {
            ...docSnap.data(),
            createdAt: docSnap.data().createdAt
          }
        } else {
          return {
            ...docSnap.data(),
            createdAt: new Date()
          }
        }

      })
      setMessages(allmsg)
    })
    return () => {
      unSubscribe()
    }
  }, []);

  const onSend = async (messageArray) => {
    const msg = messageArray[0]
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date()
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

    firestore()
      .collection('chats')
      .doc(docid)
      .collection('messages')
      .add({
        ...mymsg,
        createdAt: firestore.FieldValue.serverTimestamp()
      })
  }


  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#3897f1'
          },
          left: {
            backgroundColor: '#ECECEC'
          }
        }}
        textStyle={{
          color: '#fff',
        }}

      />
    );
  };

  const renderSend = (text, onSend) => {
    if (!image && text && onSend) {
      onSend({ text }, true);
    } else if (image && !text && onSend) {
      onSend({ image }, true);
    } if (image && text && onSend) {
      onSend({ text, image }, true);
    }
    else if (video && !text && onSend) {
      onSend({ video }, true);
    } if (video && text && onSend) {
      onSend({ text, video }, true);
    }
    else if (camera && !text && onSend) {
      onSend({ camera }, true);
    } if (camera && text && onSend) {
      onSend({ text, camera }, true);
    }
    else {
      return false;
    }
  }

  const customSend = ({ onSend, text, sendButtonProps, ...sendProps }) => {
    if (!image == '' || !text == '' || !video == '' || !camera == '') {
      return (
        <Send containerStyle={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
          {...sendProps}
          sendButtonProps={{
            ...sendButtonProps,
            onPress: () => renderSend(text, onSend),
          }}>
          <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
            <MaterialCommunityIcons name='send' size={25} color='#3879f1' />
          </View>
        </Send>
      )
    } else {
      return (
        <TouchableOpacity style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialCommunityIcons name='microphone' color='#3879f1' size={25} />
        </TouchableOpacity>
      )
    }


  };

  const renderMessageImage = (props) => {
    const { image } = props.currentMessage
    return (
      <ImageBackground
        source={{ uri: image }}
        blurRadius={8}
        style={{ width: Dimensions.get('window').width / 2, height: Dimensions.get('window').height / 3.5, marginTop: '10%', justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ width: Dimensions.get('window').width / 2, height: Dimensions.get('window').height / 3.5, resizeMode: 'contain' }}
          source={{ uri: image }} />
      </ImageBackground>
    )
  }

  const renderMessageVideo = (props) => {
    const { video } = props.currentMessage
    return (
      <Pressable onPress={playPaused} style={{ width: Dimensions.get('window').width/1.5, height: Dimensions.get('window').height/4.4, justifyContent: 'center', alignItems: 'center' }}>
        <Video style={{ width: Dimensions.get('window').width/1.5, height: Dimensions.get('window').height / 5.6 }}
          source={{ uri: video }}
          paused={paused}
          resizeMode="cover"
        />
      </Pressable>
    )
  }


  const scrollToBottomComponent = props => {
    return (
      <FontAwesome
        {...props}
        name="angle-double-down"
        size={22}
        color="#2e64e5"
      />
    );
  };

  const uploadImage = async () => {
    await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 1
    }).then(async (imguri) => {
      const imageUri = Platform.OS === 'ios' ? imguri.sourceURL : imguri.path;

      let filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      const storageRef = storage().ref(`message/${filename}`);
      const task = storageRef.putFile(imageUri);
      try {
        await task
        const url = await storageRef.getDownloadURL();
        setImage(url)
      } catch (e) {
        console.log(e)
      }
    })

  };

  const uploadCameraImage = async () => {
    await ImagePicker.openCamera({
      mediaType: 'any'
    }).then(async (imguri) => {
      const imageUri = Platform.OS === 'ios' ? imguri.sourceURL : imguri.path;

      let filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      const storageRef = storage().ref(`message/${filename}`);
      const task = storageRef.putFile(imageUri);
      try {
        await task
        const url = await storageRef.getDownloadURL();
        setCamera(url)
      } catch (e) {
        console.log(e)
      }
    })

  };

  const uploadVideo = async () => {
    await ImagePicker.openPicker({
      mediaType: 'video',

    }).then(async (videouri) => {
      const videoUri = Platform.OS === 'ios' ? videouri.sourceURL : videouri.path;

      let filename = videoUri.substring(videoUri.lastIndexOf('/') + 1);

      const extension = filename.split('.').pop();
      const name = filename.split('.').slice(0, -1).join('.');
      filename = name + Date.now() + '.' + extension;

      const storageRef = storage().ref(`message/${filename}`);
      const metadata = {
        contentType: 'video/mp4',
      };

      const task = storageRef.putFile(videoUri, metadata);
      task.on('state_changed', taskSnapshot => {
        setTransferred(
          Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
        );
      });
      try {
        await storageRef.putFile(videoUri);

        const url = await storageRef.getDownloadURL();
        // console.log('Videos', url)
        setVideo(url)
      } catch (e) {
        console.log(e)
      }
    })

  };

  const onDelete = (message) => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
    // firestore()
    //   .collection('chats')
    //   .doc(docid)
    //   .collection('messages')
    //   .doc(message._id)
    //   .delete()
    //   .then(() => {
    //     Alert.alert("delete successfully")
    //   })
    //   .catch(e => console.log('❌❌❌❌❌', e));
    setMessages(previousMessages => previousMessages !== message._id)
  }

  const onLongPress = (context, _id) => {
    console.log('iiiiiiii', _id);
    const options = ['copy', 'Delete Message', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          Clipboard.setString(_id.text);
          break;
        case 1:
          onDelete(_id)
          break;
      }
    });
  }

  const customtInputToolbar = props => {
    return (
      <View style={{
        borderTopWidth: 0,
        width: '98%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '2%',
        alignSelf: 'center',
        marginTop: '11%',
        position: 'relative'
      }}>
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: '#ECECEC',
            borderTopWidth: 0,
            marginRight: 5,
            marginLeft: 5,
            borderRadius: 40,
          }}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: user.uid,
          name: userData?.fname,
          avatar: userData?.userImg,
        }}
        renderBubble={renderBubble}
        renderSend={customSend}
        scrollToBottom
        placeholder={image || video ? 'Add Caption' : 'Type a message...'}
        scrollToBottomComponent={scrollToBottomComponent}
        alwaysShowSend={true}
        renderActions={() => (
          <View>
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
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  alignSelf: 'center',
                  color: colors.camera,
                }}>
                Choose From
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  borderBottomColor: '#D4D4D4',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  padding: 35,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 5,
                  }}
                  onPress={uploadCameraImage}>
                  <View
                    style={{
                      position: 'relative',
                      borderRadius: 20,
                      height: 40,
                      width: 40,
                      backgroundColor: '#2e64e515',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#fff',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      elevation: 2,
                    }}>
                    <MaterialCommunityIcons
                      name="camera"
                      size={25}
                      color={colors.camera}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.camera,
                      fontSize: 16,
                      padding: 12,
                    }}>
                    Camera
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 5,
                  }}
                  onPress={uploadImage}>
                  <View
                    style={{
                      position: 'relative',
                      borderRadius: 20,
                      height: 40,
                      width: 40,
                      backgroundColor: '#2e64e515',
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
                      color={colors.camera}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.camera,
                      fontSize: 16,
                      padding: 12,
                    }}>
                    Gallery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 5,
                  }}
                  onPress={uploadVideo}>
                  <View
                    style={{
                      position: 'relative',
                      borderRadius: 20,
                      overflow: 'hidden',
                      height: 40,
                      width: 40,
                      backgroundColor: '#2e64e515',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#fff',
                      shadowColor: '#fff',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      elevation: 2,
                    }}>
                    <MaterialCommunityIcons
                      name="video"
                      size={25}
                      color={colors.camera}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.camera,
                      fontSize: 16,
                      padding: 12,
                    }}>
                    Videos
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>

            <TouchableOpacity
              style={{
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => refRBSheet.current.open()}>
              <Entypo name="attachment" size={25} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        renderMessageImage={renderMessageImage}
        renderMessageVideo={renderMessageVideo}
        onLongPress={onLongPress}
        renderInputToolbar={customtInputToolbar}
      />
    </View>
  );
};

export default ChatScreen;
