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
import { API_URL } from "../services/api";

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

  async function handleVerifyCode() {
    if (code.length !== 6) {
      Alert.alert(
        "Invalid code",
        "Please enter the 6-digit verification code."
      );

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/auth/verify-reset-code`,
        {
          email,
          code,
        }
      );

      navigation.navigate("ResetPassword", {
        email,
        code,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        "Invalid verification code.";

      Alert.alert("Verification failed", message);
    } finally {
      setLoading(false);
    }
  }

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

        <TextInput
          style={styles.codeInput}
          placeholder="000000"
          placeholderTextColor="#94A3B8"
          keyboardType="numbers-and-punctuation"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify Code"}
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