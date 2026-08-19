import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
import { Checkbox } from "expo-checkbox";

import { RootStackParamList } from "../types/RoutesTypes";
import api from "../services/api";

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

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage(
        "Please fill in all fields."
      );

      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/reset-password",
        {
          email,
          code,
          password,
        }
      );

      console.log(
        "Reset password response:",
        response.data
      );

      setSuccessMessage(
        "Your password has been reset successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error ||
            "Unable to reset password."
        );
      } else {
        setErrorMessage(
          "Unable to reset password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          New Password
        </Text>

        <Text style={styles.description}>
          Create a new password for your account.
        </Text>

        {errorMessage !== "" && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}

        {successMessage !== "" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              {successMessage}
            </Text>
          </View>
        )}

        <Text style={styles.label}>
          New password
        </Text>

        <TextInput
          style={[
            styles.input,
            errorMessage !== "" &&
              styles.inputError,
          ]}
          placeholder="Enter your new password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrorMessage("");
          }}
        />

        <Text style={styles.label}>
          Confirm password
        </Text>

        <TextInput
          style={[
            styles.input,
            errorMessage !== "" &&
              styles.inputError,
          ]}
          placeholder="Confirm your new password"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrorMessage("");
          }}
        />

        <View style={styles.showPassword}>
          <Checkbox
            value={showPassword}
            onValueChange={setShowPassword}
            style={styles.checkbox}
          />

          <Text style={styles.showPasswordText}>
            Show passwords
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
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

  inputError: {
    borderColor: "#EF4444",
  },

  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },

  successContainer: {
    backgroundColor: "#DCFCE7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  successText: {
    color: "#166534",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },

  showPassword: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
    gap: 10,
  },

  checkbox: {
    margin: 0,
  },

  showPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});