import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import React, { useEffect } from "react";
import EditScreenInfo from '../components/EditScreenInfo';
import { useHeaderHeight } from "@react-navigation/elements";
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ClothingItem from '../components/ClothingItem';
import fetchUncategorizedClothes, { fetchPants, fetchShirts } from '../calls/fetchClothes';

export default function Closet({ navigation }: RootTabScreenProps<"Closet">) {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F0E5D0';
  let [uncategorized, setUncategorized] = React.useState<any[]>([]);
  let [shirts, setShirts] = React.useState<any[]>([]);
  let [pants, setPants] = React.useState<any[]>([]);

  const updateClothing = () => {
    fetchUncategorizedClothes().then(setUncategorized);
    fetchShirts().then(setShirts);
    fetchPants().then(setPants);
  }

  const insets = useSafeAreaInsets();
  useEffect(() => {
    updateClothing();
    setInterval(() => {
      console.log("getting clothing");
      updateClothing();
    }, 1000);
  }, [])
  return (
    <ScrollView bounces={ false } style={ [styles.container, { backgroundColor: bgColor, padding: 10, }] } >
      {/* Uncategorized */ }
      { uncategorized.length > 0 && <View style={ [styles.flex, { backgroundColor: bgColor }] }>
        <Text style={ styles.title }>Uncategorized</Text>
        <View style={ styles.clothingList }>
          { uncategorized.map((item: any, index) => {
            return <ClothingItem onPress={ () => { navigation.navigate("Modal", { item }) } } itemLink={ item } key={ index } />
          }) }
        </View>
      </View> }
      {/* Shirts */ }
      <View style={ [styles.flex, { backgroundColor: bgColor }] }>
        <Text style={ styles.title }>Shirts</Text>
        <View style={ styles.clothingList }>
          { shirts.map((item: any, index) => {
            return <ClothingItem onPress={ () => { navigation.navigate("Modal", { item }) } } itemLink={ item } key={ index } />
          }) }
        </View>
      </View>
      {/* Pants */ }
      <View style={ [styles.flex, { backgroundColor: bgColor, paddingBottom: 10 }] }>
        <Text style={ styles.title }>Pants</Text>
        <View style={ styles.clothingList }>
          { pants.map((item: any, index) => {
            return <ClothingItem onPress={ () => { navigation.navigate("Modal", { item }) } } itemLink={ item } key={ index } />
          }) }
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  clothingList: {
    backgroundColor: "transparent",
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flex: {
    flex: 1
  },
  container: {
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
