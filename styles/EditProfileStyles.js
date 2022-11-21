import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor:'#fff'
  },
  actioncontainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor:'#fafafa',
    borderColor:'#949494'
  },
  divider: {
    borderRightWidth: 1,
    height: '110%',
  },
  icon: {
    paddingLeft: 8,
  },
  textInput: {
    flex: 1,
    padding: 10,
    width: '100%',
    height: 42,
  },
  imgbg: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  chooseimg: {
    textAlign: 'center',
    padding: 6,
    fontSize: 18,
    color:'#000'
  },
});
