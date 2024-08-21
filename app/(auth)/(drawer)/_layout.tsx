import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { Link, useNavigation, useRouter } from "expo-router";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { deleteChat, getChats, renameChat } from "@/utils/Database";
import { Chat } from "@/utils/Interfaces";
import { useSQLiteContext } from "expo-sqlite";
import * as ContextMenu from "zeego/context-menu";
type Props = {};

export const CustomDrawerContent = (props: any) => {
  const [history, setHistory] = useState<any>([]);
  const { bottom, top } = useSafeAreaInsets();
  const isDrawerOpen = useDrawerStatus() === "open";
  const db = useSQLiteContext();
  const router = useRouter();
  useEffect(() => {
    if (isDrawerOpen) {
      loadChats();
    }
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  const loadChats = async () => {
    console.log("Chats loaded");
    const result = await getChats(db);
    console.log("Chaturile : ", result);
    setHistory(result);
  };

  const onDeleteChat = async (id: number) => {
    Alert.alert("Delete chat", "Are you sure you want to delte this chat?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await deleteChat(db, id);
          loadChats();
        },
      },
    ]);
  };

  const onRenameChat = async (id: number) => {
    Alert.prompt(
      "Rename Chat",
      "Enter a new name for the chat",
      async (newName) => {
        await renameChat(db, id, newName);
        loadChats();
      }
    );
  };

  return (
    <View style={{ flex: 1, marginTop: top }}>
      <View style={{ backgroundColor: "#fff", paddingBottom: 16 }}>
        <View style={styles.searchSection}>
          <Ionicons
            style={styles.searchIcon}
            name="search"
            size={20}
            color={Colors.grey}
          />
          <TextInput
            style={styles.input}
            placeholder="search"
            underlineColorAndroid={"transparent"}
          />
        </View>
      </View>
      <DrawerContentScrollView
        contentContainerStyle={{
          paddingTop: 0,
        }}
        {...props}
      >
        <DrawerItemList {...props} />
        {history.map((chat) => (
          <ContextMenu.Root key={chat.id}>
            <ContextMenu.Trigger>
              <DrawerItem
                label={chat.title}
                inactiveTintColor="black"
                onPress={() =>
                  router.push(`/(auth)/(drawer)/(chat)/${chat.id}`)
                }
              ></DrawerItem>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Preview>
                {() => (
                  <View
                    style={{
                      padding: 16,
                      height: 200,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text>{chat.title}</Text>
                  </View>
                )}
              </ContextMenu.Preview>

              <ContextMenu.Item
                key={"rename"}
                onSelect={() => onRenameChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Rename</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: "pencil",
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
              <ContextMenu.Item
                key={"delete"}
                onSelect={() => onDeleteChat(chat.id)}
              >
                <ContextMenu.ItemTitle>Remove</ContextMenu.ItemTitle>
                <ContextMenu.ItemIcon
                  ios={{
                    name: "trash",
                    pointSize: 18,
                  }}
                />
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        ))}
      </DrawerContentScrollView>
      <View style={{ padding: 16, paddingBottom: bottom }}>
        <Link href={"/(auth)/(modal)/settings"} asChild>
          <TouchableOpacity style={styles.footer}>
            <Image
              source={require("../../../assets/images/logos.png")}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Man Marius</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={24}
              color={Colors.greyLight}
            />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const Layout = (props: Props) => {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
            style={{ marginLeft: 16 }}
          >
            <FontAwesome6 name="grip-lines" size={20} color={Colors.grey} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: Colors.light,
        },
        headerShadowVisible: false,
        drawerActiveTintColor: "#000",
        drawerInactiveTintColor: "#000",
        drawerActiveBackgroundColor: Colors.selected,
        overlayColor: "rgba(0,0,0,0.2)", // overlay
        drawerItemStyle: { borderRadius: 12 }, //
        drawerLabelStyle: { marginLeft: -20 }, // label mai in stanga
        drawerStyle: { width: dimensions.width * 0.86 }, // mai mult deschidere pentru chat
      }}
    >
      <Drawer.Screen
        name="(chat)/new"
        options={{
          title: "Chat GPT",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "black" }]}>
              <Image
                source={require("@/assets/images/logo-white.png")}
                style={styles.btnImage}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(auth)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="(chat)/[id]"
        options={{
          drawerItemStyle: {
            display: "none",
          },
          headerRight: () => (
            <Link href="/(auth)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="dalle"
        options={{
          title: "Dall E",
          drawerIcon: () => (
            <View style={[styles.item, { backgroundColor: "black" }]}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.dallEImage}
              />
            </View>
          ),
          headerRight: () => (
            <Link href="/(auth)/(drawer)/(chat)/new" push asChild>
              <TouchableOpacity>
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={Colors.grey}
                  style={{ marginRight: 16 }}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: "Explore GTPs",
          drawerIcon: () => (
            <View style={[styles.itemExplore]}>
              <Ionicons name="apps-outline" size={24} color={"#000"} />
            </View>
          ),
        }}
      />
    </Drawer>
  );
};

export default Layout;

const styles = StyleSheet.create({
  item: {
    borderRadius: 15,
    overflow: "hidden",
  },
  btnImage: {
    margin: 6,
    width: 20,
    height: 20,
  },
  dallEImage: {
    width: 28,
    height: 28,
    resizeMode: "cover",
  },
  itemExplore: {
    backgroundColor: "#fff",
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  searchSection: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.input,
    borderRadius: 10,
    height: 34,
  },
  searchIcon: {
    padding: 6,
  },
  input: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 0,
    alignItems: "center",
    color: "#424242",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  userName: {
    flex: 1,
    fontWeight: "600",
    fontSize: 16,
  },
});
