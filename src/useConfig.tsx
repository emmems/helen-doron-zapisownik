import {useQuery} from "@tanstack/react-query";
import {getMethods} from "./methods/methods.ts";


export function useConfig() {
    return useQuery({
        queryKey: ['config2'],
        queryFn: getConfig,
    });
}

async function getConfig() {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    return await getMethods();
}