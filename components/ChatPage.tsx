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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import HeaderDropDown from "@/components/HeaderDropDown";
import MessagesInput from "@/components/MessagesInput";
import { ScrollView } from "react-native-gesture-handler";
import MessageIdeas from "@/components/MessageIdeas";
import { Message, Role } from "@/utils/Interfaces";
import ChatMessage from "@/components/ChatMessage";
import { useMMKVString } from "react-native-mmkv";
import { Storage } from "@/utils/Storage";
import OpenAI from "react-native-openai";
import { useSQLiteContext } from "expo-sqlite";
import { addChat, addMessage, getMessages } from "@/utils/Database";

type Props = {};

const ChatPage = (props: Props) => {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [height, setHeight] = useState(0);
  const [key, setKey] = useMMKVString("apiKey", Storage);
  const [organization, setOrganization] = useMMKVString("org", Storage);
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", Storage);
  const [chatId, _setChatId] = useState<string>("");
  const chatIdRef = useRef(chatId);
  const { id } = useLocalSearchParams<string>("");
  function setChatId(id: string) {
    chatIdRef.current = id;
    _setChatId(id);
  }

  const db = useSQLiteContext();

  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);

  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href={"/(auth)/(modal)/settings"} />;
  }

  useEffect(() => {
    if (id) {
      console.log("Load for chat id ", id);
      getMessages(db, parseInt(id)).then((messages) => {
        setMessages(messages);
        console.log("Got messages = ", messages);
      });
    }
  }, [id]);

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout; // get the height
    console.log(height);
    setHeight(height);
  };

  const getCompletion = async (message: string) => {
    w;

    console.log("Am trimis message");
    if (messages.length === 0) {
      const result = await addChat(db, message);
      console.log("Result is ", result);
      const chatID = result.lastInsertRowId;
      setChatId(chatID.toString());
      console.log("chatID is ", chatID);
      addMessage(db, chatID, { content: message, role: Role.User });
    }

    const newMessages = [
      ...messages,
      { role: Role.User, content: message },
      { role: Role.Bot, content: "" },
    ];
    setMessages(newMessages);
    openAI.chat.stream({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: gptVersion === "4" ? "gpt-4" : "gpt-3.5-turbo",
    });
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

          addMessage(db, parseInt(chatIdRef.current), {
            content: messages[messages.length - 1].content,
            role: Role.User,
          });
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
              title="ChatGPT"
              items={[
                { key: "4o", title: "GTP 4o", icon: "bolt" },
                { key: "4o-mini", title: "GTP 4o-mini", icon: "sparkles" },
                { key: "4", title: "GPT4", icon: "save" },
              ]}
              onSelect={(key) => {
                setGptVersion(key);
              }}
              selected={gptVersion}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.image}
            />
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
        {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
        <MessagesInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "black",
    borderRadius: 50,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
