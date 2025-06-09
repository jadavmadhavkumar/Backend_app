"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  RefreshControl,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { restaurantAPI } from "../services/api"
import { useAuth } from "../context/AuthContext"

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const { user } = useAuth()

  const cuisines = ["All", "Italian", "Indian", "American", "Asian", "Pizza"]

  useEffect(() => {
    fetchRestaurants()
  }, [selectedCuisine, searchQuery])

  const fetchRestaurants = async () => {
    try {
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCuisine && selectedCuisine !== "All") params.cuisine = selectedCuisine

      const response = await restaurantAPI.getAll(params)
      setRestaurants(response.data)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch restaurants")
      console.error("Error fetching restaurants:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchRestaurants()
  }

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => navigation.navigate("Restaurant", { restaurant: item })}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
          <Text style={styles.deliveryFee}>${item.deliveryFee}</Text>
        </View>
        <View style={styles.cuisineContainer}>
          {item.cuisine.slice(0, 3).map((cuisine, index) => (
            <Text key={index} style={styles.cuisineTag}>
              {cuisine}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCuisineFilter = ({ item }) => (
    <TouchableOpacity
      style={[styles.cuisineFilter, selectedCuisine === item && styles.cuisineFilterActive]}
      onPress={() => setSelectedCuisine(item)}
    >
      <Text style={[styles.cuisineFilterText, selectedCuisine === item && styles.cuisineFilterTextActive]}>{item}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        <Text style={styles.subtitle}>What would you like to eat?</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants or food..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={cuisines}
        renderItem={renderCuisineFilter}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cuisineList}
        contentContainerStyle={styles.cuisineListContent}
      />

      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.restaurantList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  cuisineList: {
    marginBottom: 10,
  },
  cuisineListContent: {
    paddingHorizontal: 20,
  },
  cuisineFilter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cuisineFilterActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  cuisineFilterText: {
    color: "#666",
    fontWeight: "500",
  },
  cuisineFilterTextActive: {
    color: "#fff",
  },
  restaurantList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: "500",
    color: "#333",
  },
  deliveryTime: {
    color: "#666",
    marginRight: 15,
  },
  deliveryFee: {
    color: "#FF6B6B",
    fontWeight: "500",
  },
  cuisineContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cuisineTag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    color: "#666",
    marginRight: 5,
    marginBottom: 5,
  },
})

export default HomeScreen
