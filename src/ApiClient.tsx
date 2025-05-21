import {QueryClient} from "@tanstack/react-query";
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import React from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
})

const persister = createSyncStoragePersister({
    storage: window.localStorage,
})

function ApiProvider({children}: { children: React.ReactNode }) {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{persister}}>
            {children}
        </PersistQueryClientProvider>
    )
}

export default ApiProvider;