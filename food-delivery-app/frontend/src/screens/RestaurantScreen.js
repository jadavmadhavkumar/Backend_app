"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { restaurantAPI } from "../services/api"
import { useCart } from "../context/CartContext"

const RestaurantScreen = ({ route, navigation }) => {
  const { restaurant } = route.params
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { addToCart, getCartItemCount } = useCart()

  const categories = ["All", ...new Set(menu.map((item) => item.category))]

  useEffect(() => {
    fetchMenu()
  }, [selectedCategory])

  const fetchMenu = async () => {
    try {
      const category = selectedCategory === "All" ? "" : selectedCategory
      const response = await restaurantAPI.getMenu(restaurant._id, category)
      setMenu(response.data)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch menu")
      console.error("Error fetching menu:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item) => {
    addToCart(item, restaurant)
    Alert.alert("Added to Cart", `${item.name} has been added to your cart`)
  }

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          {item.isVegetarian && <Ionicons name="leaf" size={16} color="#4CAF50" />}
        </View>
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>${item.price}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const renderCategoryFilter = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryFilter, selectedCategory === item && styles.categoryFilterActive]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryFilterText, selectedCategory === item && styles.categoryFilterTextActive]}>
        {item}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />

        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>

          <View style={styles.restaurantMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.metaText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="car" size={16} color="#666" />
              <Text style={styles.metaText}>${restaurant.deliveryFee}</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
        />

        <FlatList
          data={menu}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.menuList}
          scrollEnabled={false}
        />
      </ScrollView>

      {getCartItemCount() > 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <View style={styles.cartButtonContent}>
            <Text style={styles.cartButtonText}>View Cart ({getCartItemCount()})</Text>
            <Ionicons name="cart" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  restaurantImage: {
    width: "100%",
    height: 200,
  },
  restaurantHeader: {
    padding: 20,
    backgroundColor: "#fff",
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  restaurantMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    marginLeft: 5,
    color: "#333",
    fontWeight: "500",
  },
  categoryList: {
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  categoryListContent: {
    paddingHorizontal: 20,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  categoryFilterActive: {
    backgroundColor: "#FF6B6B",
  },
  categoryFilterText: {
    color: "#666",
    fontWeight: "500",
  },
  categoryFilterTextActive: {
    color: "#fff",
  },
  menuList: {
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  addButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  cartButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    padding: 15,
  },
  cartButtonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default RestaurantScreen
