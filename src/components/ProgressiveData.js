import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Video from 'react-native-video';



export const ProgressiveImage = ({ source, defaultImageSource, ...props }) => {
  return (
    <View style={styles.container}>
      <Image
        {...props}
        source={source ? source : defaultImageSource}
        // defaultSource={defaultImageSource}
      />
    </View>
  );

}

export const ProgressiveVideo = ({ poster, source, ...props }) => {
  const [paused, setPaused] = useState(false);

  const playPaused = () => {
    setPaused(!paused);
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={playPaused}>
        <Video
          {...props}
          source={source}
          paused={paused}
          poster={poster}
        />
      </TouchableWithoutFeedback>
    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
  },
});
