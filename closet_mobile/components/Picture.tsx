import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableWithoutFeedback, Text, View, Dimensions, TouchableOpacity } from "react-native";

import noAvatar from "./notFound.png";
const window = Dimensions.get("window");
const pictureDimension = (window.width - 90) / 3;


type PictureProps = {
  imageKey: string;
  onPress?: () => void;
  height?: number;
  width?: number;
};

const Picture = ({
  imageKey,
  onPress,
  height,
  width,
}: PictureProps) => {
  const [uri, setUri] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const sizeObj = {
    height: height || pictureDimension,
    width: width || pictureDimension,
  }
  /** Get image from cache first, download it if there is an update  */
  useEffect(() => {
    const checkCache = async () => {
      setImageLoading(true);
      const safePathName = imageKey.replace(/^.*[\\/]/, "");
      const path = `${FileSystem.cacheDirectory}${safePathName}`;
      const image = await FileSystem.getInfoAsync(path);
      if (image.exists) {
        setUri(() => image.uri);
        setImageLoading(() => false);
        return;
      }
      setTimeout(async () => {
        const newImage = await FileSystem.downloadAsync(imageKey, path);
        Image.getSize(imageKey, async () => {
          setUri(newImage.uri);
          setImageLoading(false);
        }, () => {
          setUri("");
          setImageLoading(false);
        });
      }, 1000);
    };

    if (imageKey) { checkCache(); }
  }, [imageKey]);

  const DefaultAvatar = () => (
    <View style={ styles.profileContainer }>
      <Image
        source={ uri ? { uri } : noAvatar }
        style={ { ...sizeObj } }
      />
    </View>
  );

  if (!uri) return <DefaultAvatar />;

  return (
    imageLoading ? (
      <View style={ styles.profileContainer }>
        <Image
          source={ uri ? { uri } : noAvatar }
          style={ { ...sizeObj } }
        />
      </View>
    ) : (
      <TouchableOpacity style={ [styles.profileContainer] } onPress={ onPress }>
        <Image
          source={ uri ? { uri } : noAvatar }
          style={ { ...sizeObj, borderRadius: 5 } }
        />
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    margin: 5,
    backgroundColor: "white",
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },
});

export default Picture;
