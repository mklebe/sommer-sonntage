import { createContext, useReducer } from "react";

interface User {
    name: string,
};

const SET_NAME = 'SET_NAME'
type Action = { type: 'SET_NAME', payload: string }
type Dispatch = (action: Action) => void

export const UserContext = createContext<
    {state: User, dispatch: Dispatch} | undefined
>( undefined );
export const { Consumer, Provider } = UserContext;

function overWriteUserName(user: User, name: string): User {
    return {
        ...user,
        name
    }
}

function reducer(user: User, action: {
    type: string,
    payload: string,
}): User {
    alert(`${action.type} ${action.payload}`)
    switch( action.type ) {
        case SET_NAME:
            alert(action.payload)
            return overWriteUserName(user, action.payload);
        default:
            throw new Error()
    }
}

export const UserStore = ({ 
    children
}): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, {name: ''})

    return <Provider value={{state, dispatch}}>
        {children}
    </Provider>
}
