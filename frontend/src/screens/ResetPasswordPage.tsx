import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import type {
  RouteProp,
} from "@react-navigation/native";

import axios from "axios";

import { RootStackParamList } from "../types/RoutesTypes";
import { API_URL } from "../services/api";
import { Checkbox } from "expo-checkbox";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ResetPassword"
>;

type RouteProps = RouteProp<
  RootStackParamList,
  "ResetPassword"
>;

export default function ResetPasswordPage() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { email, code } = route.params;

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!password || !confirmPassword) {
      Alert.alert(
        "Error",
        "Please fill in all fields."
      );

      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Error",
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          email,
          code,
          password,
        }
      );

      Alert.alert(
        "Success",
        "Your password has been reset successfully.",
        [
          {
            text: "Go to Login",
            onPress: () =>
              navigation.navigate("Login"),
          },
        ]
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        "Unable to reset password.";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          New Password
        </Text>

        <Text style={styles.description}>
          Create a new password for your account.
        </Text>

        <Text style={styles.label}>
          New password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your new password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>
          Confirm password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm your new password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.showPassword}>
          <Checkbox onValueChange={()=>{setShowPassword(!showPassword)}} value={showPassword} style={styles.checkbox}/>
          <Text style={styles.label}>Show passwords</Text>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    margin: 0,
  },
  showPassword: {
    // flex:1,
    margin: 0,
    flexDirection:"row",
    alignItems:"flex-start",
    justifyContent:"flex-start",
    marginBottom: 36,
    gap:10,
    textAlign:"center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  content: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 20,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});