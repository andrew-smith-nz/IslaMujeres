import {StyleSheet} from 'react-native';

export default StyleSheet.create({

    locationHeading: { fontWeight:'bold', fontSize:12, textAlign:'left' },
    locationText: { fontSize:12, textAlign:'left' },








    flexColumn: { flexDirection: 'column' },
    leftRow: { flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start' },
    centerRow: { flexDirection: 'row', alignItems: 'center', justifyContent:'center' },
    rightRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent:'flex-end' },
    input: { flex: 1, margin: 10, borderStyle:'solid', borderColor:'#cccccc', borderWidth:1, paddingLeft:5, paddingRight:5, paddingTop:0, paddingBottom:0 },
    container: { margin: 5, padding: 5},
    smallLink: {fontSize: 10, color:'#4682b4'},
    link: {color:'#4682b4'},
    centeredText: {textAlign:'center'},
    titleText: { textAlign: 'left', fontSize: 20 },
    divider: { borderBottomColor: '#004A7F', borderBottomWidth: 1 },
    headerLogo: {height:36, width:72, margin:5},
    headerBurger: {height:32, width:32, margin:5},
    steelBlue: { color: '#004A7F' },

    
    tableRow: {
        borderTopWidth:1,
        borderTopColor:'black',
        borderLeftWidth:1,
        borderLeftColor:'black',
        borderRightWidth:1,
        borderRightColor:'black',
        padding:10,
    },
    tableRowLast: {
        borderBottomWidth:1,
        borderBottomColor:'black',},
   actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
});