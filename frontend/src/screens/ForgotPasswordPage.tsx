import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";

import { RootStackParamList } from "../types/RoutesTypes";
import { API_URL } from "../services/api";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordPage() {
  const navigation = useNavigation<NavigationProp>();
  const [emailError, setEmailError] = useState("");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
  const normalizedEmail = email.trim().toLowerCase();

  setEmailError("");

  if (!normalizedEmail) {
    setEmailError("Email is required.");
    return;
  }

  if (!isValidEmail(normalizedEmail)) {
    setEmailError("Please enter a valid email address.");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      `${API_URL}/auth/forgot-password`,
      {
        email: normalizedEmail,
      }
    );

    navigation.navigate("VerifyCode", {
      email: normalizedEmail,
    });
  } catch (error: any) {
    console.error(
      "Forgot password error:",
      error.response?.data
    );

    setEmailError(
      error.response?.data?.error ??
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.description}>
          Enter your email and we'll send you a
          verification code.
        </Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {emailError ? (
  <Text style={styles.errorText}>
    {emailError}
  </Text>
) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.backText}>
            ← Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
  color: "#DC2626",
  fontSize: 13,
  marginTop: -12,
  marginBottom: 16,
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
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  backText: {
    textAlign: "center",
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },
});