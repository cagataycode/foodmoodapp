import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FoodMood</Text>

      <Text style={styles.subtitle}>
        Discover amazing recipes and share your food journey
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>Welcome to FoodMood App</Text>
        <Text style={styles.cardSubtext}>Your personal recipe companion</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/auth/signin")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0dfe8",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 32,
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 40,
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#3498db",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#3498db",
  },
});
