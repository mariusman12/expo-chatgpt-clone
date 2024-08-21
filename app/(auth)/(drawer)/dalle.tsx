import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import OpenAi from "react-native-openai";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";
import MessagesInput from "@/components/MessagesInput";
import { ScrollView } from "react-native-gesture-handler";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/Interfaces";
import ChatMessage from "@/components/ChatMessage";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "@/utils/Storage";
import OpenAI from "react-native-openai";
import Colors from "@/constants/Colors";

type Props = {};

const dummyMessages = [
  {
    role: Role.User,
    content: "",
    imageUrl:
      "https://img.freepik.com/free-photo/astronaut-diving-digital-art_23-2151198182.jpg?t=st=1724223418~exp=1724227018~hmac=d422854ebd5cde689dbe106b3017685130cb8fabae3c3125d9b51ef3031bd5ac&w=1380",
    prompt:
      "A meerkat astronaut in a futuristic spacesuit, standing upright on a rocky, alien landscape resembling the surface of Mars. The spacesuit is highly detailed with reflective visor and intricate life-support systems. The background shows a distant starry sky and a small Earth visible in the far horizon. The meerkat looks curious and brave, embodying the spirit of exploration.",
  },
];

const dalle = (props: Props) => {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [height, setHeight] = useState(0);
  const [key, setKey] = useMMKVString("apiKey", Storage);
  const [organization, setOrganization] = useMMKVString("org", Storage);
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", Storage);
  const [working, setWorking] = useState(false);
  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);

  console.log("Cheia este: ", key);
  console.log("ORG este: ", organization);
  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href={"/(auth)/(modal)/settings"} />;
  }

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout; // get the height
    console.log(height);
    setHeight(height);
  };

  const getCompletion = async (message: string) => {
    setWorking(true);

    setMessages([...messages, { role: Role.User, content: message }]);

    const result = await openAI.image.create({
      prompt: message,
    });
    console.log("Restul = ", result);
    if (result.data && result.data.length > 0) {
      const imageUrl = result.data[0].url;
      setMessages((prev) => [
        ...prev,
        { role: Role.Bot, content: "", imageUrl, prompt: message },
      ]);
    }
    setWorking(false);
  };

  useEffect(() => {
    const handleMessage = (payload: any) => {
      console.log("mesaj received", payload);
      setMessages((messages) => {
        const newMessage = payload.choices[0]?.delta.content;
        console.log("New messahe=", newMessage);
        if (newMessage) {
          messages[messages.length - 1].content += newMessage;
          return [...messages];
        }

        if (payload.choices[0]?.finishReason) {
          // Save the message
          console.log("Stream ended");
        }

        return messages;
      });
    };

    openAI.chat.addListener("onChatMessageReceived", handleMessage);

    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="Dall·E"
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "square.and.arrow.up",
                },
                { key: "details", title: "See Details", icon: "info.circle" },
                { key: "keep", title: "Keep in Sidebar", icon: "pin" },
              ]}
              onSelect={() => {}}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View
            style={{
              marginTop: height / 2 - 100,
              gap: 16,
              alignItems: "center",
            }}
          >
            <View style={[styles.logoContainer]}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.label}>
              Let me turn your imagination into imagery
            </Text>
          </View>
        )}

        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessage {...item} />}
          keyExtractor={(item, index) => index.toString()}
          keyboardDismissMode="on-drag" // dissmiss keyboard on list move
          estimatedItemSize={400}
          contentContainerStyle={{
            paddingBottom: 150,
            paddingTop: 30,
          }}
          ListFooterComponent={
            <>
              {working && (
                <ChatMessage
                  {...{ role: Role.Bot, content: "", loading: true }}
                />
              )}
            </>
          }
        />
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <MessagesInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default dalle;

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    backgroundColor: "black",
    borderRadius: 50,
    overflow: "hidden",
    borderColor: Colors.greyLight,
    borderWidth: 1,
  },
  image: {
    resizeMode: "contain",
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});
