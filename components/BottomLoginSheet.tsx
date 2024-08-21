import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

type Props = {}

const BottomLoginSheet = (props: Props) => {

    const {bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container,{paddingBottom:bottom}]}>
     <TouchableOpacity style={[defaultStyles.btn,styles.btnLight]}>
        <Ionicons name="logo-apple" size={20} style={styles.btnIcon}/>
        <Text style={styles.btnLightText}> Continue with Apple </Text>
     </TouchableOpacity>

        <TouchableOpacity style={[defaultStyles.btn,styles.btnDark]}>
            <Ionicons name="logo-google" size={20} style={styles.btnIcon} color={'#fff'}/>
            <Text style={styles.btnDarkText}> Continue with Google </Text>
        </TouchableOpacity>
        <Link href={{
            pathname:'/login',
            params:{type:"register"}
         }}   asChild style={[defaultStyles.btn,styles.btnDark]}>
            <TouchableOpacity >
                <Ionicons name="mail" size={20} style={styles.btnIcon} color={'#fff'}/>
                <Text style={styles.btnDarkText}> Sign Up with Email </Text>
            </TouchableOpacity>
         </Link>
         <Link href={{
            pathname:'/login',
            params:{type:"login"}
         }} asChild style={[defaultStyles.btn,styles.btnDark]}>
            <TouchableOpacity >
                <Ionicons name="mail" size={20} style={styles.btnIcon} color={'#fff'}/>
                <Text style={styles.btnDarkText}> Log in with Email </Text>
            </TouchableOpacity>
         </Link>
    </View>
  )
}

export default BottomLoginSheet

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: '#000',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 26,
      gap: 14,
    },
    btnLight: {
      backgroundColor: '#fff',
    },
    btnLightText: {
      color: '#000',
      fontSize: 20,
    },
    btnDark: {
      backgroundColor: Colors.grey,
    },
    btnDarkText: {
      color: '#fff',
      fontSize: 20,
    },
    btnOutline: {
      borderWidth: 3,
      borderColor: Colors.grey,
    },
    btnIcon: {
      paddingRight: 6,
    },
  });