import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, Image } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import Picture from '../components/Picture';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import pants from "./pants.png";

const API_URL = "http://107.22.249.15:8080";

const window = Dimensions.get("window");
const pictureDimension = (window.width - 20);
export default function ModalScreen({ navigation, route }: any) {
  const item = route.params.item;
  const [loading, setLoading] = React.useState(false);
  const isPants = item.includes("pants");
  const isShirt = item.includes("shirts");

  const changeCategory = async (dest: string) => {
    if (isShirt && dest == "shirts") return;
    if (isPants && dest == "pants") return;
    if (loading) return;
    setLoading(true);
    let res = await fetch(`${API_URL}/moveitem?item=${item}&dest=${dest}`);
    setLoading(false);
    if (res.ok) {
      navigation.navigate("Closet");
    }
  }

  const deleteItem = async () => {
    if (loading) return;
    setLoading(true);
    let res = await fetch(`${API_URL}/deleteitem?item=${item}`);
    setLoading(false);
    if (res.ok) {
      navigation.navigate("Closet");
    }
  }


  return (
    <View style={ styles.container }>
      <Picture height={ pictureDimension } width={ pictureDimension } imageKey={ item } />
      <Text style={ { textAlign: "center", fontSize: 20, } }>Categorize</Text>
      <View style={ styles.bottomContainer }>
        <View style={ styles.buttons }>
          <TouchableOpacity onPress={ () => { changeCategory("shirts") } } style={ [styles.button, { backgroundColor: isShirt ? "#00cc22" : "grey" }] }>
            <MaterialCommunityIcons name="tshirt-v" size={ 50 } />
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => { changeCategory("pants") } } style={ [styles.button, { backgroundColor: isPants ? "#00cc22" : "grey" }] }>
            <Image style={ { width: 50, height: 50 } } source={ pants }></Image>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={ () => deleteItem() } style={ styles.textButton }><Text style={ { textAlign: "center", fontSize: 20, fontWeight: "bold" } }>Delete</Text></TouchableOpacity>
      </View>
      <StatusBar style={ Platform.OS === 'ios' ? 'light' : 'auto' } />
    </View>
  );
}

const styles = StyleSheet.create({
  textButton: {
    borderWidth: 1,
    flex: .5,
    width: "50%",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "#cc0000",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#F0E5D0",
    marginHorizontal: 10,
    borderWidth: 1,
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  bottomContainer: {
    marginBottom: 30,
    marginTop: 10,
    flex: 1,
    width: window.width,
    alignItems: "center"
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
