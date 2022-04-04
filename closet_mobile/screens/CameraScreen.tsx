import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button, useColorScheme } from 'react-native';
import { Camera } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const window = Dimensions.get("window");

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [canTakePhoto, setCanTakePhoto] = useState(false);
  const camera = useRef<Camera>(null);
  const [photo, setPhoto] = useState<any>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCaptureIn = async () => {
    if (canTakePhoto && camera.current) {
      const photo = await camera.current.takePictureAsync();
      console.log(photo);
      setPhoto(photo);
    }
  };

  const fetchImageFromUri = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };


  const uploadImage = async () => {
    if (!photo) return;
    console.log("uploading image");
    let blob = await fetchImageFromUri(photo.uri);

    try {
      let res = await fetch("http://107.22.249.15:8080/upload", {
        method: 'POST',
        body: blob
      });
      console.log(res);
    } catch (e) {
      console.log("error");

      console.log(e);
    }

  }


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (photo) {
    return <View style={ [styles.confirmContainer, { paddingTop: insets.top, backgroundColor: colorScheme === "dark" ? "#121212" : "white" }] }>
      <Text style={ [styles.title, { color: colorScheme === "dark" ? "white" : "black" }] }>Confirm Upload</Text>
      <Image width={ window.width } height={ window.height / 2 } source={ { uri: `${photo.uri}` } } style={ { flex: 1, width: window.width, height: window.height / 2 } } />
      <View style={ styles.bottomButtons }>
        <TouchableOpacity onPress={ () => { setPhoto(null) } } >
          <MaterialCommunityIcons name="camera-retake" size={ 40 } color={ colorScheme === "dark" ? "white" : "black" } />
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => {
          console.log("hello world");
          uploadImage();
        } }>
          <AntDesign name="upload" size={ 40 } color={ colorScheme === "dark" ? "white" : "black" } />
        </TouchableOpacity>
      </View>
    </View>

  }

  return (
    <View style={ styles.container }>
      <Camera
        ref={ camera }
        style={ styles.camera } type={ Camera.Constants.Type.back } onCameraReady={ () => setCanTakePhoto(true) }>
        <TouchableOpacity style={ styles.buttonContainer } onPress={ () => {
          handleCaptureIn();
        } }>
        </TouchableOpacity>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomButtons: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  confirmContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 75,
    height: 75,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "black",
  }
})