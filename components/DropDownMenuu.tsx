import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as DropDownMenu from "zeego/dropdown-menu";
import { Ionicons } from "@expo/vector-icons";

export type Props = {
  items: Array<{
    key: string;
    title: string;
    icon: string;
  }>;
  onSelect: (key: string) => void;
};

export default function DropDownMenuu({ items, onSelect }: Props) {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger>
        <Ionicons name="ellipsis-horizontal" size={24} color={"#fff"} />
      </DropDownMenu.Trigger>
      <DropDownMenu.Content>
        {items.map((item) => (
          <DropDownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropDownMenu.ItemTitle>{item.title}</DropDownMenu.ItemTitle>
            <DropDownMenu.ItemIcon ios={{ name: item.icon, pointSize: 18 }} />
          </DropDownMenu.Item>
        ))}
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
}

const styles = StyleSheet.create({});
