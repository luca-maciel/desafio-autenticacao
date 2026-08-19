const IP_API = process.env.IP_API;
import { Checkbox } from 'expo-checkbox';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { API_URL } from "../services/api";

export type FormErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export default function RegisterPage() {
  const navigation: any = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleRegister = async () => {
    setErrors({});
    setServerError("");
    setLoading(true);

    if (
      password !== confirmPassword ||
      password == "" ||
      confirmPassword == ""
    ) {
      setErrors({
        confirmPassword: ["Passwords not equals"],
      });

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);

        if (data.details) {
          const newErrors: FormErrors = {};

          data.details.forEach((error: { field: string; message: string }) => {
            const field = error.field as keyof FormErrors;

            if (!newErrors[field]) {
              newErrors[field] = [];
            }

            newErrors[field]!.push(error.message);
          });

          setErrors(newErrors);
        }

        return;
      }

      console.log("registration pending - ", data);

      setLoading(false);

      navigation.navigate("VerifyPageRegister", {
        email: email.trim().toLowerCase(),
      });
    } catch (error) {
      console.error(
        "error when try to connect to api",
        error,
        "\nCheck the API IP address",
      );

      setServerError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create account</Text>

        <Text style={styles.subtitle}>
          Fill in your details to create your account
        </Text>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>

          <TextInput
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            style={[styles.input, errors.name && styles.inputError]}
          />

          {errors.name?.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            placeholder="your@email.com"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, errors.email && styles.inputError]}
          />

          {errors.email?.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, errors.password && styles.inputError]}
          />

          {errors.password?.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm password</Text>

          <TextInput
            placeholder="Enter your password again"
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, errors.confirmPassword && styles.inputError]}
          />


          {errors.confirmPassword?.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
        <View style={styles.showPassword}>
          <Checkbox onValueChange={()=>{setShowPassword(!showPassword)}} value={showPassword} style={styles.checkbox}/>
          <Text style={styles.label}>Show passwords</Text>
        </View>

        {serverError && <Text style={styles.serverError}>{serverError}</Text>}

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.registerButtonText}>
            {loading ? "Creating account..." : "Create account"}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    margin: 0,
  },
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
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 16,
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
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },

  serverError: {
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },

  successContainer: {
    backgroundColor: "#dcfce7",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },

  successText: {
    color: "#166534",
    textAlign: "center",
    fontWeight: "600",
  },

  registerButton: {
    height: 52,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },

  loginText: {
    color: "#6b7280",
    fontSize: 14,
  },

  loginLink: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "700",
  },
});
