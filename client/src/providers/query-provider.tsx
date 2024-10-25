import { useState } from "react";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

interface QueryProviderProps {
    children: React.ReactNode;
}

function QueryProvider({
    children
}: QueryProviderProps) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    ); 
};

export default QueryProvider;