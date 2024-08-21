import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useSignIn, useSignUp } from '@clerk/clerk-expo';


type Props = {}

const Page = (props: Props) => {
    const {type} = useLocalSearchParams<{type:string}>()
    const [loading,setLoading] = useState(false)
    const [emailAddress,setEmailAddress] = useState('test@gmail.com')
    const [password,setPassword] = useState('test')

    const { signIn, setActive, isLoaded } = useSignIn();
    const { signUp, isLoaded: signUpLoaded, setActive: signupSetActive } = useSignUp();
    const onSignUpPress = async () =>{
      if (!signUpLoaded)return;
      setLoading(true)
      try{
        const result = await signUp.create({emailAddress,password})
        signupSetActive({
          session: result.createdSessionId
        })
      }catch(error) {
        console.log('Error la Sign Up')
      }finally{
        setLoading(false)
      }
    }

    const onSignInPress = async () =>{
      if (!isLoaded) return;
      setLoading(true)
      try{
        const result = await signIn.create({identifier:emailAddress,password})
        setActive({
          session: result.createdSessionId
        })
      }catch(error) {
        console.log('Error la Sign Up')
      }finally{
        setLoading(false)
      }
    }
    

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding':'height'}
    keyboardVerticalOffset={1} 
    
    style={styles.container}
    >
        {loading &&(
            <View style={defaultStyles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        )}
        <Image source={require('../assets/images/logo-dark.png')} style={styles.logo} />
        <Text style={styles.title}>
            {type === 'login' ? 'Welcome Back' : 'Create your account'}
        </Text>


        <View style={{
            marginBottom:30
        }}>
            <TextInput autoCapitalize='none' value={emailAddress} onChangeText={setEmailAddress} placeholder='Email' style={styles.inputField}  />
            <TextInput autoCapitalize='none' value={password} onChangeText={setPassword} placeholder='Password' style={styles.inputField} secureTextEntry  />

        </View>
        {type === 'login'?(
            <TouchableOpacity style={[defaultStyles.btn,styles.btnPrimary]} onPress={onSignInPress}>
                <Text style={styles.btnPrimaryText}>Login</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity style={[defaultStyles.btn,styles.btnPrimary]} onPress={onSignUpPress}>
            <Text style={styles.btnPrimaryText}>Register</Text>
        </TouchableOpacity>
        )}
    </KeyboardAvoidingView>
  )
}

export default Page

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      padding: 20,
    },
    logo: {
      width: 60,
      height: 60,
      alignSelf: 'center',
      marginVertical: 80,
    },
    title: {
      fontSize: 30,
      marginBottom: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    inputField: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderColor: Colors.primary,
      borderRadius: 12,
      padding: 10,
      backgroundColor: '#fff',
    },
    btnPrimary: {
      backgroundColor: Colors.primary,
      marginVertical: 4,
    },
    btnPrimaryText: {
      color: '#fff',
      fontSize: 16,
    },
  });