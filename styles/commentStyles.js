import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    card: {
        justifyContent: 'center',
        flex: 1,
        paddingTop: 8,
        paddingLeft: 8,
        backgroundColor: '#fff'
    },
    maincontainer: {
        width: '100%',
        justifyContent: 'center',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userinfocontainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 8
    },
    userinfo: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    userImg: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    userName: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 6,
        color: '#000'
    },
    commentext: {
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 6,
        maxWidth: '70%',
        color: '#242526'
    },
    textinput: {
        width: '90%',
        height: 40,
        borderRadius: 24,
        paddingLeft: 12,
        backgroundColor: '#ECECEC'
    },
    btn: {
        marginLeft: 4
    },
    btntxt: {
        color: '#3897f1',
        fontSize: 15,
        fontWeight: '500'
    },
});
