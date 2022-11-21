import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    searchcontainer: {
        width: '100%',
        height: 44,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    infocontainer: {
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: 'row',
    },
    textinput: {
        width: '90%',
        height: 35,
        borderRadius: 5,
        marginRight: '4%',
        backgroundColor: '#ECECEC',
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    iconcontainer: {
        height: 35,
        borderRadius: 5,
        marginLeft: '4%',
        backgroundColor: '#ECECEC',
        borderRightWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    usercontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    touchcontainer: {
        width: '100%',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
    textmaincontainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15,
        paddingLeft: 0,
        marginLeft: 10,
        width: 300,
    },
    namecontainer: {
        justifyContent: 'center',
        marginBottom: 5,
        marginRight: 20,
    },
    userimg: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2
    },
    username: {
        fontSize: 15,
        fontWeight: '400',
        color: '#000'
    },
    userabout: {
        fontSize: 14,
        fontWeight: '300',
        color: '#949494'
    }
})


export default styles