import React, { useContext } from 'react'
import Sor from './Sor'
import "./tablazat.css"
import { useTablazatContext } from '../contexts/TablazatContext'

function Tablazat() {
    const { rendezettLista, rendezes, rendezesiMezo, irany } = useTablazatContext()

    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <th> <button onClick={() => rendezes("id")}>
                                Id
                                {rendezesiMezo === "id"
                                    ? (irany === "novekvo" ? " ▲" : " ▼")
                                    : " ↕"}
                            </button></th>
                        <th>
                            <button onClick={() => rendezes("cim")}>
                                Cím
                                {rendezesiMezo === "cim"
                                    ? (irany === "novekvo" ? " ▲" : " ▼")
                                    : " ↕"}
                            </button>
                        </th>
                        <th> <button onClick={() => rendezes("szerzo")}>
                                Szerző
                                {rendezesiMezo === "szerzo"
                                    ? (irany === "novekvo" ? " ▲" : " ▼")
                                    : " ↕"}
                            </button></th>
                        <th> <button onClick={() => rendezes("ar")}>
                                Ár (Ft)
                                {rendezesiMezo === "ar"
                                    ? (irany === "novekvo" ? " ▲" : " ▼")
                                    : " ↕"}
                            </button></th>
                        <th> <button onClick={() => rendezes("darabszam")}>
                                Darabszám
                                {rendezesiMezo === "darabszam"
                                    ? (irany === "novekvo" ? " ▲" : " ▼")
                                    : " ↕"}
                            </button></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rendezettLista.map((konyv, i) => {
                            return (<Sor konyv={konyv} key={i} />)
                        })
                    }


                </tbody>
            </table>



        </div>
    )
}

export default Tablazat