import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'relative'
    },
    textcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 16,
        backgroundColor: 'transparent',
        zIndex: 2
    },
    videocontainer: {
        zIndex: 1,
        position: 'absolute',
        width: width,
        height: height - 53
    },
    textreel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff'
    },
    bottomcontainer: {
        width: '100%',
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 1,
        padding: 10,
        bottom: '1%'
    },
    userinfocontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
        height: 60,
        padding: 5
    },
    userimg: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        marginRight: 5
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff'
    },
    text: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        marginLeft:5
    },
    rightcontainer: {
        backgroundColor: 'transparent',
        zIndex: 1,
        position: 'absolute',
        alignItems: 'center',
        zIndex: 1,
        bottom: '20%',
        right: 0,
    },
    rightouchcontainer: {
        alignItems: 'center',
        paddingRight: 8,
        padding: 4
    },
    comment: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginLeft: '5%'
    },
    followbtn: {
        width: width / 7,
        height: height / 34,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fff',
        marginLeft: '3%'
    },
    btntext: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff'
    }
})

export default styles