import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "@/utils/Storage";
import { defaultStyles } from "@/constants/Styles";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
type Props = {};

const settings = (props: Props) => {
  const [key, setKey] = useMMKVString("apiKey", Storage);
  const [organization, setOrganization] = useMMKVString("org", Storage);

  const [apiKey, setApiKey] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const { signOut } = useAuth();
  const router = useRouter();
  const saveApiKey = () => {
    setKey(apiKey);
    setOrganization(organizationName);
    router.navigate("/(auth)/(drawer)");
  };

  const removeApiKey = () => {
    setKey("");
    setOrganization("");
  };

  return (
    <View style={styles.container}>
      {key && key !== "" && (
        <>
          <Text style={styles.label}>You are all set!</Text>
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={removeApiKey}
          >
            <Text style={styles.buttonText}>Remove API KEY</Text>
          </TouchableOpacity>
        </>
      )}
      {(!key || key === "") && (
        <>
          <Text style={styles.label}>API KEY & Organization:</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Enter your API KEY"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={organizationName}
            onChangeText={setOrganizationName}
            placeholder="Enter your Organization"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[defaultStyles.btn, { backgroundColor: Colors.primary }]}
            onPress={saveApiKey}
          >
            <Text style={styles.buttonText}>Save API KEY</Text>
          </TouchableOpacity>
        </>
      )}

      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
