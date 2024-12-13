import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, TextInput, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase, db } from './config';
import { ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const AccountScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const uid = user.uid;
      const userRef = ref(db, 'users/' + uid);
  
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserData(userData);
  
          const currentUsername = userData.username || email.split('@')[0];
          setUsername(currentUsername);

          const imageUrl = userData.profileImage || "defaultImageURL";
          setProfileImage(imageUrl);
        } else {
          console.log('No user data available');
        }
      }).catch((error) => {
        console.error('Error fetching user data: ', error);
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const userRef = ref(db, 'users/' + uid);
  
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUserData(userData);
            setProfileImage(userData.profileImage || "defaultImageURL");
          }
        });
      }
    });
  
    return () => unsubscribe(); // Clean up listener on unmount
  }, []);


  const handleLogout = () => {
    firebase.auth().signOut().then(() => {
      navigation.navigate('Login');
    }).catch((error) => {
      console.error('Error during logout: ', error);
    });
  };

  const handleSave = () => {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const uid = user.uid;
      const userRef = ref(db, 'users/' + uid);
      
      let profileImageUrl = profileImage;  // Keep the current profile image URL if no new image is selected
  
      if (imageUri) {
        // If the user selected a new image, upload it to Firebase Storage
        const storage = getStorage();
        const imageRef = storageRef(storage, 'profile_pics/' + uid + '.jpg');
        const img = { uri: imageUri };
  
        // Upload the selected image to Firebase Storage
        uploadBytes(imageRef, img).then((snapshot) => {
          // Once the upload is complete, retrieve the download URL
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            profileImageUrl = downloadURL;  // Update the profile image URL with the new image URL
  
            // Save the updated profile image URL in Firebase Realtime Database
            saveUserData(profileImageUrl);  // Save user data including the new profile image URL
          });
        }).catch((error) => {
          console.error("Error uploading image:", error);
          // In case of an error, just proceed with the old image (no change)
          saveUserData(profileImageUrl);
        });
      } else {
        // If no new image is selected, save the existing profile image URL (if any)
        saveUserData(profileImageUrl);
      }
    }
  };
  
  const saveUserData = (profileImageUrl) => {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
  
    const userRef = ref(db, 'users/' + uid);
    set(userRef, {
      username: username,
      email: user.email,
      profileImage: profileImageUrl || "defaultImageURL",  // Set default if there's no image
    }).then(() => {
      console.log('User data saved successfully!');
      setProfileImage(profileImageUrl); // Update the state to trigger a re-render with the new image
    }).catch((error) => {
      console.error('Error saving user data: ', error);
    });
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      setProfileImage(result.uri);
    }
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
  <View style={styles.profileContainer}>

  <Image
  source={profileImage ? { uri: profileImage } : require('../assets/Profile.png')}
  style={styles.profilePic}
  resizeMode="cover" // You can also try 'contain' if you prefer the image not to crop
/>

    <TextInput
      style={styles.input}
      value={username}
      onChangeText={setUsername}
    />
    <Button title="Pick Image" onPress={pickImage} />
  </View>

  <View style={styles.buttonContainer}>
    <View style={styles.buttonWrapper}>
      <Button 
        title="Save" 
        onPress={handleSave} 
      />
    </View>
    <View style={styles.buttonWrapper}>
      <Button 
        title="Logout" 
        onPress={() => setIsModalVisible(true)} 
      />
    </View>
  </View>

  <Modal
    transparent={true}
    animationType="fade"
    visible={isModalVisible}
    onRequestClose={() => setIsModalVisible(false)}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Are you sure you want to log out?</Text>
        <View style={styles.modalButtons}>
          <Button
            title="Cancel"
            onPress={() => setIsModalVisible(false)}
          />
          <Button
            title="Confirm"
            onPress={handleLogout}
          />
        </View>
      </View>
    </View>
  </Modal>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    width: 200,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  buttonWrapper: {
    marginBottom: 10, // Space between buttons
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});


export default AccountScreen;
