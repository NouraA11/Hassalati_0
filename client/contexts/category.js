import React, {useState, useEffect, useContext, createContext} from 'react';
import axios from 'axios';
import { AuthContext } from './auth';

const CategoryContext = createContext();

const CategoryProvider = ({children}) => {
    const [categories, setCategories] = useState([]);
    const [state, setState] = useContext(AuthContext);

    const loadFromDatebase = async () =>{
        if (state && state.user) {
            const {user} = state;
            const userID = user._id;
        const {data} = await axios.get("/categories", {params: { userID: userID }});
        setCategories(data);
    }}
    useEffect(() => {
        loadFromDatebase();
        }, [state]);
    return (
        <CategoryContext.Provider value={[categories, setCategories]}>
            {children}
        </CategoryContext.Provider>
    );
};

export {CategoryContext, CategoryProvider};