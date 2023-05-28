import React, { useContext, useState, useEffect} from "react";
import {Text, SafeAreaView, View, StyleSheet, Image, 
     TouchableOpacity, FlatList} from "react-native";
import BottomNavBar from "../components/nav/BottomNavBar";
import { FAB } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import axios from 'axios';
import { AuthContext } from "../contexts/auth";
import { TransactionContext } from "../contexts/transaction";

const Item = ({transaction}) => {
    const navigation = useNavigation();
    const [T_category, setT_category] = useState({});

    const getCategory = async () => {
        const {data} = await axios.get("/getCategory", {params: {categoryID: transaction.category}});
        setT_category(data);
    }
    useEffect(() => {
        getCategory();
    }, [transaction])

    return(
        <TouchableOpacity style={[styles.card_template, styles.listItem]} onPress={() => 
        navigation.navigate('CreateTransaction', {transaction, edit:true})}>
            <View style={styles.iconContainer}>
                <FontAwesome5Icon name={T_category.icon} size={20} color="black"/>
            </View>
            <Text style={[styles.text, {textAlign:'left'}]}>
                {T_category.name}
            </Text>
            <View style={{flexDirection:'column', alignItems: 'flex-end'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {marginHorizontal: 5,fontSize: 16}]}>
                        {transaction.type == "Income"?"+":"- "}{transaction.value} SR
                    </Text>
                </View>
                <Text style={{fontSize:11}}>{moment(transaction.date).format('DD-MM-YY')+" "+
                moment(transaction.time).format("hh:mmA")}</Text>
            </View>
            
        </TouchableOpacity>
    );
};

const Home = ({navigation}) => {
    const [state, setState] = useContext(AuthContext);
    const [transactions, setTransactions] = useContext(TransactionContext);
    const [name, setName ] = useState('');
    const [finInfo, setFinInfo] = useState({ balance: 0, income: 0, expense: 0});
    const [image, setImage] = useState({ url: "", public_id: ""});

    useEffect(()=> {
        if (state) {
            const {name, image, finInfo} = state.user;
            setName(name);
            setImage(image);
            setFinInfo(finInfo);
        }
    }, [transactions]);

    return(
    <SafeAreaView style={styles.mainContainer}>
        <View style={styles.infoContainer}>
            <Text style={[styles.subtitle, {textAlign: 'left', color: 'white'}]}>
                Hello, {name}
            </Text>
            {image && image.url != "" && image.url != undefined? (
                <Image source={{uri: image.url}} style={styles.profileImg} />
            ) : (
                <Image style={styles.profileImg}
                source={require('../assets/user.png')}/>
            )}
        </View>
        <View style={styles.SecondContainer}>
            <View style={styles.card_template}>
                <Text style={styles.text}>Balance</Text>
                 <Text style={styles.subtitle}>{finInfo.balance} SR</Text>
            </View>
            <View style={styles.finInfoContainer} >
                <View style={styles.card_template}>
                    <FontAwesome5Icon name="plus" size={20} color="grey" style={styles.finInfoIcon}/>
                    <Text style={styles.text}>Income</Text> 
                    <Text style={styles.subtitle}>{finInfo.income} SR</Text> 
                </View>
                <View style={styles.card_template}>
                    <FontAwesome5Icon name="minus" size={20} color="grey" style={styles.finInfoIcon}/>
                    <Text style={styles.text}>Expense</Text>
                    <Text style={styles.subtitle}>{finInfo.expense} SR</Text> 
                </View>
            </View> 
            <Text style={styles.subtitle}>Transactions history</Text>
                {transactions.length > 0 ? 
                    <FlatList
                        scrollEnabled={true}
                        style={{height: '70%', paddingVertical: 5}}
                        data={transactions}
                        renderItem={({item}) => (
                        <Item transaction={item} />)} 
                        keyExtractor={item => item._id}
                        ListFooterComponent={<View style={{height: 20}}/>}
                    />: <Text style={[styles.text, {marginTop: 20}]}>You have no transactions yet</Text> }
        </View>
        <View style={{height: '15%', justifyContent: 'flex-end'}}>
            <FAB icon={{ name: 'add', color: 'white' }} 
            color="#5140B0"
            onPress={() => navigation.navigate('CreateTransaction')}
            style={styles.addBtn} />
            <BottomNavBar />
        </View>
    </SafeAreaView>
    );
}

export default Home;

const styles = StyleSheet.create({
    infoContainer: {
        width: '100%',
        backgroundColor: '#5140B0',
        padding: 30,
        //paddingTop: StatusBar.currentHeight,
        paddingBottom: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute'
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'white', 
    },
    SecondContainer:{
        height: '86%',
        top: 115,
        alignSelf: 'center',
        width: '90%',
        paddingBottom: '17%',
    },
    finInfoContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10
    },
    card_template:{
        justifyContent: 'center',
        height: 80,
        backgroundColor: 'white',
        minWidth: '47%',
        //
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        borderRadius : 10,
        shadowColor: '#171717', 
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        elevation: 7,
    },
    listItem: {
        height: 60,
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '99%',
    },
    profileImg: {
        width: 60, 
        height: 60,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 60,
        backgroundColor: 'white',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600'
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '400'
    },
    addBtn: {
        bottom: 10,
        right: 25,
        justifyContent: 'flex-end',
    },
    iconContainer: {
        width: 40, 
        height: 40,
        borderColor: '#B7B0DB',
        borderWidth: 3,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    finInfoIcon: {
        position: 'absolute',
        marginLeft: 20,
    }
})