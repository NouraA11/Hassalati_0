import React, {useState, useEffect, useContext, createContext} from 'react';
import axios from 'axios';
import { AuthContext } from './auth';

const TransactionContext = createContext();

const TransactionProvider = ({children}) => {
    const [transactions, setTransactions] = useState([]);
    const [state, setState] = useContext(AuthContext);

    const loadFromDatebase = async () =>{
        if (state && state.user) {
            const {user} = state;
            const userID = user._id;
        const {data} = await axios.get("/transactions", {params: { userID: userID }});
        setTransactions(data);
    }}
    useEffect(() => {
        loadFromDatebase();
        }, [state, transactions]);

    return (
        <TransactionContext.Provider value={[transactions, setTransactions]}>
            {children}
        </TransactionContext.Provider>
    );
};

export {TransactionContext, TransactionProvider};