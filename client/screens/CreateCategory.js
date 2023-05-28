import {useState, useContext} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native"
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import IconPicker from "react-native-icon-picker";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CategoryContext} from '../contexts/category';
import { TransactionContext } from '../contexts/transaction';


const CreateCategory = ({route, navigation}) => {
    const [name, setName] = route.params?.categoryName? useState(route.params.categoryName): useState('');
    const [icon, setIcon] = route.params?.iconName? useState(route.params.iconName): useState("ellipsis-h");
    const [type, setType] = route.params?.categoryType? useState(route.params.categoryType): useState('Select type');
    const [typeIndex, setTypeIndex] = route.params?.typeIndex? useState(route.params.typeIndex) :useState(0);
    const [showIconPicker, setShowIconPicker] = useState(false);

    //context
    const [categories, setCategories] = useContext(CategoryContext);
    const [transactions, setTransactions] = useContext(TransactionContext);

    const handleSubmit = async () => {
        if ((!name || name.trim() ==''|| type == 'Select type')){
            alert('All fields are required');
            return; }
            //if input are valid
        try {
            if (route.params?.edit) {
                const id = route.params.categoryID;
                console.log(" in edit")
                const {data} = await axios.put("/editCategory", {
                    name,
                    icon,
                    type,
                    typeIndex,
                    id,
                });
                //edit in context
                setCategories((categories) => {
                    const index = categories.findIndex((c) => c._id == id);
                    categories[index] = data
                    return [...categories];
                });
            } else {
                const {data} = await axios.post('/createCategory', { 
                    name,
                    icon,
                    type,
                    typeIndex,
                });
                //save in context
                setCategories([data, ...categories]);
            }
            navigation.navigate('Categories');
        } catch (err) {
            console.log(err)
        }
    }
    const handleDelete = async (categoryID) => {
        try {
        await axios.delete(`/removeCategory/${categoryID}`);
        //delete in context
        setCategories((categories) => {
            const index = categories.findIndex((c) => c._id === categoryID);
            categories.splice(index, 1);
            return [...categories];
        });
        setTransactions((transactions) => {
            for(const element of transactions) {
            const index = transactions.findIndex((t) => t.category === categoryID);
            transactions.splice(index, 1);
            }
            return [...transactions];
        });
        navigation.navigate('Categories');
    } catch (err) {
        console.log(err)
    }
    }

    const onSelectIcon = (selectedIcon) => {
        setShowIconPicker(false);
        setIcon(selectedIcon.icon)
      };

    return ( 
        <View style={styles.mainContainer}>
            <View style={styles.optionsContainer}>
                <View style={styles.selectedIcon}>
                    <IconPicker
                showIconPicker={showIconPicker}
                toggleIconPicker={() => setShowIconPicker(!showIconPicker)}
                iconDetails={[
                    { family: "FontAwesome5", 
                    icons: ["credit-card", "money-bill", "dollar-sign", "coins", "wallet", "receipt", "store", "donate",
                    "home", "faucet", "lightbulb", "utensils", "gas-pump", "car-side", "book", "tshirt", 
                    "glasses", "baby-carriage", 
                    "coffee", "shopping-cart", "hospital-alt", "hammer",
                    "wifi", "mobile-alt", "headphones-alt", "laptop",
                    "bicycle", "gamepad", "walking", "palette", "gem", 
                    "cat", "seedling", "spa", "table-tennis", 
                    "graduation-cap", "umbrella-beach", "gift",
                    "ellipsis-h"] },
                ]}
                content={<FontAwesome5 name={icon} size={32} /> }
                onSelect={(selectedIcon) => onSelectIcon(selectedIcon)}/>
                </View>
                <TextInput style={styles.textInput}
                autoFocus={true}
                label="Category name"
                underlineColor= '#A6A6A6'
                value={name}
                onChangeText={text => setName(text)}/>
                </View>
                <Dropdown 
                style={styles.dropdown}
                selectedTextStyle={styles.text}
                iconColor="#5140B0"
                value={type}
                data={[{lable: "Income", index: 0}, {lable: "Expense", index: 1}]}
                valueField="lable"
                labelField="lable"
                placeholder="Select type"
                onChange={e => {
                    setType(e.lable) 
                    setTypeIndex(e.index)}}
                />
                {route?.params?.edit? 
                <TouchableOpacity style={styles.secondaryBtn}
                onPress={() => handleDelete(route.params.categoryID)}>
                    <FontAwesome5 name="trash" size={22} color='#5140B0'/> 
                <Text style={styles.secondaryBtnText}>
                    Delete Category
                </Text>
                </TouchableOpacity>:<></>}
                <TouchableOpacity style={styles.primaryBtn}
                onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>
                    {route?.params?.edit? "Edit Category" :"Create category"}
                </Text>
                </TouchableOpacity>
        </View>
     );
}
 
export default CreateCategory;

const styles = StyleSheet.create({
    mainContainer: {
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
        width: "75%",
        backgroundColor: '#E2DEF4',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignSelf: 'flex-end'
    },
    selectedIcon: {
        width: 60, 
        height: 60,
        backgroundColor: '#E2DEF4',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        width: "75%",
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
    primaryBtn: {
        backgroundColor: '#5140B0',
        color: 'white',
        borderRadius: 10,
        width: "100%",
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 130,
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
    },
    secondaryBtnText: {
        fontSize: 20,
        fontWeight:'500',
        color: '#5140B0',
        marginHorizontal: 20
    },
})