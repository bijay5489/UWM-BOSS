import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: '#f2f2f2'},
    input: {height: 40, borderColor: 'black', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 10},
    errorText: {color: 'red', marginBottom: 10, textAlign: 'center'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
    headerText: {flex: 1, fontSize: 28, textAlign: 'center'},
    label: {fontSize: 16, marginBottom: 7, color: 'black'},
});

export default styles;