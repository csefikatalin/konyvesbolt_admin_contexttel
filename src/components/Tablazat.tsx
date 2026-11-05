import React, { useContext } from 'react'
import Sor from './Sor'
import "./tablazat.css"
import { useTablazatContext } from '../contexts/TablazatContext'

function Tablazat() {
    const {konyvLista}=useTablazatContext()
    return (
        <div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cím</th>
                        <th>Szerző</th>
                        <th>Ár (Ft)</th>
                        <th>Darabszám</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        konyvLista.map((konyv, i)=>{
                            return(  <Sor konyv={konyv} key={i} />)
                        })
                    }
                     
               
                </tbody>
            </table>


         
        </div>
    )
}

export default Tablazat