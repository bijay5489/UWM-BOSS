import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import ThemedText from '../../components/ThemedText';
import ThemedView from '../../components/ThemedView';
import Card from '../../components/Card';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "@/components/navigation/NavigationTypes";
import {Ionicons} from "@expo/vector-icons";
import viewReportStyles from '../../styles/ViewReports';
import baseStyles from '../../styles/General';

const styles = { ...baseStyles, ...viewReportStyles };

type Report = {
    id: number;
    reporter: string;
    report_type: string;
    context: string;
};

type ViewReportsPageNavigationProp = StackNavigationProp<RootStackParamList, 'ViewReports'>;

const ViewReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<ViewReportsPageNavigationProp>();

    useFocusEffect(
        React.useCallback(() => {
            fetchReports();
        }, [])
    );

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/report/generateReport/', {
                method: 'GET',
                headers: {},
            });
            const data = await response.json();
            setReports(data);
        } catch (error) {
            Alert.alert("Error", "Unable to fetch reports.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        navigation.navigate('GenerateReport');
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-circle" size={30} color="black"/>
                </TouchableOpacity>
                <ThemedText type="title" style={styles.headerText}>View Reports</ThemedText>
                <TouchableOpacity style={styles.squareButton} onPress={handleGenerateReport}>
                    <Ionicons name="create-outline" size={24} color="white"/>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator}/>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {reports.map((report) => (
                        <Card
                            key={report.id}
                            title={`Report Type: ${report.report_type}`}
                            description={`Reporter: ${report.reporter}\nContext: ${report.context}`}
                            buttonLabel={undefined} onPress={undefined}
                            iconName="alert-circle"
                        />
                    ))}
                </ScrollView>
            )}
        </ThemedView>
    );
};

export default ViewReports;
