import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  maincontainer:{
    flexDirection:'row', 
  justifyContent: 'space-between',
  alignItems: 'center',
  margintop:'6%'
},
  userImg: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginLeft:'4%'
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    marginLeft:'4%',
    color:'#000'
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 6,
    marginLeft:'4%',
    color:'#000'
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 6,
  },
  userBtnprofile: {
    width: '95%',
    justifyContent: 'center',
    alignItems:'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 6,
    marginHorizontal: 5,
    borderColor:'#ECECEC',
    marginTop:'10%'
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
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '65%',
    marginVertical: 10,
    marginRight:'5%'
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});
