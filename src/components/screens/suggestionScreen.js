import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { styles } from '../../../styles/SuggestionCardStyles'
import { AuthContext } from '../../../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native'


const SuggestionScreen = ({ item }) => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation()

    const onfollow = () => {
        const currentfollower = !item.follower.includes(user.uid);
        const currentfollowing = !item.follower.includes(user.uid);

        const following = firestore()
            .collection('users')
            .doc(user.uid)

        const follower = firestore()
            .collection('users')
            .doc(item.uid)

        const batch = firestore().batch()
        batch.update(follower, { follower: currentfollower ? firestore.FieldValue.arrayUnion(user.uid) : firestore.FieldValue.arrayRemove(user.uid) })
        batch.update(following, { following: currentfollowing ? firestore.FieldValue.arrayUnion(item.uid) : firestore.FieldValue.arrayRemove(item.uid) })
        batch.commit();
    }

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.touchcontainer} onPress={() => navigation.navigate('HomeProfile', { uid: item.uid, email: item.email })}>
                <Image
                    style={styles.userimg}
                    source={{ uri: item ? item.userImg : 'https://1.bp.blogspot.com/-BZbzJ2rdptU/XhWLVBw58CI/AAAAAAAADWI/DnjRkzns2ZQI9LKSRj9aLgB4FyHFiZn_ACEwYBhgL/s1600/yet-not-died-whatsapp-dp.jpg' }} />
                <Text style={styles.username}>
                    {item.fname}
                </Text>
            </TouchableOpacity>
            <>
                {item.follower.includes(user.uid) ?
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
        </View >

    )
}

export default SuggestionScreen