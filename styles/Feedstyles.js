import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
  },
  UserInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 15,
  },
  UserImg: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  UserName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000'
  },
  UserInfoText: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 8,
  },
  PostTime: {
    fontSize: 12,
    color: '#949494'
  },
  Posttext: {
    fontSize: 14,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 12,
    color: '#000'
  },
  PostImg: {
    width: '100%',
    height: 250,
    // marginTop: 15,
    resizeMode: 'cover',
  },
  InteractionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  Interaction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  InteractionText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 5,
    color: '#000'
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#D9D9D9',
    textAlign: 'center'
  }
});
