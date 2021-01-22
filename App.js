import React, { Component } from "react";
import { SafeAreaView, View, Modal, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, Image, Platform } from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import httpClient from './axios-client'


const googleApiKey="YOUR-GOOGLE-APIKEY"

const mapboxApiKey="YOUR-MAPBOX-APIKEY"

const IS_ANDROID=Platform.OS==="android";

MapboxGL.setAccessToken(mapboxApiKey);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    marginTop: 0
  },
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1
  },
  currentMarker: {
    height: 30, 
    width: 30, 
    backgroundColor: '#0490E1', 
    borderRadius: 50, 
    borderColor: '#fff', 
    borderWidth: 3
  },
  user_location: {    
    backgroundColor: "#cecece",
    color: "#000000",
    width: 100,
    height: 100,
    borderRadius: 150 
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    position: 'absolute',
    left: 10,
    top: 80,
  },
  buttoni: {
    padding: 10,
    marginVertical: 15,
  },
  imagesearchs: {
    padding: 10,
    marginVertical: 15,
    width: 32,
    height: 32,
    position: 'absolute',
    left: 50,
    right: 50,
  },
  buttonText: {
    color: '#fff'
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000090'
  },
  containerToolBar: {
    width: "100%",
    position: 'absolute',
    left: 0,
    top: 0,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 40,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    height: 40,
    borderRadius: 35,
    margin: 0,
    width: "100%",
  },
  text_input: {
    padding: 10,
    fontSize: 15,
    marginTop: 5,
    height: 40,
    color: '#000000',
    backgroundColor: 'transparent',
    borderColor: '#EEEEEE',
    flex: 1,
    width: "100%",
  },
  ImageStyle: {
    padding: 0,
    margin: 5,
    height: 25,
    width: 25,
  },
  ImageStyle2: {
    height: 25,
    width: 25,
  },
});


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dir: '',
      initialCoords: undefined,
      destinyCoords: undefined,
      route:
        {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": [[0,0]]
              }
            }
          ]
        },   
    }

  }

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }
  
  onPress = () => {
    this.setState({ isLoading: true })

    if ( this.state.initialCoords === undefined ) {
      Alert.alert(  "ERROR", "Initial coords are not loaded",
        [{ text: "OK" }],
        { cancelable: true }
      );
      this.setState({ isLoading: false })
      return;
    }

    if ( this.state.dir.trim().length === 0 ) {
      Alert.alert( "ERROR", "Destiny coords are not set",
        [ { text: "OK" } ],
        { cancelable: false }
      );
      this.setState({ isLoading: false })
      return;
    }

    var destiny = encodeURI(this.state.dir)

    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${destiny}&key=${googleApiKey}`

    httpClient.get(url).then((response) => {
      if ( response.data.results.length > 0) {
        console.log(response.data.results[0].geometry.location)    
        let destinyCoords = [ response.data.results[0].geometry.location.lng, response.data.results[0].geometry.location.lat ]
        this.routeFinderByCoords ( destinyCoords )
      }
    })
    .catch((error) =>{
      console.log("error", error)
    })
  };

  routeFinderByCoords = ( destinyCoords ) => {

    this.setState({  isLoading: true })

    if ( this.state.initialCoords === undefined ) {
      Alert.alert( "ERROR", "Initial coords are not loaded",
        [ { text: "OK" } ],
        { cancelable: true }
      );
      this.setState({ isLoading: false })
      return;
    }

    if ( destinyCoords === undefined ) {
      Alert.alert( "ERROR", "Destiny coords are not loaded",
        [ { text: "OK" } ],
        { cancelable: true }
      );
      this.setState({ isLoading: false })
      return;
    }

    let destiny = JSON.stringify(destinyCoords.reverse()).replace(" ", "").replace("[", "").replace("]", "")
  
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.initialCoords.coords.latitude},${this.state.initialCoords.coords.longitude}&destination=${destiny}&key=${googleApiKey}`

    httpClient.get(url).then((response) => {
            
      if (response.data.routes.length > 0){
        var polyline = require('polyline');
        var newcoordinates = [];
        response.data.routes.forEach(function (routeItem) {
          newcoordinates.push( ...polyline.decode(routeItem.overview_polyline.points) )
        });      
        newcoordinates.forEach(function (point) {
          point=point.reverse();
        });
  
        this.setState({
          isLoading: false,
          destinyCoords: destinyCoords,
          route: {
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {},
                "geometry": {
                  "type": "LineString",
                  "coordinates": newcoordinates
                }
              }
            ]
          },   
        });
      } else {
        Alert.alert( "ERROR", "No route found",
          [ { text: "OK" } ],
          { cancelable: true }
        );
      }

    })
    .catch((error) =>{
      console.log("error", error)
    })
    this.setState({ isLoading: false })
  };

  onDidFinishRenderingMapFully = () => {
    console.log('onDidFinishRenderingMapFully')
    this.setState({ isLoading: false })
  }

  onLongPress  = (location) => {
    this.routeFinderByCoords(location.geometry.coordinates)
    this.setState({ isLoading: true, dir: '' })

  }

  renderAnnotations = () => {
    return (
      <>
        { this.state.initialCoords !== undefined &&  
            <MapboxGL.PointAnnotation
              key="pointAnnotation"
              id="pointAnnotation"
              coordinate={[ this.state.initialCoords.coords.longitude, this.state.initialCoords.coords.latitude ]}> 
              <View style={styles.currentMarker} />
            </MapboxGL.PointAnnotation>
        }
        
        { this.state.destinyCoords !== undefined &&  
          <MapboxGL.PointAnnotation
                key="destinationPointAnnotation"
                id="destinationPointAnnotation"
                coordinate={ this.state.destinyCoords.reverse() }> 
                <View style={{
                  height: 30, 
                  width: 30, 
                  backgroundColor: '#cc3000', 
                  borderRadius: 50, 
                  borderColor: '#fff', 
                  borderWidth: 3
                }} />
              </MapboxGL.PointAnnotation>
        }
      </>
    );
  }

  render() {

    return (
      <SafeAreaView style={styles.page}>

        <View style={styles.container}>

          <MapboxGL.MapView style={styles.map} 
            onDidFinishRenderingMapFully={this.onDidFinishRenderingMapFully} 
            onLongPress={this.onLongPress} 
            zoomEnabled={true} 
            compassEnabled={true} 
            logoEnabled={false} 
            >
          
          { this.state.initialCoords !== undefined &&  
            <MapboxGL.Camera
                zoomLevel={14}
                defaultSettings={{
                  centerCoordinate: [0, 0],
                  zoomLevel: 14
                }}
                followUserLocation={false}
                centerCoordinate={[ this.state.initialCoords.coords.longitude, this.state.initialCoords.coords.latitude ]}
                />      
          }
            {!this.state.isLoading && this.renderAnnotations()}

            { !this.state.isLoading && 
              <MapboxGL.ShapeSource id='line1' shape={this.state.route}>
                <MapboxGL.LineLayer id='linelayer1'  style={ {lineWidth: 5, lineJoin: 'bevel', lineColor: '#000000'} }   />
              </MapboxGL.ShapeSource>
            }

            <MapboxGL.UserLocation
              style={styles.user_location}
              renderMode="normal"
              visible={false}
              onUpdate={location => {
                const currentCoords = [
                  location.coords.longitude,
                  location.coords.latitude,
                ];
                this.setState({
                  initialCoords: location
                });
              }}
            />
          
          </MapboxGL.MapView>

          <View style={styles.containerToolBar}>
            <View style={styles.SectionStyle}>
              <TextInput  style={styles.text_input}
                placeholder="Enter your destination"
                underlineColorAndroid="transparent"
                onChangeText={(text) => this.setState({ dir: text })} 
                value={this.state.dir}
              />
              <TouchableOpacity onPress={this.onPress}  style={styles.ImageStyle}>
                <Image
                  source={require('./search.png')} 
                  style={styles.ImageStyle2}
                />
              </TouchableOpacity>
            </View>
          </View>

        </View>
        {this.state.isLoading 
        && 
        <Modal transparent={true} style={styles.loading} visible={this.state.isLoading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={this.state.isLoading}  size='large' />
            </View>
          </View>
        </Modal>
         
        }

      </SafeAreaView>
    );
  }
}