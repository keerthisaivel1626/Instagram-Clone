import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    card: {
        width: width / 2.5,
        height: height / 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ECECEC',
        padding: '9%',
        marginLeft: 1,
        marginRight: 1,
        marginTop: '2%',
        marginBottom: '2%'
    },
    touchcontainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    userBtn: {
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal:'14%',
        marginHorizontal: 5,
        borderColor:'#ECECEC',
        marginTop:'10%'
    },
    userBtnTxt: {
        fontSize: 16,
        fontWeight: '500',
    },
    userimg: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        resizeMode: 'cover',
        marginBottom: '5%'
    },
    username: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginBottom: '5%'
    }
})

