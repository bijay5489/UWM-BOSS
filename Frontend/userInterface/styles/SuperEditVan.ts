import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerText: { fontSize: 20, fontWeight: 'bold' },
    input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 16 },
    updateButton: { backgroundColor: '#007bff', padding: 15, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16 },
    inputContainer: {
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default styles;