import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ProductItem, ProductItemProps} from '../components';
import {useQuery} from '@tanstack/react-query';
import {LIMIT_FETCHING_ITEMS} from '../constants';
import {delay} from '../utils';

export const ProductsListScreen = () => {
  const [skip, setSkip] = useState(0);
  const [products, setProducts] = useState([]);
  const [isStartFetching, setIsStartFetching] = useState(false);

  const {isPending, error, data} = useQuery({
    queryKey: ['products', skip],
    queryFn: async () => {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${LIMIT_FETCHING_ITEMS}&skip=${skip}&select=title,price,thumbnail`,
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
    if (skip >= data?.total)
      return <Text style={styles.endText}>This is the end of list</Text>;
    else if (isPending || isStartFetching)
      return <ActivityIndicator size="large" />;
  };

  const onLoadMore = async () => {
    if (isStartFetching) return;
    if (skip < data?.total) {
      setIsStartFetching(true);
      await delay(1000);
      setSkip(skip + 20);
      setIsStartFetching(false);
    }
  };

  if (isPending && products.length === 0)
    return <ActivityIndicator style={styles.loading} size="large" />;

  if (error) return <View></View>;

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => `${item.id}-${index}`}
        data={products}
        renderItem={renderItem}
        ListFooterComponent={FooterComponent}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
      />
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
  },
  loading: {
    flex: 1,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
