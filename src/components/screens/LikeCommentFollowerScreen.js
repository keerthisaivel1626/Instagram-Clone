import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import styles from '../../../styles/LCFStyles'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../../navigation/AuthProvider';

const LikeCommentFollowerScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [follower, setFollower] = useState([])
    const [comment, setComment] = useState([])
    const [like, setLike] = useState([])
    const [commentmsg, setCommentmsg] = useState([])

    const fetchFollower = async () => {
        await firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then((documentSnapshot) => {
                const { follower } = documentSnapshot.data()
                follower.map((item) => {
                    firestore()
                        .collection('users')
                        .doc(item)
                        .get()
                        .then((snapshot) => {
                            setFollower(snapshot.data())
                        }).catch(e => console.log(e))
                })
            }).catch(e => console.log(e))
    }

    const fetchLike = async () => {
        await firestore()
            .collection('posts')
            .where('userId', '==', user.uid)
            .get()
            .then((documentSnapshot) => {
                documentSnapshot.docs.forEach((doc) => {
                    const { likesbyusers } = doc.data()
                    likesbyusers.map((item) => {
                        firestore()
                            .collection('users')
                            .doc(item)
                            .get()
                            .then((snapshot) => {
                                setLike(snapshot.data())
                            }).catch(e => console.log(e))
                    })
                    firestore()
                        .collection('posts')
                        .doc(doc.id)
                        .collection('comments')
                        .get()
                        .then((snapshot) => {
                            snapshot.docs.forEach((doc) => {
                                setCommentmsg(doc.data())
                                const { commentbyusers } = doc.data()
                                firestore()
                                    .collection('users')
                                    .doc(commentbyusers)
                                    .get()
                                    .then((snapshot) => {
                                        setComment(snapshot.data())
                                    })
                            })
                        })
                })

            }).catch(e => console.log(e))
    }

    useEffect(() => {
        fetchFollower()
        fetchLike()

        return () => {
            fetchFollower()
            fetchLike()
        }
    }, [])

    const Likecurrentuserpost = () => {
        return (
            <>
                {like?.uid ?
                    <TouchableOpacity style={styles.touchcontainer} onPress={() => navigation.navigate("HomeProfile", { uid: like.uid, email: like.email })}>
                        <View style={styles.usercontainer}>
                            <Image style={styles.userimg} source={{ uri: like.userImg }} />
                            <View style={[styles.textmaincontainer, { width: 260 }]}>
                                <Text style={styles.username}>
                                    {like.fname}
                                </Text>
                                <Text style={styles.userabout}>
                                    like your post.
                                </Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                    : null
                }
            </>
        )
    }

    const Followcurrentuser = () => {
        return (
            <>
                {follower.uid ?
                    < TouchableOpacity style={styles.touchcontainer} onPress={() => navigation.navigate("HomeProfile", { uid: follower.uid, email: follower.email })}>
                        <View style={styles.usercontainer}>
                            <Image style={styles.userimg} source={{ uri: follower.userImg }} />
                            <View style={[styles.textmaincontainer, { width: 260 }]}>
                                <Text style={styles.username}>
                                    {follower.fname}
                                </Text>
                                <Text style={styles.userabout}>
                                    started following you.
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity >
                    : null
                }
            </>
        )

    }

    const Commentcurrentuserpost = () => {
        return (
            <>
                {comment.uid ?
                    <TouchableOpacity style={styles.touchcontainer} onPress={() => navigation.navigate("HomeProfile", { uid: comment.uid, email: comment.email })}>
                        <View style={styles.usercontainer}>
                            <Image style={styles.userimg} source={{ uri: comment.userImg }} />
                            <View style={[styles.textmaincontainer, { width: 260 }]}>
                                <Text style={styles.username}>
                                    {comment.fname}
                                </Text>
                                <Text style={styles.userabout}>
                                    comment on your post.
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    :
                    null
                }
            </>
        )
    }

    return (
        <View style={styles.container}>
            <Followcurrentuser />
            <View style={{ width: '100%', height: '1%' }} />
            <Likecurrentuserpost />
            <View style={{ width: '100%', height: '1%' }} />
            <Commentcurrentuserpost />
        </View>
    )
}

export default LikeCommentFollowerScreen