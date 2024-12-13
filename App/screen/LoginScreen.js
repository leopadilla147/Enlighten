import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa7Wv6fqF0r2c2-deq1p9z9YX_XUC-HpI",
  authDomain: "enlighten-69649.firebaseapp.com",
  databaseURL: "https://enlighten-69649-default-rtdb.firebaseio.com",
  projectId: "enlighten-69649",
  storageBucket: "enlighten-69649.appspot.com",
  messagingSenderId: "799991390981",
  appId: "1:799991390981:web:31236f7dafb08004008d6c"
};

const app = initializeApp(firebaseConfig);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const showNotification = (title, message) => {
    Alert.alert(title, message);
  };

  const handleAuthentication = async () => {
    try {
      if (user) {
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          navigation.navigate('Home');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          showNotification('Success', 'User created successfully!');

          setEmail('');
          setPassword('');
          navigation.navigate('Login'); 
        }
      }
    } catch (error) {
      showNotification('Login Failed', `Please check your Email and Password.`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={require('../assets/logo.png')}
        style={styles.icon}
      />
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
        <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  icon: {
    width: 300,
    height: 300, 
    alignSelf: 'center',
    marginTop: -30,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    width: '100%', 
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;


/* import React from 'react';
import { View, StyleSheet, Text, TextInput, Button, Image } from 'react-native';

const LoginScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Image style={styles.iconImg} source={require("../assets/logo.png")}/>
            <Text style={styles.iconText}>Enlighten</Text>
            <TextInput style={styles.emailInput} placeholder='Email' keyboardType="email-address"/>
            <TextInput style={styles.passInput} placeholder='Password' secureTextEntry/>
            <Button style={styles.loginBtn} title="Login" onPress={() => navigation.navigate('Home')}/>
            <Button style={styles.signUpBtn} title="SignUp" onPress={() => navigation.navigate('Signup')}/>
        </View>
    );
} 

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
        },
        emailInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 15,
            paddingLeft: 10,
        },
        iconImg: {
            width: 300,
            height: 300,
            alignSelf: 'center',
            marginBottom: 20,
            marginTop: -100,
        },
        iconText: {
            alignSelf: 'center',  
        },
        loginBtn: {
            width: '50%',
            height: 30,
            marginVertical: 15,
        },
        passInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 15,
            paddingLeft: 10,
        },
        signUpBtn: {
            width: '50%',
            height: 30,
            marginVertical: 15,
        },
    })
*/
