import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  BackAndroid,
  StatusBar,
  I18nManager,
} from 'react-native';
// import * as Font from 'expo-font';
import AppContainer from './src/navigations/Screen';
// import { AppLoading } from 'expo';
import constants from './src/config/constants';
import {primeService} from './src/services/service';
import FlashMessage from 'react-native-flash-message';
import {font} from './src/config/fonts';
import i18n from 'i18n-js';
import enStrings from './src/config/en/strings';
import arStrings from './src/config/ar/strings';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox} from 'react-native';

// LogBox.install;
// LogBox.ignoreLogs([" Animated: `useNativeDriver` was not specified"])

export default class App extends React.Component {
  state = {
    appIsReady: false,
  };

  async componentDidMount() {
    SplashScreen.hide();
    StatusBar.setHidden(true);
    await this.baseUrl();

    // Set the key-value pairs for the different languages you want to support.
    i18n.translations = {
      en: enStrings,
      ar: arStrings,
    };
    // Set the locale once at the beginning of your app.
    i18n.locale = I18nManager.isRTL ? 'ar' : 'en';
    // When a value is missing from a language it'll fallback to another language with the key present.
    i18n.fallbacks = true;
  }

  baseUrl = async () => {
    let apiName = 'base-url';
    let response = await primeService(this, apiName, 'GET', {}, '');
    console.log(response);
    if (response) {
      let result = response.result;

      try {
        await AsyncStorage.setItem('AppUrl', result['base_url']);
        await AsyncStorage.setItem('ApiUrl', result['base_url']);
        await AsyncStorage.setItem('profile', result['profile']);
        await AsyncStorage.setItem(
          'profileThumbnail',
          result['profile-thumbnail'],
        );
        this.setState({appIsReady: true});
      } catch (error) {
        console.log(error);
        // Alert.alert(
        //   'Alert ',
        //   'Internal server error.',
        //   [
        //     {text: 'OK', onPress: () => console.log('OK Pressed')},
        //   ],
        //   {cancelable: false},
        // );
      } finally {
        this.setState({appIsReady: true});
      }
    } else {
      console.log('failll');
    }
  };

  render() {
    return this.state.appIsReady ? (
      <View style={{flex: 1}}>
        <AppContainer />
        <FlashMessage ref="myLocalFlashMessage" />
      </View>
    ) : (
      <Text />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
