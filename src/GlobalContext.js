import { useState, createContext, useContext, useRef, useCallback } from 'react'

const DataContext = createContext()
const NextContext = createContext()
const PrevContext = createContext()
const SearchContext = createContext()
const UpdDataContext = createContext()


export const useData = () => {
    return useContext(DataContext)
}

export const useNext = () => {
    return useContext(NextContext)
}

export const usePrev = () => {
    return useContext(PrevContext)
}

export const useSearch = () => {
    return useContext(SearchContext)
}

export const useUpdData = () => {
    return useContext(UpdDataContext)
}

export const GlobalProvider = ({ children }) => {

    const [data, setData] = useState([])
    const [next, setNext] = useState(false)
    const [prev, setPrev] = useState(false)
    const search = useRef({ col: '_id', term: '', on: false })
    const upd = useRef({
        _id: "",
        Gene_Name: "",
        Transcript: "",
        Census_Tier_1: "",
        Sample_Name: "",
        Sample_ID: "",
        AA_Mutation: "",
        CDS_Mutation: "",
        Primary_Tissue: "",
        Tissue_Subtype_1: "",
        Tissue_Subtype_2: "",
        Histology: "",
        Histology_Subtype_1: "",
        Histology_Subtype_2: "",
        Pubmed_Id: "",
        CGP_Study: "",
        Somatic_Status: "",
        Sample_Type: "",
        Zygosity: "",
        Genomic_Coordinates: "",
    })

    return (
        <UpdDataContext.Provider value={upd}>
            <SearchContext.Provider value={search}>
                <NextContext.Provider value={[next, setNext]}>
                    <PrevContext.Provider value={[prev, setPrev]}>
                        <DataContext.Provider value={[data, setData]}>
                            {children}
                        </DataContext.Provider>
                    </PrevContext.Provider>
                </NextContext.Provider>
            </SearchContext.Provider>
        </UpdDataContext.Provider>
    )
}
