import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Provider } from "react-redux"
import { store } from "./src/store/store"
import { AuthProvider } from "./src/context/AuthContext"
import { CartProvider } from "./src/context/CartContext"

// Screens
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import HomeScreen from "./src/screens/HomeScreen"
import RestaurantScreen from "./src/screens/RestaurantScreen"
import CartScreen from "./src/screens/CartScreen"
import OrdersScreen from "./src/screens/OrdersScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import OrderTrackingScreen from "./src/screens/OrderTrackingScreen"

// Icons
import { Ionicons } from "@expo/vector-icons"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Orders") {
            iconName = focused ? "receipt" : "receipt-outline"
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#FF6B6B",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="Restaurant" component={RestaurantScreen} options={{ title: "Menu" }} />
              <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: "Track Order" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </Provider>
  )
}
