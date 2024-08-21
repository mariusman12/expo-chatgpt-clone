import { StyleSheet, Text, View } from "react-native";
import * as DropDownMenu from "zeego/dropdown-menu";
import React from "react";
import Colors from "@/constants/Colors";

export type HeaderDropDownProps = {
  title: string;
  selected?: string;
  onSelect: (key: string) => void;
  items: Array<{ key: string; title: string; icon: string }>;
};

const HeaderDropDown = ({
  title,
  selected,
  onSelect,
  items,
}: HeaderDropDownProps) => {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "500", fontSize: 16 }}>{title}</Text>
          {selected && (
            <Text
              style={{
                marginLeft: 10,
                color: Colors.greyLight,
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              {selected}
            </Text>
          )}
        </View>
      </DropDownMenu.Trigger>
      <DropDownMenu.Content>
        {items.map((item) => (
          <DropDownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropDownMenu.ItemTitle>{item.title}</DropDownMenu.ItemTitle>
            <DropDownMenu.ItemIcon
              ios={{
                name: item.icon,
                pointSize: 18,
              }}
            ></DropDownMenu.ItemIcon>
          </DropDownMenu.Item>
        ))}
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
};

export default HeaderDropDown;

const styles = StyleSheet.create({});
