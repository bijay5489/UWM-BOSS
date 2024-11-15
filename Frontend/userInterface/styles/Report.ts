import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    input: {height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff', padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,},
    submitButton: {backgroundColor: '#4a90e2', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5,},
    submitText: {color: 'white', fontWeight: '600'},
    dropdownContainer: {marginBottom: 20,},
});

export default styles;