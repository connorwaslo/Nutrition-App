import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, Permissions } from 'expo';
import credentials from '../google-vision-creds';

export default class HomeScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photo: null,
    label: null
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _renderCamera = () => (
    <Camera
      ref={ref => this.camera = ref }
      style={{ flex: 1 }}
      type={this.state.type}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => {
            this.setState({
              type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            });
          }}>
          <Text
            style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
            {' '}Flip{' '}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._snap.bind(this)}
          style={{
            flex: 0.1,
            alignSelf: 'flex-end',
            alignItems: 'center'
          }}>
          <Text style={{ fontSize: 32, marginBottom: 10, color: 'white' }}>O</Text>
        </TouchableOpacity>
      </View>
    </Camera>
  );

  _renderPhoto = () => (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: this.state.photo.uri }}
        style={{ flex: 1 }}
      />
      { this.state.label ? <Text>{this.state.label}</Text> : null }
    </View>
  );

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {!this.state.photo ? this._renderCamera() : this._renderPhoto()}
        </View>
      );
    }
  }

  _snap = async () => {
    if (this.camera) {
      const options = {
        quality: 1, base64: true, fixOrientation: false, exif: true
      };

      await this.camera.takePictureAsync(options)
        .then(async (photo) => {
          console.log(photo);
          this.setState({ photo: photo });

          const body = {
            requests:[
              {
                image:{
                  content: photo.base64,
                },
                features:[
                  {
                    type: 'LABEL_DETECTION',
                    maxResults: 30,
                  }
                ]
              },
            ],
          };

          const key = credentials.API_KEY;
          const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
          const parsed = await response.json();
          console.log(parsed);

          let showDescriptions = '';

          let descriptions = parsed.responses[0].labelAnnotations;
          for (let i = 0; i < descriptions.length; i++) {
            console.log(descriptions[i].description);
            showDescriptions += descriptions[i].description + ', ';
          }

          this.setState({
            label: showDescriptions
          });
        });
    }
  }
}

/*
import React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Expo, { WebBrowser } from 'expo';
import google_creds from '../google-vision-creds';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    imageUri: null,
    label: null
  };

  render() {
    let imageView = null;
    if (this.state.imageUri) {
      imageView = (
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.imageUri }}
        />
      )
    }

    let labelView = null;
    if (this.state.label) {
      labelView = (
        <Text style={{ margin: 5 }}>
          {this.state.label}
        </Text>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        {imageView}
        {labelView}
        <TouchableOpacity
          style={{ margin: 5, padding: 5, backgroundColor: '#ddd' }}
          onPress={this._pickImage}>
          <Text>take a picture!</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  _pickImage = async () => {
    const {
      cancelled,
      uri,
      base64,
    } = await Expo.ImagePicker.launchImageLibraryAsync({
      base64: true,
    });
    if (!cancelled) {
      this.setState({
        imageUri: uri,
        label: '(loading...)',
      });
    }

    const body = {
      requests:[
        {
          image:{
            content: base64,
          },
          features:[
            {
              type: 'LABEL_DETECTION',
              maxResults: 1,
            }
          ]
        },
      ],
    };

    const key = google_creds['API_KEY'];
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const parsed = await response.json();
    this.setState({
      label: parsed.responses[0].labelAnnotations[0].description,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? '20vh' : '5%'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
*/
