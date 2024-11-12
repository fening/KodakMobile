// app/index.tsx
import 'expo-dev-client';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth'; // To handle logout
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Clear user data and logout
    router.replace('/(auth)/login'); // Redirect to login after logout
  };

  interface Record {
    id: number;
    date: string;
    po_number: string;
    miles: number;
    pay: number;
  }

  interface DashboardData {
    totalMiles: number;
    totalPay: number;
    recordCount: number;
    recentRecords: Record[];
    monthlyData: { month: string; miles: number; pay: number }[];
  }

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const userString = await AsyncStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          if (!user || !user.access) {
            throw new Error('No user token found');
          }
          const response = await axios.get('https://kodaklogisticsapi.up.railway.app/api/dashboard/', {
            headers: {
              Authorization: `Bearer ${user.access}`,
            },
          });
          setDashboardData(response.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          setError('Failed to fetch dashboard data. Please try again.');
        }
      };

      fetchDashboardData();
    }, []);

    if (error) return <Text style={styles.errorText}>{error}</Text>;
    if (!dashboardData) return <Text style={styles.loadingText}>Loading...</Text>;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Miles</Text>
            <Text style={styles.statValue}>{dashboardData.totalMiles.toFixed(2)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Pay</Text>
            <Text style={styles.statValue}>{formatCurrency(dashboardData.totalPay)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Records</Text>
            <Text style={styles.statValue}>{dashboardData.recordCount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Records</Text>
          {dashboardData.recentRecords.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={styles.recordItem}
              onPress={() => router.push(`../records/${record.id}`)}
            >
              <Text style={styles.recordText}>
                {record.date} - {record.po_number} - {formatCurrency(record.pay)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <BarChart
            data={{
              labels: dashboardData.monthlyData.map((d) => d.month),
              datasets: [
                {
                  data: dashboardData.monthlyData.map((d) => d.miles),
                },
              ],
            }}
            width={300}
            height={220}
            yAxisSuffix=""
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('../records/new')}>
            <Text style={styles.buttonText}>Add New Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('../records')}
          >
            <Text style={styles.buttonText}>View All Records</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.welcomeText}>Welcome back, {user?.user.username}!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recordItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordText: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
