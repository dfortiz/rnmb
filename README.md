# Display directions from an API to a map

## Introduction

This startup project "React Native Map Box Startup" is a mapping application. 

If you have any questions, please contact [dfortiz@gmail.com](mailto:dfortiz@gmaile.com) 

## Features
- Mapbox framework for react native
- Current location use a round marker with the hex code #0490E1
- Current location update in real-time
- Directions draw like an polylines with the hex code #000000
- The text input with border-radius 35px, the border's hex code #EEEEEE
- Just draws valid directions, and display an error message if the data load fails for some reason
- Show an ActivityIndicator while loading the map or data
- The user is able to move around the map, zoom in and zoom out
    

## Instructions: How to install dependencies

"React Native Map Box Startup" requires [Node.js](https://nodejs.org/) v15.5.1+ to run.


```sh
$ cd rnmb
$ npm install
```

## Instructions: Set API Keys

Edit the App.js file, and modify the lines: 7 and 9, with the corresponding "mapboxApiKey" and "googleApiKey" values

Note: the "googleApiKey" needs to have the Geocode and Directions Api.

## Instructions: Run on Ios

```sh
$ cd rnmb
$ npx react-native run-ios
```

## Instructions: Run on Android

```sh
$ cd rnmb
$ npx react-native run-android
```

Screenshots
=========

## Search destination using the textinput

[![long press](https://raw.githubusercontent.com/dfortiz/rnmb/master/screenshots/search-direction-with-text-input.png)](#screenshots)

## Long press on map to search route

[![long press](https://raw.githubusercontent.com/dfortiz/rnmb/master/screenshots/long-press-on-map.png)](#screenshots)

## Loading/waiting screen

[![long press](https://raw.githubusercontent.com/dfortiz/rnmb/master/screenshots/loading-spinner.png)](#screenshots)

## No route found to show

[![long press](https://raw.githubusercontent.com/dfortiz/rnmb/master/screenshots/no-route-found.png)](#screenshots)


Whats next
=========

- Add the coverage test
- Improve the interface
- Add autocomplete Api in the text input to improve the user friendly
- Improve the instructions on the README.md

