import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './App/screen/LoginScreen';
import SignUpScreen from './App/screen/SignUpScreen';
import HomeScreen from './App/screen/HomeScreen';
import AccountScreen from './App/screen/AccountScreen';
import SettingScreen from './App/screen/SettingScreen';
import DevicesScreen from './App/screen/DevicesScreen';
import DeviceDetailsScreen from './App/screen/DeviceDetailsScreen';
import ReportScreen from './App/screen/ReportScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
        <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            title: 'Home',
            headerLeft: () => null,
            headerBackVisible: false,
          })}/>
        <Stack.Screen 
          name="Account" 
          component={AccountScreen} 
          options={{ title: 'Account' }} 
        />
        <Stack.Screen name="Settings" component={SettingScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
        <Stack.Screen name="Reports" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;