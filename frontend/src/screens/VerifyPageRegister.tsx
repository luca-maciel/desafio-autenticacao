import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";

import { useState } from "react";
import axios from "axios";
import api from "../services/api";

export default function VerifyPageRegister({ navigation, route }: any) {
  const { email } = route.params;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerify = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage("Please enter a 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-register", {
        email,
        code,
      });

      console.log("Verification response:", response.data);

      setSuccessMessage(
        "Registration completed successfully! Redirecting to login...",
      );

      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Invalid verification code.",
        );
      } else {
        setErrorMessage("Unable to verify the code.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text
          style={styles.title}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          Verify your email
        </Text>

        <Text style={styles.description}>
          We sent a 6-digit verification code to:
        </Text>

        <Text style={styles.email}>{email}</Text>

        {errorMessage !== "" && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {successMessage !== "" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Verification code</Text>

          <TextInput
            style={[styles.input, errorMessage !== "" && styles.inputError]}
            placeholder="Enter your 6-digit code"
            placeholderTextColor="#9ca3af"
            keyboardType="numbers-and-punctuation"
            maxLength={6}
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setErrorMessage("");
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify code"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  form: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },

  email: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 5,
    marginBottom: 25,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    fontSize: 20,
    color: "#111827",
    textAlign: "center",
    letterSpacing: 5,
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorContainer: {
    backgroundColor: "#fee2e2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  errorText: {
    color: "#b91c1c",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },

  successContainer: {
    backgroundColor: "#dcfce7",
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

  button: {
    height: 52,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
