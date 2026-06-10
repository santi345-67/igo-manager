import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { requestPushPermissions } from './src/lib/NotificationHandler';
import Welcome from './src/screens/auth/Welcome';
import RegisterStep1 from './src/screens/auth/RegisterStep1';
import RegisterStep2 from './src/screens/auth/RegisterStep2';
import Login from './src/screens/auth/Login';
import Home from './src/screens/Home';
import CreateInitiative from './src/screens/CreateInitiative';
import Prioritization from './src/screens/Prioritization';
import Quadrants from './src/screens/Quadrants';
import ActionPlan from './src/screens/ActionPlan';

const Stack = createNativeStackNavigator();

// Configurar comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppRoutes() {
  const { session } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CreateInitiative" component={CreateInitiative} />
            <Stack.Screen name="Prioritization" component={Prioritization} />
            <Stack.Screen name="Quadrants" component={Quadrants} />
            <Stack.Screen name="ActionPlan" component={ActionPlan} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="RegisterStep1" component={RegisterStep1} />
            <Stack.Screen name="RegisterStep2" component={RegisterStep2} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AppWithNotifications() {
  useEffect(() => {
    // Solicitar permisos de notificaciones al iniciar
    requestPushPermissions();
  }, []);

  return <AppRoutes />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppWithNotifications />
    </AuthProvider>
  );
}
