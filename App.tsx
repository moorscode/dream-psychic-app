import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import PhrenicPoolManager from './components/PhrenicPoolManager';
import { Platform, SafeAreaView, View, StyleSheet } from 'react-native';
import { StatusBar as RNStatusBar } from 'react-native';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <PhrenicPoolManager />
          </View>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
});

export default App;
