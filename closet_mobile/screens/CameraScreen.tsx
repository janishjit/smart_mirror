import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Button, useColorScheme } from 'react-native';
import { Camera } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

const window = Dimensions.get("window");

enum ViewState {
  CAMERA,
  POST_UPLOAD
}

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [canTakePhoto, setCanTakePhoto] = useState(false);
  const [viewState, setViewState] = useState(ViewState.CAMERA);
  const camera = useRef<Camera>(null);
  const [photo, setPhoto] = useState<any>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'white' : 'black';
  const bgColor = colorScheme === 'dark' ? '#121212' : '#F0E5D0';
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCaptureIn = async () => {
    if (canTakePhoto && camera.current) {
      const photo = await camera.current.takePictureAsync({ quality: 0.5 });
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
    let uploadURL = await fetch("https://o0pbxkc70l.execute-api.us-east-1.amazonaws.com/uploads");
    let json = await uploadURL.json();
    let signedURL = json.uploadURL;
    let key = json.Key;

    let blob = await fetchImageFromUri(photo.uri);

    let res = await fetch(signedURL, {
      method: 'PUT',
      headers: {
        'Content-Type': blob.type,
      },
      body: blob
    });

    if (res.ok) {
      console.log("uploaded");
      setPhoto(null);
      setViewState(ViewState.POST_UPLOAD);
    }
    else {
      console.log("error uploading image");
    }
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (viewState === ViewState.POST_UPLOAD) {
    return (
      <View style={ [styles.container, styles.postUploadContainer, { backgroundColor: bgColor }] }>
        <Text style={ [styles.leftTitle, { color: textColor, paddingTop: insets.top }] }>Item Uploaded!</Text>
        <Text style={ [styles.subtitle, { color: textColor }] }>Categorize it in your <Text style={ { fontWeight: "bold" } }>Closet</Text></Text>
        <View style={ [styles.container, styles.body] }>
          <TouchableOpacity style={ styles.textButton }>
            <Text style={ { color: textColor, textAlign: 'center', fontWeight: "bold", fontSize: 15 } }>Take Me There</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ [styles.textButton, { backgroundColor: "#1BBBFB" }] } onPress={ () => { setPhoto(null); setViewState(ViewState.CAMERA) } }>
            <Text style={ { color: textColor, textAlign: 'center', fontWeight: "bold", fontSize: 15 } }>Add Another Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (photo) {
    return <View style={ [styles.confirmContainer, { paddingTop: insets.top, backgroundColor: bgColor }] }>
      <Text style={ [styles.title, { color: textColor }] }>Confirm Upload</Text>
      <Image width={ window.width } height={ window.height / 2 } source={ { uri: `${photo.uri}` } } style={ { flex: 1, width: window.width, height: window.height / 2 } } />
      <View style={ styles.bottomButtons }>
        <TouchableOpacity onPress={ () => { setPhoto(null) } } >
          <MaterialCommunityIcons name="camera-retake" size={ 40 } color={ textColor } />
        </TouchableOpacity>
        <TouchableOpacity onPress={ () => {
          uploadImage();
        } }>
          <AntDesign name="upload" size={ 40 } color={ textColor } />
        </TouchableOpacity>
      </View>
    </View>

  }

  return (
    <View style={ [styles.container, { backgroundColor: bgColor }] }>
      <Camera
        zoom={ 0 }
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
  body: {
    margin: 10,
  },
  textButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#6DCA30',
    flex: 0,
    margin: 10
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
  },
  postUploadContainer: {
    padding: 10,
  },
  leftTitle: {
    fontSize: 35,
    fontWeight: 'bold',
  },
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