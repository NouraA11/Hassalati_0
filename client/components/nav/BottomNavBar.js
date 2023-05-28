import { useNavigation, useRoute } from "@react-navigation/native";
import {TouchableOpacity, SafeAreaView } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const Tab = ({name, handlePress,screenName, routeName}) => {
    const activeScreenColor = screenName===routeName && '#5140B0';

    return (
        <TouchableOpacity onPress={handlePress}>
            <FontAwesome5 
            name={name} 
            size={25} 
            color="black"
            color={activeScreenColor}/>
        </TouchableOpacity>
    );
}

export default function BottomNavBar() {
    const navigation = useNavigation();
    const route = useRoute();

    return ( 
        <SafeAreaView style={{
            flex: 1,
            flexDirection: "row",
            paddingVertical: 10,
            justifyContent: "space-around",
            backgroundColor: 'white',
            borderColor: 'lightgrey',
            borderWidth:0.5,
        }}>
            <Tab 
            name={"user-alt"} 
            handlePress={() => navigation.navigate('Account')}
            screenName="Account"
            routeName={route.name}/>
            <Tab 
            name={"th-large"}
            handlePress={() => navigation.navigate('Categories')}
            screenName="Categories"
            routeName={route.name}/>
            <Tab 
            name={"home"}
            handlePress={() => navigation.navigate('Home')}
            screenName="Home"
            routeName={route.name}/>
        </SafeAreaView>
     );
}