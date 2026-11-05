import { createContext, useContext, useState, type ReactNode } from "react";
import { KONYVLISTA, type KonyvTipus } from "../adat";

export type UjKonyvTipus = Omit<KonyvTipus, "id">;

interface TablazatContextValue {
    torles: (id: number) => void,
    konyvHozzaadas: (konyv: UjKonyvTipus) => void;
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
    function konyvHozzaadas(konyv: UjKonyvTipus) {
        setTablazatLista(elozoLista => {
            const ujId = Math.max(
                0,
                ...elozoLista.map(k => k.id)
            ) + 1;

            return [...elozoLista, { ...konyv, id: ujId }];
        });
    }

    return (
        <TablazatContext.Provider value={{ torles, konyvLista, konyvHozzaadas }}>
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