import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    labelText: {fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 10},
    infoText: {fontSize: 16, color: 'black', marginBottom: 10},
    cancelButton: {backgroundColor: 'red', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 20},
    messageButton: {backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10, marginTop: 10},
    buttonText: {color: 'white', fontSize: 16},
    modalContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'},
    modalContent: {width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10},
    modalTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
    inputBox: {height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 12, padding: 15, marginBottom: 20, marginTop: 10},
    modalActions: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
    modalButton: {backgroundColor: '#4a90e2', padding: 10, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center'},
});

export default styles;