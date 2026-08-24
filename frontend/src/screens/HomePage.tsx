import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
export default function HomePage() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        
        <Text style={styles.greeting}> Welcome back 👋 </Text>
        <Text style={styles.name}> {user?.name} </Text>
      </View>
      <View style={styles.card}>
        
        <Text style={styles.cardTitle}> Account information </Text>
        <View style={styles.info}>
          
          <Text style={styles.label}> Name </Text>
          <Text style={styles.value}> {user?.name} </Text>
        </View>
        <View style={styles.info}>
          
          <Text style={styles.label}> Email </Text>
          <Text style={styles.value}> {user?.email} </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        
        <Text style={styles.logoutText}> Sign out </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: { marginBottom: 30 },
  greeting: { fontSize: 16, color: "#6b7280", marginBottom: 5 },
  name: { fontSize: 30, fontWeight: "700", color: "#111827" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  info: { marginBottom: 16 },
  label: { fontSize: 13, color: "#6b7280", marginBottom: 5 },
  value: { fontSize: 16, fontWeight: "500", color: "#111827" },
  authCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  authIcon: { fontSize: 28, marginRight: 14 },
  authContent: { flex: 1 },
  authTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: 5,
  },
  authDescription: { fontSize: 13, lineHeight: 18, color: "#3b82f6" },
  logoutButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fecaca",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#dc2626" },
});
