import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    timePickerContainer: {alignItems: 'center', justifyContent: 'center', marginBottom: 10, zIndex: 10},
    timeButton: {height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#fff'},
    timeText: {fontSize: 16, color: '#333'},
    slider: {width: '100%', height: 40, marginBottom: 15},
    toggleContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10},
    createRideButton: {height: 50, backgroundColor: '#007bff', alignItems: 'center', justifyContent: 'center', borderRadius: 10},
    createRideText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
    suggestionContainer: {backgroundColor: 'white', borderRadius: 5, elevation: 3, padding: 5},
    suggestion: {padding: 10},
    timeInput: {height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15, backgroundColor: '#fff',},
});

export default styles;