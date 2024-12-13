import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { firebase } from './config';  // Import your Firebase config

const ReportScreen = ({ route }) => {
  const { deviceId } = route.params;

  if (!deviceId) {
    return (
      <View style={styles.container}>
        <Text>No Device ID provided!</Text>
      </View>
    );
  }

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;  // Get the current user's ID
    const db = getDatabase();
    const logRef = ref(db, `users/${userId}/lightSwitchLogs/${deviceId}`);

    // Listen for changes in the light switch logs for the specified device
    onValue(logRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logArray = Object.values(data);
        setLogs(logArray);  // Set the logs to the state
      } else {
        setLogs([]);  // If no logs exist for the device, set an empty array
      }
      setLoading(false);  // Stop loading once data is fetched
    });

    // Cleanup when the component unmounts
    return () => {
      // Stop listening to changes when the component is unmounted
    };
  }, [deviceId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Light Switch Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text>{item.status}</Text>
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text>{item.roomName}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  logItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
});

export default ReportScreen;
