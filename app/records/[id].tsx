import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Record {
  id: number;
  date: string;
  po_number: string;
  location_from: string;
  location_to: string;
  dh_miles: string | number;
  miles: string | number;
  fuel: string | number;
  food: string | number;
  lumper: string | number;
  pay: string | number;
}

const RecordDetail: React.FC = () => {
  const [record, setRecord] = useState<Record | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user || !user.access) {
          throw new Error('No user token found');
        }
        const response = await axios.get(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setRecord(response.data);
      } catch (error) {
        console.error('There was an error fetching the record!', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => router.replace('/login'), 3000);
        } else {
          setError('An error occurred while fetching the record. Please try again.');
        }
      }
    };

    fetchRecord();
  }, [id, router]);

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Record Detail',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>PO Number:</Text>
          <Text style={styles.value}>{record.po_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{record.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{record.location_from}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{record.location_to}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>DH Miles:</Text>
          <Text style={styles.value}>{formatNumber(record.dh_miles)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Miles:</Text>
          <Text style={styles.value}>{formatNumber(record.miles)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fuel:</Text>
          <Text style={styles.value}>${formatNumber(record.fuel)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Food:</Text>
          <Text style={styles.value}>${formatNumber(record.food)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Lumper:</Text>
          <Text style={styles.value}>${formatNumber(record.lumper)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pay:</Text>
          <Text style={styles.value}>${formatNumber(record.pay)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => router.push(`../records/${record.id}/edit`)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecordDetail;