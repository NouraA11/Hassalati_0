import { useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FAB } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import BottomNavBar from "../components/nav/BottomNavBar";
import { Tab, TabView } from '@rneui/themed';
import { CategoryContext } from "../contexts/category";
import { AuthContext } from "../contexts/auth";
  

const Item = ({categoryName, iconName, type, typeIndex, categoryID}) => {
    const navigation = useNavigation();

    return(
        <TouchableOpacity style={styles.card_template} onPress={() => 
        navigation.navigate('CreateCategory', {categoryName, iconName, categoryType: type, typeIndex, categoryID, edit:true})}>
            <View style={styles.iconContainer}>
                <FontAwesome5Icon name={iconName} size={25} color="#B7B0DB"/>
            </View>
            <Text style={styles.subtitle}>
                {categoryName}
            </Text>
            <FontAwesome5Icon name="chevron-right" size={20} color="#A6A6A6"/>
        </TouchableOpacity>
    );
};
const CategoriesList= ({index, categories}) => {

    return (
        <SafeAreaView style={styles.mainContainer}>
            {categories.length > 0 ? 
            <FlatList
                style={{paddingTop: 10, paddingBottom: 10,}}
                data={categories.filter(item => item.typeIndex==index)}
                renderItem={({item}) => (
                 <Item categoryName={item.name} iconName={item.icon} type={item.type} typeIndex={item.typeIndex} categoryID={item._id}/>)}
                keyExtractor={item => item._id}
                ListFooterComponent={<View style={{height: 20}}/>}
            />: <Text style={styles.text}>You have no categories yet</Text>}
        </SafeAreaView>
     );
}

const Categories = ({navigation}) => {
    const [index, setIndex] = useState(0);
    const [categories, setCategories] = useContext(CategoryContext);
    const [state, setState] = useContext(AuthContext);

    return ( 
        <View style={{flex: 1, backgroundColor: 'white',}}>
        <Tab
        style={{backgroundColor: 'white'}}
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
            backgroundColor: undefined,
        }}
        >
        <Tab.Item
            title="Income"
            titleStyle={(active) =>({ 
                fontSize: 16, 
                color: active? '#5140B0':'grey', 
                fontWeight: active? 'bold': 'normal',})}
            containerStyle={(active) => ({
                backgroundColor: active? 'white': '#EAEAEA',
                borderBottomEndRadius: active? 0: 15,
              })}
        />
        <Tab.Item
            title="Expense"
            titleStyle={(active) =>({ 
                fontSize: 16, 
                color: active? '#5140B0':'grey', 
                fontWeight: active? 'bold': 'normal',
                textTransform: 'none'})}
            containerStyle={(active) => ({
                backgroundColor: active? 'white': '#EAEAEA', 
                borderBottomStartRadius: active? 0: 15,
              })}
        />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring" >
            <TabView.Item >
                <CategoriesList index={index} categories={categories}/>
            </TabView.Item>
            <TabView.Item >
                <CategoriesList index={index} categories={categories}/>
            </TabView.Item>
        </TabView>
        
        <View style={{height: '15%', justifyContent: 'flex-end'}}>
        <FAB icon={{ name: 'add', color: 'white' }} 
        color="#5140B0"
        onPress={() => navigation.navigate('CreateCategory')}
        style={styles.addBtn} />
            <BottomNavBar />
        </View>
        </View>
     );
}
 
export default Categories;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white', 
        height: Dimensions.get('screen').height,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: '500'
    },
    iconContainer: {
        width: 50, 
        height: 50,
        borderColor: '#B7B0DB',
        borderWidth: 3,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card_template: {
        backgroundColor: 'white',
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '88%',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        borderRadius : 10,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        elevation: 7,
    },
    addBtn: {
        bottom: 10,
        right: 25,
        justifyContent: 'flex-end',
    },
    text: {
        fontSize: 14,
        paddingLeft: '25%',
        paddingTop: '30%'
    },
})