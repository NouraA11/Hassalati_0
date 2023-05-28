import { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../contexts/auth.js';
import Signup from '../../screens/Signup.js';
import Signin from '../../screens/Signin.js';
import Home from '../../screens/Home.js';
import Account from '../../screens/Account.js';
import Categories from '../../screens/Categories.js';
import ForgotPassword from '../../screens/ForgotPassword.js';
import CreateCategory from '../../screens/CreateCategory.js'
import CreateTransaction from '../../screens/CreateTransaction.js';

const Stack = createNativeStackNavigator();

export default function ScreensNav() {
    const [state, setState] = useContext(AuthContext);

    const authenticated = state && state.token!== ("" && undefined) && state.user!==(null && undefined);
    return (
        <Stack.Navigator
        initialRouteName='Home' 
        screenOptions={({route}) => ({
          navigationBarHidden: true, 
          statusBarColor: route?.name == 'Home'? '#5140B0': undefined})}
        >
          {authenticated? (
            <>
            <Stack.Screen name="Home" component={Home} 
            options={{
              headerShown: false,
              // title:'Hassalati',
            }}
            />
            <Stack.Screen name="Categories" component={Categories}/>
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="CreateCategory" component={CreateCategory} 
            options={({route}) => ({
              title: route.params?.edit? 'Edit category':'Create category'
            })}/>
            <Stack.Screen name="CreateTransaction" component={CreateTransaction} 
            options={({route}) => ({
              title: route.params?.edit? 'Edit transaction':'Create transaction'
            })}/>
            </>
          ) : (
            <>
            <Stack.Screen name="Signin" component={Signin} options={{headerShown: false, navigationBarHidden: false, }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown: false, navigationBarHidden: false, }}/>
            <Stack.Screen name="Signup" component={Signup} options={{headerShown: false, navigationBarHidden: false, }}/>
            </>
           )} 

        </Stack.Navigator>
    );
}
