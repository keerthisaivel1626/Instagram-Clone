import {View} from 'react-native';
import React from 'react';
import  { ProgressiveImage, ProgressiveVideo } from './ProgressiveData';

const UserPostData = ({item}) => {
  // console.log('item',item)
  return (
    <View
      style={{
        width: 120,
        height: 120,
        margin: 1,
        backgroundColor: '#2e64e515',
      }}>
      {item.postImg ? (
        <ProgressiveImage
          defaultImageSource={{
            uri: 'https://www.touchtaiwan.com/images/default.jpg',
          }}
          source={{uri: item.postImg}}
          style={{width: '100%', height: 150}}
          resizeMode="cover"
        />
      ) : (
       null
      )}
      {item.postvideo  ? (
        <ProgressiveVideo
        poster={'https://www.cloudlessons.net/images/video-thumb.png'}
        source={{uri: item.postvideo}}
        style={{width: '100%', height: 150}}
        resizeMode="cover"
        
      />
      ) : (
       null
      )}
    </View>
  );
};

export default UserPostData;
