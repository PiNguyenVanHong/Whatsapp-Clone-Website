import { createContext, useContext, useReducer, Dispatch } from "react";
import { ActionProps, StateReducerProps } from "@/context/state-reducers";

interface StateProviderProps {
    initialState: StateReducerProps;
    reducer: (state: StateReducerProps, action: ActionProps) => any;
    children: React.ReactNode;
}

interface StateContextProps {
    state: StateReducerProps;
    dispatch: Dispatch<ActionProps>;
}

export interface UserInfoProps {
    id?: number;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    status: "Avaialble" | "" | string;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ initialState, reducer, children }: StateProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateProvider = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useStateProvider must be used within a StateProvider");
    }
    return [context.state, context.dispatch] as const;
};
