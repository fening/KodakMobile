import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewRecord() {
  const [record, setRecord] = useState({
    date: '',
    po_number: '',
    location_from: '',
    location_to: '',
    dh_miles: '',
    miles: '',
    fuel: '',
    food: '',
    lumper: '',
    pay: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (name: string, value: string) => {
    setRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.access) {
        throw new Error('No user token found');
      }
      
      await axios.post('https://kodaklogisticsapi.up.railway.app/api/records/add/', record, {
        headers: { Authorization: `Bearer ${user.access}` },
      });
      
      router.push('/records');
    } catch (error) {
      console.error('Error creating record:', error);
      setError('Failed to create record. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Add New Record' }} />
      <Text style={styles.title}>Create New Record</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Date"
        placeholderTextColor="#999"
        value={record.date}
        onChangeText={(value) => handleChange('date', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="PO Number"
        placeholderTextColor="#999"
        value={record.po_number}
        onChangeText={(value) => handleChange('po_number', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="From"
        placeholderTextColor="#999"
        value={record.location_from}
        onChangeText={(value) => handleChange('location_from', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="To"
        placeholderTextColor="#999"
        value={record.location_to}
        onChangeText={(value) => handleChange('location_to', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="DH Miles"
        placeholderTextColor="#999"
        value={record.dh_miles}
        onChangeText={(value) => handleChange('dh_miles', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Miles"
        placeholderTextColor="#999"
        value={record.miles}
        onChangeText={(value) => handleChange('miles', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fuel"
        placeholderTextColor="#999"
        value={record.fuel}
        onChangeText={(value) => handleChange('fuel', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Food"
        placeholderTextColor="#999"
        value={record.food}
        onChangeText={(value) => handleChange('food', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Lumper"
        placeholderTextColor="#999"
        value={record.lumper}
        onChangeText={(value) => handleChange('lumper', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Pay"
        placeholderTextColor="#999"
        value={record.pay}
        onChangeText={(value) => handleChange('pay', value)}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
  },
  button: {
    backgroundColor: '#ffd33d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#25292e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});