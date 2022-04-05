import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { View, Text } from "./Themed";
import FastImage from "react-native-fast-image";
import Picture from "./Picture";
const window = Dimensions.get("window");
const pictureDimension = (window.width - 80) / 3;
type ClothingItemProps = {
  itemLink?: string;
  onPress?: () => void;
};

const ClothingItem = ({ onPress, itemLink }: ClothingItemProps) => {
  return (
    <Picture onPress={ onPress } imageKey={ itemLink || "" } />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    height: pictureDimension,
    width: pictureDimension,
    margin: 10,
  }
});

export default ClothingItem;