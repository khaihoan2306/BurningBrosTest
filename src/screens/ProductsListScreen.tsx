import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ProductItem, ProductItemProps} from '../components';
import {useQuery} from '@tanstack/react-query';
import {LIMIT_FETCHING_ITEMS, TYPING_DELAY} from '../constants';
import {delay} from '../utils';
import _ from 'lodash';

export const ProductsListScreen = () => {
  const [skip, setSkip] = useState(0);
  const [products, setProducts] = useState([]);
  const [isStartFetching, setIsStartFetching] = useState(false);
  const [searchingWord, setSearchingWord] = useState('');

  const {isPending, error, data} = useQuery({
    queryKey: ['products', skip, searchingWord],
    queryFn: async () => {
      const response = await fetch(
        searchingWord?.length > 0
          ? `https://dummyjson.com/products/search?q=${searchingWord}&limit=${LIMIT_FETCHING_ITEMS}&skip=${skip}&select=title,price,thumbnail`
          : `https://dummyjson.com/products?limit=${LIMIT_FETCHING_ITEMS}&skip=${skip}&select=title,price,thumbnail`,
      );
      return await response.json();
    },
  });

  useEffect(() => {
    if (data) {
      setProducts(products.concat(data.products));
    }
  }, [data]);

  const renderItem = ({item}: ListRenderItemInfo<ProductItemProps>) => {
    return <ProductItem {...item} />;
  };

  const FooterComponent = () => {
    if (skip >= data?.total && products.length > 0)
      return <Text style={styles.endText}>This is the end of list</Text>;
    else if (isPending || isStartFetching)
      return <ActivityIndicator size="large" />;
  };

  const onLoadMore = async () => {
    if (isStartFetching) return;
    if (skip < data?.total) {
      setIsStartFetching(true);
      await delay(1000);
      setSkip(skip + LIMIT_FETCHING_ITEMS);
      setIsStartFetching(false);
    }
  };

  const onSearch = (text: string) => {
    setSkip(0);
    setProducts([]);
    setSearchingWord(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter product name ...."
        onChangeText={_.debounce(onSearch, TYPING_DELAY)}
      />
      {isPending && products.length === 0 ? (
        <ActivityIndicator style={styles.loading} size="large" />
      ) : data?.products?.length == 0 ? (
        <View style={styles.error}>
          <Text>Data not found</Text>
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => `${item.id}-${index}`}
          data={products}
          renderItem={renderItem}
          ListFooterComponent={FooterComponent}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  endText: {
    marginVertical: 10,
    textAlign: 'center',
  },
  container: {
    paddingBottom: 50,
    flex: 1,
  },
  loading: {
    flex: 1,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#BABABA',
    borderRadius: 25,
    margin: 10,
    paddingHorizontal: 20,
  },
});
