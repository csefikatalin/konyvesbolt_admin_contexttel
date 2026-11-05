import { createContext, useContext, useState, type ReactNode } from "react";
import { KONYVLISTA, type KonyvTipus } from "../adat";



interface TablazatContextValue {
    torles: (id: number) => void,
    konyvLista: KonyvTipus[]
}

export const TablazatContext = createContext<TablazatContextValue | undefined>(undefined)


interface TablazatProviderProps {
    children: ReactNode
}

export function TablazatProvider({ children }: TablazatProviderProps) {

    const [konyvLista, setTablazatLista] = useState<KonyvTipus[]>(KONYVLISTA)

    function torles(id: number) {
        console.log(id)
         setTablazatLista(elozoLista =>
        elozoLista.filter(konyv => konyv.id !== id)
    );
    }

    return (
        <TablazatContext.Provider value={{ torles, konyvLista }}>
            {children}
        </TablazatContext.Provider>
    )
}

/* saját hook */

export function useTablazatContext() {

    const context = useContext(TablazatContext);

    if (context === undefined) {
        throw new Error(
            'Az App csak TablazatProvideren belül használható.',
        );
    }
    return context
}