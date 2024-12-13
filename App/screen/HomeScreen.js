import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.icon} />
      <Text style={styles.title}>Menu</Text>
      <View style={styles.buttonGrid}>
        <View style={styles.buttonContainer}>
          <Button title="Account" onPress={() => navigation.navigate('Account')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Devices" onPress={() => navigation.navigate('Devices')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Reports" onPress={() =>  {/*navigation.navigate('Reports')*/}} /> 
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    icon: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      justifyContent: 'flex-start',
      marginTop: -120,
      marginBottom: 75,
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      marginBottom: 20,
      marginTop: -50,
    },
    buttonGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      width: '48%',
      height: '80%',
      marginBottom: 10,
    },
  });

export default HomeScreen;