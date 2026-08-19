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
import api from "../services/api";

import { RootStackParamList } from "../types/RoutesTypes";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "VerifyCode"
>;

type RouteProps = RouteProp<
  RootStackParamList,
  "VerifyCode"
>;

export default function VerifyCodePage() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { email } = route.params;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerifyCode = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage(
        "Please enter a 6-digit verification code."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/verify-reset-code",
        {
          email,
          code,
        }
      );

      console.log("Verification response:", response.data);

      setSuccessMessage(
        "Code verified successfully! Redirecting..."
      );

      setTimeout(() => {
        navigation.navigate("ResetPassword", {
          email,
          code,
        });
      }, 1000);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error ||
            "Invalid verification code."
        );
      } else {
        setErrorMessage(
          "Unable to verify the verification code."
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
          Verify Code
        </Text>

        <Text style={styles.description}>
          Enter the 6-digit code sent to:
        </Text>

        <Text style={styles.email}>
          {email}
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

        <TextInput
          style={[
            styles.codeInput,
            errorMessage !== "" && styles.inputError,
          ]}
          placeholder="000000"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setErrorMessage("");
            setSuccessMessage("");
          }}
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Verifying..."
              : "Verify Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ForgotPassword")
          }
        >
          <Text style={styles.backText}>
            ← Change email
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
  },

  email: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
    marginTop: 4,
    marginBottom: 30,
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

  codeInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 28,
    letterSpacing: 8,
    color: "#0F172A",
    marginBottom: 20,
  },

  inputError: {
    borderColor: "#EF4444",
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  buttonDisabled: {
    opacity: 0.6,
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