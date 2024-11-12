import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTextInput = styled(TextInput)
const StyledTouchableOpacity = styled(TouchableOpacity)

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      router.replace('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-gray-100 justify-center items-center p-6">
      <StatusBar style="auto" />
      
      <StyledTextInput
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6 text-lg"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <StyledTextInput
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-8 text-lg"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <StyledText className="text-red-500 mb-6 text-lg">{error}</StyledText> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <StyledTouchableOpacity
          className="bg-black font-bold text-lg py-4 px-6 rounded-lg w-full"
          onPress={handleLogin}
        >
          <StyledText className="text-white text-center font-bold text-x2">Login</StyledText>
        </StyledTouchableOpacity>
      )}
    </StyledView>
  );
}