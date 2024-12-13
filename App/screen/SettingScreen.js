import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search Settings..."
      />
      <View style={styles.buttonContainer}>
        <Button title="Notification Settings" onPress={() => { /* Handle Notification Settings */ }} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Open Manual" onPress={() => { /* Handle Manual Open */ }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default SettingScreen;