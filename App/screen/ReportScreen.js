import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const ReportScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const logsRef = ref(db, 'logs');

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedLogs = Object.entries(data).map(([key, value]) => {
          const timestamp = new Date(value.updatedAt);
          const formattedTimestamp = `${(timestamp.getMonth() + 1).toString().padStart(2, '0')}/${timestamp
            .getDate()
            .toString()
            .padStart(2, '0')}/${timestamp.getFullYear()} ${timestamp
            .getHours()
            .toString()
            .padStart(2, '0')}:${timestamp
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${timestamp
            .getSeconds()
            .toString()
            .padStart(2, '0')}`;

          return {
            id: key,
            ...value,
            mode: value.isAutomatic === true ? 'Automatic' : 'Manual',
            formattedTimestamp,
          };
        });
        setLogs(formattedLogs.reverse()); // Reverse the array here
      } else {
        setLogs([]);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}><Text style={styles.bold}>User:</Text> {item.user}</Text>
      <Text style={styles.logText}><Text style={styles.bold}>Device Name:</Text> {item.deviceName}</Text>
      <Text style={styles.logText}><Text style={styles.bold}>Mode:</Text> {item.mode}</Text>
      <Text style={styles.logText}><Text style={styles.bold}>Updated At:</Text> {item.formattedTimestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading logs...</Text>
      ) : logs.length === 0 ? (
        <Text>No logs found.</Text>
      ) : (
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  logItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  logText: {
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default ReportScreen;



/* import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const ReportScreen = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const logsRef = ref(db, 'logs');

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usageMap = {};

        Object.entries(data).forEach(([key, value]) => {
          const { user, deviceName, updatedAt } = value;
          const date = new Date(updatedAt);
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

          if (!usageMap[deviceName]) {
            usageMap[deviceName] = {};
          }

          if (!usageMap[deviceName][formattedDate]) {
            usageMap[deviceName][formattedDate] = 0;
          }

          usageMap[deviceName][formattedDate] += 1; // Increment usage count
        });

        const chartData = Object.entries(usageMap).map(([deviceName, dateCounts]) => {
          return {
            deviceName,
            dates: Object.keys(dateCounts),
            counts: Object.values(dateCounts),
          };
        });

        setUsageData(chartData);
      } else {
        setUsageData([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Usage Report</Text>
      {usageData.length === 0 ? (
        <Text>No usage data available.</Text>
      ) : (
        usageData.map((device, index) => (
          <View key={index} style={styles.chartContainer}>
            <Text style={styles.deviceTitle}>{device.deviceName}</Text>
            <BarChart
              data={{
                labels: device.dates,
                datasets: [
                  {
                    data: device.counts,
                  },
                ],
              }}
              width={Dimensions.get('window').width - 32} // Adjust for padding
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={30}
            />
          </View>
        ))
      )}
    </View>
  );
};

const chartConfig = {
  backgroundColor: '#1cc910',
  backgroundGradientFrom: '#eff3ff',
  backgroundGradientTo: '#efefef',
  decimalPlaces: 0, // Display integers only
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 24,
  },
  deviceTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportScreen; */
