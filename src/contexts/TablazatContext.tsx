import { createContext, useContext, useState, type ReactNode } from "react";
import { KONYVLISTA, type KonyvTipus } from "../adat";

export type UjKonyvTipus = Omit<KonyvTipus, "id">;

interface TablazatContextValue {
    torles: (id: number) => void,
    rendezes: (mezo: keyof KonyvTipus) => void,
    konyvHozzaadas: (konyv: UjKonyvTipus) => void;
    konyvLista: KonyvTipus[],
    rendezettLista: KonyvTipus[],
    rendezesiMezo: keyof KonyvTipus,
    irany: String,
    kereses:String,
    setKereses: React.Dispatch<React.SetStateAction<string>>

}

export const TablazatContext = createContext<TablazatContextValue | undefined>(undefined)


interface TablazatProviderProps {
    children: ReactNode
}

export function TablazatProvider({ children }: TablazatProviderProps) {

    const [konyvLista, setTablazatLista] = useState<KonyvTipus[]>(KONYVLISTA)

    const [kereses, setKereses] = useState<string>("")
    const szurtLista = konyvLista.filter(konyv =>
    konyv.cim.toLowerCase().includes(kereses.toLowerCase()) ||
    konyv.szerzo.toLowerCase().includes(kereses.toLowerCase())
)

    const rendezettLista = [...szurtLista]
    const [rendezesiMezo, setRendezesiMezo] =
        useState<keyof KonyvTipus | null>(null)

    const [irany, setIrany] =
        useState<"novekvo" | "csokkeno">("novekvo")

    if (rendezesiMezo !== null) {
        rendezettLista.sort((a, b) => {
            const ertekA = a[rendezesiMezo]
            const ertekB = b[rendezesiMezo]

            let eredmeny = 0

            if (typeof ertekA === "number" &&
                typeof ertekB === "number") {
                eredmeny = ertekA - ertekB
            } else {
                eredmeny = String(ertekA).localeCompare(
                    String(ertekB), "hu"
                )
            }

            return irany === "novekvo" ? eredmeny : -eredmeny
        })
    }

    function rendezes(mezo: keyof KonyvTipus) {
        if (rendezesiMezo === mezo) {
            setIrany(irany === "novekvo" ? "csokkeno" : "novekvo")
        } else {
            setRendezesiMezo(mezo)
            setIrany("novekvo")
        }
    }



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
        <TablazatContext.Provider value={{ setKereses, kereses, torles, konyvLista, rendezettLista, konyvHozzaadas, rendezes, rendezesiMezo, irany }}>
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