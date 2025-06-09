"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { orderAPI } from "../services/api"

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders()
      setOrders(response.data)
    } catch (error) {
      Alert.alert("Error", "Failed to fetch orders")
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500"
      case "confirmed":
        return "#2196F3"
      case "preparing":
        return "#FF9800"
      case "out_for_delivery":
        return "#9C27B0"
      case "delivered":
        return "#4CAF50"
      case "cancelled":
        return "#F44336"
      default:
        return "#666"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "confirmed":
        return "Confirmed"
      case "preparing":
        return "Preparing"
      case "out_for_delivery":
        return "Out for Delivery"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate("OrderTracking", { orderId: item._id })}
    >
      <View style={styles.orderHeader}>
        <Image source={{ uri: item.restaurant.image }} style={styles.restaurantImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{item.restaurant.name}</Text>
          <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.orderTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.orderStatus}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <Text style={styles.orderTotal}>${item.finalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        <Text style={styles.itemsLabel}>Items:</Text>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
        {item.items.length > 2 && <Text style={styles.moreItems}>+{item.items.length - 2} more items</Text>}
      </View>

      <View style={styles.orderFooter}>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  )

  if (orders.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No orders yet</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.browseButtonText}>Start Ordering</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.ordersList}
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  orderTime: {
    fontSize: 12,
    color: "#999",
  },
  orderStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  orderItems: {
    marginBottom: 10,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  orderFooter: {
    alignItems: "flex-end",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default OrdersScreen
