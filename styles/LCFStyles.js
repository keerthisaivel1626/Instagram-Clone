import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    usercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '3%'
    },
    touchcontainer: {
        width: '100%',
        alignItems: 'center',
    },
    textmaincontainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 300,
        paddingLeft: 3,
    },
    userimg: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2
    },
    username: {
        fontSize: 15,
        fontWeight: '400',
        color: '#000'
    },
    userabout: {
        fontSize: 14,
        fontWeight: '300',
        color: '#242526'
    },
    postimg: {
        width: 40,
        height: 40,
    }
})


export default styles