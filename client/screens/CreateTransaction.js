import {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native"
import { TextInput } from 'react-native-paper';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TransactionContext} from '../contexts/transaction';
import { CategoryContext } from '../contexts/category';
import { AuthContext } from '../contexts/auth';

const CreateTransaction = ({route, navigation}) => {
    const [value, setValue] = route.params?.transaction.value? useState(route.params.transaction.value): useState('');//first condition for edit transaction
    const [transactionType, setTransactionType] = route.params?.transaction?.type? useState(route.params.transaction.type): useState('Select type');
    const [t_TypeIndex, setT_TypeIndex] = route.params?.transaction?.typeIndex? useState(route.params.transaction.typeIndex) :useState(0);
    const [date, setDate] = route.params?.transaction.date? useState(new Date(route.params.transaction.date)): useState(new Date());
    const [time, setTime] = route.params?.transaction.time? useState(new Date(route.params.transaction.time)):useState(new Date());
    // const [showDatePicker, setShowDatePicker] = useState(false);
    // const [showTimePicker, setShowTimePicker] = useState(false);
    const [mode, setMode] = useState('date');
    const [category, setCategory] = useState({});

    //contexts
    const [transactions, setTransactions] = useContext(TransactionContext);
    const [state, setState] = useContext(AuthContext);
    const [categories, setCategories] = useContext(CategoryContext);

    const getCategory = async () => {
        const {data} = await axios.get("/getCategory", {params: {categoryID: route.params.transaction.category}});
        setCategory(data);
    }
    useEffect(() => {
        if (route.params?.edit)
            getCategory();
    }, [transactions])

    const handleSubmit = async () => {
        if ((!value || t_TypeIndex == 'Select type' || Object.keys(category).length === 0)){
            alert('All fields are required');
            return; }
            //if input are valid
        try {
            if (route.params?.edit) {
                const id = route.params.transaction._id;
                console.log(" in edit")
                const {data} = await axios.put("/editTransaction", {
                    value,
                    type: transactionType,
                    typeIndex: t_TypeIndex,
                    date,
                    time,
                    category: category._id,
                    id,
                });
                //edit in context
                setTransactions((transactions) => {
                    const index = transactions.findIndex((t) => t._id == id);
                    transactions[index] = data;
                    return [...transactions];
                });
            } else {
                const {data} = await axios.post("/createTransaction", { 
                    value,
                    type: transactionType,
                    typeIndex: t_TypeIndex,
                    date,
                    time,
                    category: category._id,
                });
                //save in context
                setTransactions([data, ...transactions]);

                //edit user balance and income/expense
                var userBalance = calculateBalance();
                var userIncome = calculateIncome();
                var userExpense = calculateExpense();
                const userdata = await axios.post("/edit-fin-info", {
                    balance: userBalance,
                    income: userIncome,
                    expense: userExpense,
                });
                const as = JSON.parse(await AsyncStorage.getItem("@auth"));
                as.user.finInfo = userdata.data.finInfo; //update user info in async storage
                await AsyncStorage.setItem("@auth", JSON.stringify(as));

                setState({...state, user: as.user}); //update context
                console.log('done')
            }
            navigation.navigate('Home');
        } catch (err) {
            console.log(err)
        }
    }
    const calculateBalance = () => {
        const userBalance = parseFloat(state.user.finInfo.balance);
        if (t_TypeIndex ==0) //if income
            return userBalance+value;
        else //if expense
            return userBalance-value;
    }
    const calculateIncome = () => {
        const userIncome = parseFloat(state.user.finInfo.income);
        if (t_TypeIndex ==0) //if income
            return userIncome+value;
        else //if expense
            return userIncome;
    }
    const calculateExpense = () => {
        const userExpense = parseFloat(state.user.finInfo.expense);
        if (t_TypeIndex ==0) //if income
            return userExpense;
        else //if expense
            return userExpense+value;
    }

    const handleDelete = async (transactionID) => {
        try {
            await axios.delete(`/removeTransaction/${transactionID}`);
            //delete in context
            setCategories((transactions) => {
                const index = transactions.findIndex((t) => t._id === transactionID);
                transactions.splice(index, 1);
                return [...transactions];
            });

            //edit user balance and income/expense
            const userBalance = parseFloat(state.user.finInfo.balance);
            const userIncome = parseFloat(state.user.finInfo.income);
            const userExpense = parseFloat(state.user.finInfo.expense);

            if (t_TypeIndex ==0) { //if income 
            var updatedBalance = userBalance-value;
            var updatedIncome = userIncome-value;
            var updatedExpense = userExpense;
            } else {
                var updatedBalance = userBalance+value;
                var updatedIncome = userIncome;
                var updatedExpense = userExpense-value;
            }
            const userdata = await axios.post("/edit-fin-info", {
                balance: updatedBalance,
                income: updatedIncome,
                expense: updatedExpense,
            });
            const as = JSON.parse(await AsyncStorage.getItem("@auth"));
            as.user.finInfo = userdata.data.finInfo; //update user info in async storage
            await AsyncStorage.setItem("@auth", JSON.stringify(as));

            setState({...state, user: as.user}); //update context

            navigation.navigate('Home');
    } catch (err) {
        console.log(err)
    }
    }

    // const onDateChange = (event, selectedDate) => {
    //     if (Platform.OS === 'android') {
    //       setShowDatePicker(false);
    //     }
    //         if (event.type !='dismissed'){
    //             setShowTimePicker(true);
    //             setDate(selectedDate);}
    //   }
    //   const onTimeChange = (event, selectedTime) => {
    //     if (Platform.OS === 'android') {
    //       setShowTimePicker(false);
    //     }
    //         setTime(selectedTime);
    //   }
    
    //dateTimePickerSetup
      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        if(mode=='date'){
        setDate(currentDate);
        } else {
        setTime(currentDate.getTime());
        }
      };
    
      const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          maximumDate: new Date(),
          onChange,
          mode: currentMode,
        })
      };
    
      const showDatepicker = () => {
        showMode('date');
        setMode('date');
      };
    
      const showTimepicker = () => {
        showMode('time');
        setMode('time');
      };


    return ( 
        <View style={styles.mainContainer}>
            <View style={styles.optionsContainer}>
                <TextInput style={styles.textInput}
                autoFocus={true}
                keyboardType='decimal-pad'
                maxLength={6}
                defaultValue={value.toString()}
                label="Value"
                editable={route.params?.edit? false: true}
                underlineColor= '#A6A6A6'
                value={value}
                onChangeText={v => {
                    if (!isNaN(v) && v != '')
                    setValue(parseFloat(v.replace(/[- #*;,<>\{\}\[\]\\\/]/gi, '')))}}/>
                <Text style={styles.text}>SR</Text>
                </View>
                <Dropdown 
                style={styles.dropdown}
                selectedTextStyle={styles.text}
                itemTextStyle={styles.text}
                value={transactionType}
                data={[{lable: "Income", index: 0}, {lable: "Expense", index: 1}]}
                valueField="lable"
                labelField="lable"
                placeholder="Select type"
                onChange={e => {
                    setTransactionType(e.lable) 
                    setT_TypeIndex(e.index)
                    setCategory({})
                }}
                />
                {transactionType != "Income" && transactionType != "Expense"? <></>:
                <Dropdown 
                style={styles.dropdown}
                selectedTextStyle={styles.text}
                placeholderStyle={styles.text}
                itemTextStyle={styles.text}
                value={category.name}
                data={categories.filter((c) => c.type == transactionType)}
                valueField="name"
                labelField="name"
                placeholder="Select category"
                renderLeftIcon={(visible?) => 
                    category.icon?
                    <View style={[styles.categoryIcon, {backgroundColor: 'white', borderColor: 'white'}]}>
                    <FontAwesome5 name={category.icon} size={20} color="grey"/>
                    </View>: <></>}
                renderItem={e => (
                <View style={styles.dropdownItem}>
                    <View style={styles.categoryIcon}>
                        <FontAwesome5 name={e.icon} size={20} color="grey"/>
                    </View>
                    <Text style={styles.text}>{e.name}</Text>
                </View>)}
                onChange={e => {
                    setCategory(e)
                }}
                />}
                {/*showDatePicker && (
                <DateTimePicker
                  maximumDate={new Date(Date.now())}
                  value={new Date(date)}
                  mode='date'
                  onChange={onDateChange}
                />)}
                {showTimePicker && (<DateTimePicker
                  maximumDate={new Date(Date.now())}
                  value={new Date(time)}
                  mode='time'
                  onChange={onTimeChange}
                />
                )*/} 
                <TouchableOpacity style={[styles.dropdown, styles.dateTimeContainer]}
                // onPress={() =>setShowDatePicker(true)}
                onPress={showDatepicker}
                >
                    <FontAwesome5 name="calendar-day" size={22}/> 
                    <Text style={[styles.text, {marginLeft: 10, marginRight: 100}]}>
                    {moment(date).format('DD-MM-YYYY')}
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.dropdown, styles.dateTimeContainer]}
                // onPress={() =>setShowDatePicker(true)}
                onPress={showTimepicker}
                >
                    <FontAwesome5 name="clock" size={22} />{/*style={{alignSelf: 'flex-end'}}/> */}
                    <Text style={[styles.text, {marginLeft: 10 }]}>
                    {moment(time).format("hh:mm A")}
                    </Text>
                    </TouchableOpacity>
                {route?.params?.edit? 
                <TouchableOpacity style={styles.secondaryBtn}
                onPress={() => handleDelete(route.params.transaction._id)}>
                    <FontAwesome5 name="trash" size={22} color='#5140B0'/> 
                <Text style={styles.secondaryBtnText}>
                    Delete Transaction
                </Text>
                </TouchableOpacity>:<></>}
                <TouchableOpacity style={styles.primaryBtn}
                onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>
                    {route?.params?.edit? "Edit Transaction" :"Create Transaction"}
                </Text>
                </TouchableOpacity>
        </View>
     );
}
 
export default CreateTransaction;

const styles = StyleSheet.create({
    mainContainer: {
        //flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        padding: 20,
        paddingTop: 40,
    },
    optionsContainer: {
        width: '95%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdown: {
        width: "100%",
        backgroundColor: '#E2DEF4',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    dropdownItem: {
        width: "100%",
        backgroundColor: '#E2DEF4',
        fontSize: 18,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        width: 35, 
        height: 35,
        borderColor: '#E2DEF4',
        borderWidth: 2,
        borderRadius: 35,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedIcon: {
        width: 60, 
        height: 60,
        backgroundColor: '#E2DEF4',//'#B7B0DB',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: "90%",
        height: 60,
        backgroundColor: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500'
    },
    dateTimeContainer: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        paddingVertical: 10,
    },
    primaryBtn: {
        backgroundColor: '#5140B0',
        color: 'white',
        borderRadius: 10,
        width: "100%",
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 50,
    },
    primaryBtnText: {
        fontSize: 20,
        fontWeight:'500',
        color: 'white'
    }, 
    secondaryBtn: {
        flexDirection: 'row',
        backgroundColor: 'white',
        color: '#5140B0',
        borderRadius: 10,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderColor: '#5140B0',
        borderWidth: 2,
        marginTop: 20
    },
    secondaryBtnText: {
        fontSize: 20,
        fontWeight:'500',
        color: '#5140B0',
        marginHorizontal: 20
    },
})