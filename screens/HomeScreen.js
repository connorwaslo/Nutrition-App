import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera, Permissions } from 'expo';
import credentials from '../google-vision-creds';
import RadioButton from "../components/RadioButton";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photo: null,
    label: null,
    isTakingImage: false
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

        <View style={{ position: 'absolute', left: '45%', right: '45%', bottom: 5 }}>
          <TouchableOpacity
            onPress={this._snap.bind(this)}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              textAlign: 'center'
            }}>
              <View style={styles.circle} />
          </TouchableOpacity>
        </View>
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

      <TouchableOpacity
        style={{ position: 'absolute', left: 5, top: 5 }}
        onPress={this._closePic.bind(this)}>
        <Text style={styles.closePic}>X</Text>
      </TouchableOpacity>
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
        <View style={styles.container}>
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

      setTimeout(() => {
        this.setState({
          isTakingImage: true
        })
      }, 1);

      await this.camera.takePictureAsync(options)
        .then(async (photo) => {
          console.log(photo);
          this.setState({ photo: photo });
        })
        .finally(async () => {
          // If a photo has just been taken...
          if (this.state.photo) {
            const body = {
              requests:[
                {
                  image:{
                    content: this.state.photo.base64,
                  },
                  features:[
                    {
                      type: 'LABEL_DETECTION',
                      maxResults: 15,
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
          }
        });

      this.setState({
        isTakingImage: false
      })
    }
  };

  _closePic = () => {
    this.setState({ photo: null });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '5%',
  },
  circle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 6,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closePic: {
    fontSize: 18,
    color: 'white',
    padding: 10
  }
});