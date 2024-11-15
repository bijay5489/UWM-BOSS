import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    radioContainer: {flexDirection: 'row', alignItems: 'flex-start', marginVertical: 15, justifyContent: 'center'},
    radioButton: {flexDirection: 'row', alignItems: 'center', marginRight: 15},
    radioOuterCircle: {width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: 'gray', justifyContent: 'center', alignItems: 'center', margin: 10},
    radioInnerCircle: {width: 10, height: 10, borderRadius: 5, backgroundColor: 'blue'},
});
export default styles;