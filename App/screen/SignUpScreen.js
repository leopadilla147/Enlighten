import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

function SignUpScreen(props) {
    return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry />
      <Button title="Signup" onPress={() => { /* handle signup */ }} />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingLeft: 10,
    },
  });

export default SignUpScreen;