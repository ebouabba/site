import { useContext } from "react"
import { RefreshDataContextProps } from "./appContexts"
import { fetchData } from './appContexts';

export const usefetchDataContext = (): RefreshDataContextProps => {
    const fetchDataContext = useContext(fetchData)
    if (fetchDataContext == undefined)
        throw new Error('type undefined')
    return fetchDataContext
}