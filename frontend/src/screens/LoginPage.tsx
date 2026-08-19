import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RootStackParamList } from "../types/RoutesTypes";
import { useAuth } from "../context/AuthContext";
import { loginSchema, LoginFormData } from "../schemas/login.schema";
import { API_URL } from "../services/api";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function LoginPage() {
  const navigation = useNavigation<NavigationProps>();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  // false = senha escondida
  // true = senha visível
  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    setServerError("");
    setLoading(true);

    try {
      await login(data.email, data.password);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setServerError("Invalid email or password.");
      } else {
        setServerError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome back 👋</Text>

        <Text style={styles.subtitle}>Sign in to your account to continue</Text>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}
          />

          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={[
                  styles.passwordContainer,
                  errors.password && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  style={styles.showPasswordButton}
                  onPress={() => setShowPassword((previous) => !previous)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={21}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>

        {serverError !== "" && <Text style={styles.error}>{serverError}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleSubmit(handleLogin)}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Signing in..." : "Sign in"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 35,
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
    fontSize: 15,
    color: "#111827",
  },

  inputError: {
    borderColor: "#dc2626",
  },

  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
  },

  showPasswordButton: {
    height: "100%",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 6,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  forgotText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },

  registerText: {
    color: "#6b7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
});
