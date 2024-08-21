import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";

type Props = {
  onSelectCard: (message: string) => void;
};
const PredefinedMessages = [
  { title: "Explain React Native", text: "like I'm five years old" },
  {
    title: "Suggest fun activites",
    text: "for a family visting San Francisco",
  },
  { title: "Recommend a dish", text: "to impress a date who's a picky eater" },
];
const MessageIdeas = ({ onSelectCard }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 16,
          paddingVertical: 10,
        }}
      >
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onSelectCard(`${message.title} ${message.text}`)}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              {message.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.grey,
              }}
            >
              {message.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MessageIdeas;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.input,
    padding: 14,
    borderRadius: 10,
  },
});
