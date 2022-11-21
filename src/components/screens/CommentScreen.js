import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../../navigation/AuthProvider';
import { Styles } from '../../../styles/commentStyles'
import auth from '@react-native-firebase/auth';

const CommentScreen = ({ route }) => {
    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [userinfo, setUserInfo] = useState()

    const onSendComment = async () => {
        await
            firestore()
                .collection("posts")
                .doc(route.params)
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
                .collection("posts")
                .doc(route.params)
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

    return (
        <View style={Styles.container}>
            <View style={Styles.card}>
                <FlatList
                    data={comments}
                    renderItem={({ item }) =>
                        <View style={Styles.userinfocontainer}>
                            <View style={Styles.userinfo}>
                                <Image style={Styles.userImg} source={{ uri: item.userimg }} />
                                <Text style={Styles.userName}>{item.name}</Text>
                                <Text style={Styles.commentext}>{item.comment}</Text>
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
                <TouchableOpacity style={Styles.btn} onPress={onSendComment}>
                    <Text style={Styles.btntxt}>post</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CommentScreen