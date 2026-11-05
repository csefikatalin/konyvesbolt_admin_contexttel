import { useTablazatContext } from '../contexts/TablazatContext'

function Szuro() {
    const { kereses, setKereses } = useTablazatContext()

    return (
        <div className="szuro">
            <label htmlFor="kereses">Könyv keresése:</label>
            <input
                type="search"
                id="kereses"
                placeholder="Könyv címe vagy szerzője..."
                value={kereses}
                onChange={(e) => setKereses(e.target.value)}
            />
        </div>
    )
}

export default Szuro