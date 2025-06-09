"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, ScrollView, Alert, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { orderService } from "../services/orderService"

const OrderTrackingScreen = ({ route }) => {
  const { orderId } = route.params
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchOrder()

    // Subscribe to real-time updates
    const subscription = orderService.subscribeToOrderUpdates(orderId, (payload) => {
      console.log("Order updated:", payload)
      if (payload.new) {
        setOrder((prevOrder) => ({ ...prevOrder, ...payload.new }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const result = await orderService.getOrderById(orderId)

      if (result.success) {
        setOrder(result.data)
      } else {
        Alert.alert("Error", "Failed to fetch order details")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch order details")
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrder()
  }

  const getStatusSteps = () => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: "checkmark-circle" },
      { key: "confirmed", label: "Confirmed", icon: "checkmark-circle" },
      { key: "preparing", label: "Preparing", icon: "restaurant" },
      { key: "out_for_delivery", label: "Out for Delivery", icon: "car" },
      { key: "delivered", label: "Delivered", icon: "home" },
    ]

    const statusOrder = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"]
    const currentIndex = statusOrder.indexOf(order?.status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  const getEstimatedTime = () => {
    if (!order?.estimated_delivery_time) return ""

    const estimatedTime = new Date(order.estimated_delivery_time)
    return estimatedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading order details...</Text>
      </View>
    )
  }

  const statusSteps = getStatusSteps()

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Order #{order.id.slice(-6)}</Text>
        <Text style={styles.estimatedTime}>Estimated delivery: {getEstimatedTime()}</Text>
      </View>

      <View style={styles.restaurantInfo}>
        <Image source={{ uri: order.restaurants.image }} style={styles.restaurantImage} />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{order.restaurants.name}</Text>
          <Text style={styles.orderDate}>Ordered on {new Date(order.created_at).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.trackingContainer}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        {statusSteps.map((step, index) => (
          <View key={step.key} style={styles.statusStep}>
            <View style={styles.stepIndicator}>
              <View
                style={[
                  styles.stepCircle,
                  step.completed && styles.stepCircleCompleted,
                  step.active && styles.stepCircleActive,
                ]}
              >
                <Ionicons name={step.icon} size={20} color={step.completed ? "#fff" : "#ccc"} />
              </View>
              {index < statusSteps.length - 1 && (
                <View style={[styles.stepLine, step.completed && styles.stepLineCompleted]} />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepLabel, step.completed && styles.stepLabelCompleted]}>{step.label}</Text>
              {step.active && (
                <Text style={styles.stepTime}>
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        {order.order_items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemQuantity}>{item.quantity}x</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.orderSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${order.total_amount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee:</Text>
            <Text style={styles.summaryValue}>${order.delivery_fee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${order.final_amount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.deliveryInfo}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.addressText}>{order.delivery_address.street}</Text>
        <Text style={styles.addressText}>
          {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipCode}
        </Text>
      </View>

      {order.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <Text style={styles.notesText}>{order.notes}</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#FF6B6B",
    padding: 20,
    alignItems: "center",
  },
  orderNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  estimatedTime: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.9,
  },
  restaurantInfo: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  trackingContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statusStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 15,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepCircleActive: {
    backgroundColor: "#FF6B6B",
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: "#f0f0f0",
    marginTop: 5,
  },
  stepLineCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  stepLabelCompleted: {
    color: "#333",
    fontWeight: "bold",
  },
  stepTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  orderDetails: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  orderSummary: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  deliveryInfo: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
})

export default OrderTrackingScreen
