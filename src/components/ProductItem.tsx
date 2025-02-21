import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {images} from '../assets/images';

export interface ProductItemProps {
  id: string;
  title?: string;
  price?: number;
  thumbnail?: string;
}

export const ProductItem = (props: ProductItemProps) => {
  const {title, price, thumbnail} = props;
  return (
    <TouchableOpacity style={styles.container}>
      <FastImage
        style={styles.image}
        resizeMode="contain"
        defaultSource={images.empty}
        source={{uri: thumbnail}}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text>{price} $</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  textContainer: {
    marginLeft: 10,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 10,
  },
});
