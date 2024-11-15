import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,},
    queueText: {fontSize: 24, fontWeight: 'bold', marginBottom: 20,},
    positionText: {fontSize: 48, fontWeight: 'bold', marginBottom: 40,},
    leaveQueueButton: {backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 5, width: '100%',},
    leaveQueueText: {color: 'white', fontSize: 18,},
    nextRideText: {fontSize: 16, color: 'red', textAlign: 'center', marginVertical: 20,},
});

export default styles;