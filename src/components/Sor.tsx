import React from 'react'
import type { KonyvTipus } from '../adat'
import { useTablazatContext } from '../contexts/TablazatContext'

interface SorPropsType {
    konyv: KonyvTipus
}
function Sor({ konyv }: SorPropsType) {
    const {torles}=useTablazatContext()
    return (
        <tr><td>{konyv.id}</td><td>{konyv.cim}</td><td>{konyv.szerzo}</td><td>{konyv.ar}</td><td>{konyv.darabszam}</td><td > <button
            type="button"
            className="torles"
            title="Könyv törlése"onClick={()=>{torles(konyv.id)}}
        >
            ❌
        </button></td></tr>

    )
}

export default Sor