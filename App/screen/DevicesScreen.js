import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal, TextInput, Switch, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from './config';
import { ref, onValue, set, remove } from 'firebase/database';

const DevicesScreen = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [lightStatus, setLightStatus] = useState(false);
  const [turnOnTime, setTurnOnTime] = useState(new Date());
  const [turnOffTime, setTurnOffTime] = useState(new Date());
  const [showOnPicker, setShowOnPicker] = useState(false);
  const [showOffPicker, setShowOffPicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    const devicesRef = ref(db, 'devices');
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const devicesData = snapshot.val();
      if (devicesData) {
        const formattedDevices = Object.keys(devicesData).map(key => ({
          id: key,
          ...devicesData[key],
        }));
        setDevices(formattedDevices);
      } else {
        setDevices([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDevicePress = (device) => {
    navigation.navigate('DeviceDetails', { device, onUpdate: handleUpdateDevice });
  };

  const handleAddDevice = () => {
    if (roomName) {
      const roomKey = roomName.trim().toLowerCase().replace(/\s+/g, '-');
  
      if (isAutomatic && selectedDays.length === 0) {
        alert('You need to select a day');
        return;
      }
  
      const newDevice = {
        name: `${roomName.trim()}`,
        isAutomatic,
        lightStatus,
        schedule: isAutomatic ? {
          on: `${turnOnTime.getHours()}:${turnOnTime.getMinutes().toString().padStart(2, '0')}`,
          off: `${turnOffTime.getHours()}:${turnOffTime.getMinutes().toString().padStart(2, '0')}`,
          days: selectedDays,
        } : null,
      };
  
      const newDeviceRef = ref(db, `devices/${roomKey}`);
      set(newDeviceRef, newDevice).then(() => {
        setModalVisible(false);
        resetForm();
      }).catch((error) => {
        console.error("Error adding device: ", error);
      });
    } else {
      alert('Please enter a room name');
    }
  };
  
  const resetForm = () => {
    setRoomName('');
    setIsAutomatic(false);
    setLightStatus(false);
    setTurnOnTime(new Date());
    setTurnOffTime(new Date());
    setSelectedDays([]);
  };

  const handleUpdateDevice = (updatedDevice) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
  };

  const handleDeleteDevice = (deviceId) => {
    Alert.alert(
      'Delete Device',
      'Are you sure you want to delete this device?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            const deviceRef = ref(db, `devices/${deviceId}`);
            remove(deviceRef)
              .then(() => {
                setDevices((prevDevices) => prevDevices.filter((device) => device.id !== deviceId));
              })
              .catch((error) => {
                console.error('Error deleting device: ', error);
              });
          },
          style: 'destructive', 
        },
      ],
      { cancelable: true }
    );
  };
  

  const getLightStatusText = (device) => {

    const lightStatus = device.lightStatus === "on";

    if (device.isAutomatic) {
      const today = new Date();
      const currentDay = today.toLocaleString('en-US', { weekday: 'short' });
      const isTodayAutomatic = device.schedule?.days.includes(currentDay);
      const currentTime = `${today.getHours()}:${today.getMinutes().toString().padStart(2, '0')}`;

      const isOnTime = currentTime >= device.schedule.on && currentTime < device.schedule.off;

      return isTodayAutomatic && isOnTime ? 'Light Status: On' : 'Light Status: Off';
    } else {
      return lightStatus ? 'Light Status: On' : 'Light Status: Off';
    }
  }; 
  
  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const showTimePicker = (type) => {
    if (type === 'on') {
      setShowOnPicker(true);
    } else {
      setShowOffPicker(true);
    }
  };

  const onChange = (event, selectedDate, type) => {
    if (event.type === 'dismissed') {
      if (type === 'on') {
        setShowOnPicker(false);
      } else {
        setShowOffPicker(false);
      }
      return;
    }

    const currentDate = selectedDate || (type === 'on' ? turnOnTime : turnOffTime);
    if (type === 'on') {
      setShowOnPicker(false);
      setTurnOnTime(currentDate);
    } else {
      setShowOffPicker(false);
      setTurnOffTime(currentDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.deviceItem}>
            <Text>{item.name} - {getLightStatusText(item)}</Text>
            <View style={styles.buttonContainer}>
                <Button title="View Details" onPress={() => handleDevicePress(item)} />
                <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDevice(item.id)}
                >
                <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
            </View>
        )}
        />
      <Button title="Add Device" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Device</Text>
          <TextInput
            style={styles.input}
            placeholder="Room Name"
            value={roomName}
            onChangeText={setRoomName}
          />
          <Text style={styles.label}>Mode:</Text>
          <View style={styles.switchContainer}>
            <Text>Manual</Text>
            <Switch value={isAutomatic} onValueChange={setIsAutomatic} />
            <Text>Automatic</Text>
          </View>

          {isAutomatic ? (
            <>
              <Button title="Set Turn On Time" onPress={() => showTimePicker('on')} />
              {showOnPicker && (
                <DateTimePicker
                  value={turnOnTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => onChange(event, date, 'on')}
                />
              )}
              <Button title="Set Turn Off Time" onPress={() => showTimePicker('off')} />
              {showOffPicker && (
                <DateTimePicker
                  value={turnOffTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, date) => onChange(event, date, 'off')}
                />
              )}
              <Text style={styles.scheduleText}>
                Schedule: {turnOnTime.getHours()}:{turnOnTime.getMinutes().toString().padStart(2, '0')} - {turnOffTime.getHours()}:{turnOffTime.getMinutes().toString().padStart(2, '0')}
              </Text>
              <View style={styles.daysContainer}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <TouchableOpacity key={day} onPress={() => toggleDay(day)} style={styles.dayContainer}>
                    <View style={[styles.checkbox, selectedDays.includes(day) && styles.checked]}>
                      {selectedDays.includes(day) && <View style={styles.checkboxInner} />}
                    </View>
                    <Text>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.switchContainer}>
              <Text>Light Status:</Text>
              <Switch value={lightStatus} onValueChange={setLightStatus} />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleAddDevice} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    deviceItem: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    deleteButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10, 
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 16,
      padding: 8,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    scheduleText: {
      fontSize: 16,
      marginTop: 8,
      textAlign: 'center',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderColor: '#000',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    checkboxInner: {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    checked: {
      backgroundColor: '#000',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
      dayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%', 
        marginBottom: 10,
      },
  });
  

export default DevicesScreen;
