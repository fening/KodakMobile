import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Record {
  date: string;
  po_number: string;
  location_from: string;
  location_to: string;
  dh_miles: string;
  miles: string;
  fuel: string;
  food: string;
  lumper: string;
  pay: string;
}

const RecordForm: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [record, setRecord] = useState<Record>({
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
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchRecord = async () => {
        try {
          const userString = await AsyncStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          if (!user || !user.access) {
            throw new Error('No user token found');
          }
          const response = await axios.get(`http://127.0.0.1:8000/api/records/${id}/`, {
            headers: { Authorization: `Bearer ${user.access}` },
          });
          setRecord(response.data);
        } catch (error) {
          console.error('Error fetching the record:', error);
          setError('Failed to fetch record. Please try again.');
        }
      };
      fetchRecord();
    }
  }, [isEditing, id]);

  const handleChange = (name: keyof Record, value: string) => {
    setRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.access) {
        throw new Error('No user token found');
      }
      const axiosConfig = {
        headers: { Authorization: `Bearer ${user.access}` },
      };

      if (isEditing) {
        await axios.put(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, record, axiosConfig);
      } else {
        await axios.post('https://kodaklogisticsapi.up.railway.app/api/records/add/', record, axiosConfig);
      }
      router.push('/');
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} the record:`, error);
      setError(`Failed to ${isEditing ? 'update' : 'create'} record. Please try again.`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: isEditing ? 'Edit Record' : 'Add Record' }} />
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={record.date}
        onChangeText={(value) => handleChange('date', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="PO Number"
        value={record.po_number}
        onChangeText={(value) => handleChange('po_number', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location From"
        value={record.location_from}
        onChangeText={(value) => handleChange('location_from', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location To"
        value={record.location_to}
        onChangeText={(value) => handleChange('location_to', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="DH Miles"
        value={record.dh_miles}
        onChangeText={(value) => handleChange('dh_miles', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Miles"
        value={record.miles}
        onChangeText={(value) => handleChange('miles', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fuel"
        value={record.fuel}
        onChangeText={(value) => handleChange('fuel', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Food"
        value={record.food}
        onChangeText={(value) => handleChange('food', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Lumper"
        value={record.lumper}
        onChangeText={(value) => handleChange('lumper', value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Pay"
        value={record.pay}
        onChangeText={(value) => handleChange('pay', value)}
        keyboardType="numeric"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Create'} Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RecordForm;