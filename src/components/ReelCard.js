import { View, TouchableOpacity, Dimensions, Text, Image, TextInput, FlatList } from 'react-native';
import React, { useRef, useEffect, useState, useContext } from 'react';
import Video from 'react-native-video';
import styles from '../../styles/ReelStyles';
import { Styles } from '../../styles/commentStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';
import Share from 'react-native-share';
import RBSheet from 'react-native-raw-bottom-sheet';
import auth from '@react-native-firebase/auth';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const ReelCard = ({ currindex, item, index, ondelete }) => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation()
    const [users, setUser] = useState(null)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [userinfo, setUserInfo] = useState(null)

    const videoRef = useRef(null)
    const refRBSheet = useRef();

    const onBuffer = (e) => {
        console.log("buffering", e)
    }

    const onError = (e) => {
        console.log("error", e)
    }

    useEffect(() => {
        if (!!videoRef.current) {
            videoRef.current.seek(0)
        }
    }, [currindex])

    const fetchUser = async () => {
        try {
            await firestore()
                .collection('users')
                .doc(item.userId)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        setUser(documentSnapshot.data())
                    }
                })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const onLike = () => {
        const currentlikes = !item.likesbyusers.includes(user.uid);
        firestore()
            .collection('reels')
            .doc(item.id)
            .update({
                likesbyusers: currentlikes
                    ? firestore.FieldValue.arrayUnion(user.uid)
                    : firestore.FieldValue.arrayRemove(user.uid),
            })
            .then(() => {
                console.log('reellike');
            })
            .catch(er => {
                console.log('faild', er);
            });
    }

    const onComment = async () => {
        await
            firestore()
                .collection("reels")
                .doc(item.id)
                .collection('comments')
                .add({
                    uid: auth().currentUser.uid,
                    name: userinfo.fname,
                    email: userinfo.email,
                    commentbyusers: userinfo.uid,
                    userimg: userinfo.userImg,
                    comment,
                    createAt: new Date()
                }).then(() => {
                    console.log('sshhs')
                }).catch(e => console.log(e))
    }

    const getcomment = async () => {
        await
            firestore()
                .collection("reels")
                .doc(item.id)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comment = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return { ...data }
                    })
                    setComments(comment)
                })
                .catch(e => console.log(e))
    }

    useEffect(() => {
        getcomment()
    }, [])

    useEffect(() => {
        try {
            firestore()
                .collection('users')
                .doc(user.uid)
                .onSnapshot((snap) => {
                    setUserInfo(snap.data())
                })
        } catch (e) {
            console.log(e)
        }
    }, [])

    const ShareData = async () => {
        const ShareOptions = {
            url: item.reelImg || item.reelvideo,
        };
        try {
            const ShareRes = await Share.open(ShareOptions);
            console.log('✌✌✌✌res', JSON.stringify(ShareRes));
        } catch (er) {
            console.log('❌❌❌err', er);
        }
    };

    const onfollow = () => {
        const currentfollower = !users.follower.includes(user.uid);
        const currentfollowing = !users.follower.includes(user.uid);

        const following = firestore()
            .collection('users')
            .doc(user.uid)

        const follower = firestore()
            .collection('users')
            .doc(users.uid)

        const batch = firestore().batch()
        batch.update(follower, { follower: currentfollower ? firestore.FieldValue.arrayUnion(user.uid) : firestore.FieldValue.arrayRemove(user.uid) })
        batch.update(following, { following: currentfollowing ? firestore.FieldValue.arrayUnion(users.uid) : firestore.FieldValue.arrayRemove(users.uid) })
        batch.commit();
    }

    return (
        <View style={[styles.container, { height: height - 52, borderBottomWidth: 1, borderBottomColor: '#000' }, index % 2 == 0 ? { backgroundColor: "#000" } : { backgroundColor: "#000" }]}>
            <View style={styles.textcontainer}>
                <Text style={styles.textreel}>Reels</Text>
                <Feather name="camera" color="#fff" size={26} onPress={() => navigation.navigate('ReelPost')} />
            </View>
            {item.reelImg ?
                <Image style={[styles.videocontainer, { resizeMode: "contain" }]} source={{ uri: item.reelImg }} />
                :
                <Video
                    style={styles.videocontainer}
                    ref={videoRef}
                    onBuffer={onBuffer}
                    onError={onError}
                    source={{ uri: item ? item.reelvideo || 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                    resizeMode="cover"
                    repeat
                    rate={1.0}
                    volume={1.0}
                    paused={currindex !== index}
                />
            }
            <View style={styles.bottomcontainer}>
                <View style={styles.userinfocontainer}>
                    <Image style={styles.userimg} source={{
                        uri: users
                            ? users.userImg ||
                            'https://1.bp.blogspot.com/-BZbzJ2rdptU/XhWLVBw58CI/AAAAAAAADWI/DnjRkzns2ZQI9LKSRj9aLgB4FyHFiZn_ACEwYBhgL/s1600/yet-not-died-whatsapp-dp.jpg'
                            : 'https://1.bp.blogspot.com/-BZbzJ2rdptU/XhWLVBw58CI/AAAAAAAADWI/DnjRkzns2ZQI9LKSRj9aLgB4FyHFiZn_ACEwYBhgL/s1600/yet-not-died-whatsapp-dp.jpg',
                    }} />
                    <TouchableOpacity onPress={() => navigation.navigate('HomeProfile', { uid: item.userId, email: item.email })}>
                        <Text style={styles.username}>
                            {users ? users.fname || 'User' : 'User'}
                        </Text>
                    </TouchableOpacity>
                    {user.uid != users?.uid ?
                        <>
                            {users?.follower.includes(user.uid) ?
                                <>
                                    <TouchableOpacity style={[styles.followbtn, { width: width / 5 }]} onPress={onfollow}>
                                        <Text style={styles.btntext}>
                                            Following
                                        </Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    <TouchableOpacity style={styles.followbtn} onPress={onfollow}>
                                        <Text style={styles.btntext}>
                                            Follow
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </>
                        :
                        null
                    }

                </View>
                <Text style={styles.text}>{item.text}</Text>
            </View>
            <View style={styles.rightcontainer}>
                <TouchableOpacity style={styles.rightouchcontainer} onPress={onLike}>
                    {item.likesbyusers.includes(user.uid) ? (
                        <Ionicons name="heart" size={30} color="red" />
                    ) : (
                        <Ionicons name="heart-outline" size={30} color="#fff" />
                    )}
                    <Text style={styles.username}>
                        {item.likesbyusers.length}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightouchcontainer} onPress={() => refRBSheet.current.open()}>
                    <Ionicons name="md-chatbubble-outline" color="#fff" size={30} />
                    <Text style={styles.username}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightouchcontainer} onPress={ShareData}>
                    <MaterialCommunityIcons name="share" color="#fff" size={30} />
                </TouchableOpacity>
                {user.uid === item.userId ?
                    <TouchableOpacity style={styles.rightouchcontainer} onPress={() => ondelete(item.id)}>
                        <MaterialCommunityIcons name="delete-outline" color="#fff" size={30} />
                    </TouchableOpacity>
                    :
                    null
                }
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
                height={height / 1.5}>
                <Text style={styles.comment}>Comments</Text>
                <View style={[Styles.container, { padding: 3 }]}>
                    <View style={Styles.card}>
                        <FlatList
                            data={comments}
                            renderItem={({ item }) =>
                                <View style={Styles.userinfocontainer}>
                                    <View style={Styles.userinfo}>
                                        <Image style={Styles.userImg} source={{ uri: item.userimg }} />
                                        <Text style={Styles.userName}>{item.name}</Text>
                                        <Text style={[Styles.commentext, { maxWidth: '50%' }]}>{item.comment}</Text>
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={Styles.maincontainer}>
                        <TextInput style={Styles.textinput}
                            placeholder={user.email}
                            multiline={true}
                            value={comment}
                            onChangeText={(comment) => setComment(comment)}
                        />
                        <TouchableOpacity style={Styles.btn} onPress={onComment}>
                            <Text style={Styles.btntxt}>post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
        </View >
    )
}

export default ReelCard