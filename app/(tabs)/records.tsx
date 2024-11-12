import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Record {
  id: number;
  date: string;
  po_number: string;
  location_from: string;
  location_to: string;
  miles: number;
  pay: number;
}

type SortKey = keyof Record;
type SortOrder = 'asc' | 'desc';

const RecordList: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchRecords = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.access) {
        throw new Error('No user token found');
      }
      const response = await axios.get('https://kodaklogisticsapi.up.railway.app/api/records/', {
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
      });
      setRecords(response.data);
    } catch (error) {
      console.error('There was an error fetching the records!', error);
      setError('Failed to fetch records. Please try again.');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              const userString = await AsyncStorage.getItem('user');
              const user = userString ? JSON.parse(userString) : null;
              if (!user || !user.access) {
                throw new Error('No user token found');
              }
              await axios.delete(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
                headers: {
                  Authorization: `Bearer ${user.access}`,
                },
              });
              fetchRecords();
            } catch (error) {
              console.error('There was an error deleting the record!', error);
              setError('Failed to delete record. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleSort = (key: SortKey) => {
    setSortOrder(sortOrder === 'asc' && sortKey === key ? 'desc' : 'asc');
    setSortKey(key);
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredRecords = sortedRecords.filter(record =>
    Object.values(record).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const renderItem = ({ item }: { item: Record }) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordText}>{new Date(item.date).toLocaleDateString()} - {item.po_number}</Text>
      <Text style={styles.recordText}>${item.pay.toFixed(2)}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => router.push(`../records/${item.id}`)}>
          <Ionicons name="eye-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`../records/${item.id}/edit`)}>
          <Ionicons name="create-outline" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Transport Records',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('../records/new')}>
              <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search records..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={filteredRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default RecordList;