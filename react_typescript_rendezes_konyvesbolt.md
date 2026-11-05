# Táblázat rendezése Reactben – TypeScript


## 1. Mi a feladat?

A könyvesbolt táblázatában az **ID**, **Cím**, **Szerző**, **Ár (Ft)** és **Darabszám** oszlopok fejlécére kattintva lehessen rendezni a könyveket.

- Első kattintás az adott fejlécen: **növekvő** sorrend.
- Második kattintás ugyanott: **csökkenő** sorrend.
- Másik fejléc kiválasztásakor ismét növekvő sorrenddel kezdünk.
- Az aktív oszlop mellett ▲ vagy ▼ jelzi az irányt; a többi oszlopnál ↕ látható.
- A könyvek hozzáadása és törlése továbbra is működjön.

**Fontos:** nem a könyvek adatait változtatjuk meg, hanem csak a **megjelenítésük sorrendjét**.

## 2. A kiinduló könyvtípus és lista

```ts
export interface KonyvTipus {
    id: number;
    cim: string;
    szerzo: string;
    ar: number;
    darabszam: number;
}
```

A `konyvLista` a Context Providerben tárolt állapot:

```tsx
const [konyvLista, setKonyvLista] = useState<KonyvTipus[]>(KONYVLISTA);
```

A `KONYVLISTA` a korábban elkészített, húsz könyvet tartalmazó kezdeti tömb.

## 3. Először értsük meg a `sort()` működését!

A JavaScript `sort()` metódusa **helyben módosítja** a tömböt, amelyen meghívjuk.

```ts
const arak = [3490, 5990, 2990];
arak.sort((a, b) => a - b);
console.log(arak); // [2990, 3490, 5990]
```

A rendezőfüggvény két elemet (`a` és `b`) hasonlít össze. Ha negatív értéket ad vissza, `a` kerül előre; ha pozitívat, `b`; ha nullát, a két elem egymáshoz viszonyított sorrendje megmarad.

**Számok növekvő rendezése:**

```ts
(a, b) => a - b
```

**Számok csökkenő rendezése:**

```ts
(a, b) => b - a
```

A könyvek ár szerinti rendezése:

```ts
const masolat = [...konyvLista];
masolat.sort((a, b) => a.ar - b.ar);
```

Miért készítünk másolatot? Mert a React state-ben lévő tömböt **nem módosítjuk közvetlenül**:

```tsx
// NE így:
konyvLista.sort((a, b) => a.ar - b.ar);

// Hanem így:
const rendezettLista = [...konyvLista];
rendezettLista.sort((a, b) => a.ar - b.ar);
```

## 4. Szövegek rendezése: `localeCompare()`

A címeket és szerzőket nem vonhatjuk ki egymásból. A szövegek összehasonlítására a `localeCompare()` metódust használjuk:

```ts
const rendezettLista = [...konyvLista];
rendezettLista.sort((a, b) => a.cim.localeCompare(b.cim, 'hu'));
```

A `'hu'` magyar nyelv szerinti összehasonlítást kér. Így a rendezés figyelembe veszi a magyar betűrend sajátosságait. Csökkenő sorrendhez felcserélhetjük az elemeket, vagy megszorozhatjuk az eredményt `-1`-gyel.

## 5. Melyik oszlop és milyen irány?

A felhasználó választását két state-ben tároljuk a **Context Providerben**:

```tsx
type RendezesiMezo = 'id' | 'cim' | 'szerzo' | 'ar' | 'darabszam';
type RendezesiIrany = 'novekvo' | 'csokkeno';

const [rendezesiMezo, setRendezesiMezo] =
    useState<RendezesiMezo | null>(null);

const [irany, setIrany] =
    useState<RendezesiIrany>('novekvo');
```

A `null` azt jelenti, hogy kezdetben **nincs kiválasztott rendezési oszlop**. A `|` a típusdefinícióban azt jelenti, hogy több lehetséges érték közül választhatunk.

**Haladó TypeScript-megjegyzés:** az első típus rövidebben is megadható:

```ts
type RendezesiMezo = keyof KonyvTipus;
```

A `keyof KonyvTipus` a típus mezőneveinek unióját jelenti: `'id' | 'cim' | 'szerzo' | 'ar' | 'darabszam'`. A tananyag további részében az áttekinthető, felsorolt változatot használjuk.

## 6. A kattintásokat kezelő `rendezes()` függvény

Ezt is a Providerben hozzuk létre:

```tsx
function rendezes(mezo: RendezesiMezo) {
    if (rendezesiMezo === mezo) {
        setIrany(elozo =>
            elozo === 'novekvo' ? 'csokkeno' : 'novekvo'
        );
    } else {
        setRendezesiMezo(mezo);
        setIrany('novekvo');
    }
}
```

**Értelmezés:**

1. Ha ugyanarra a fejlécére kattintunk, az irány megfordul.
2. Ha másik oszlopra kattintunk, azt választjuk ki, és növekvő iránnyal indulunk.
3. A `setRendezesiMezo()` és `setIrany()` state-frissítést végeznek, ezért a React újrarendereli a Providert.

## 7. A rendezett lista előállítása

A Providerben az aktuális state-ekből kiszámítjuk a megjelenítendő listát:

```tsx
const rendezettLista = [...konyvLista];

if (rendezesiMezo !== null) {
    rendezettLista.sort((a, b) => {
        const ertekA = a[rendezesiMezo];
        const ertekB = b[rendezesiMezo];

        let eredmeny = 0;

        if (typeof ertekA === 'number' &&
            typeof ertekB === 'number') {
            eredmeny = ertekA - ertekB;
        } else {
            eredmeny = String(ertekA).localeCompare(
                String(ertekB), 'hu'
            );
        }

        return irany === 'novekvo' ? eredmeny : -eredmeny;
    });
}
```

### Miért `a[rendezesiMezo]`?

Ha `rendezesiMezo === 'ar'`, akkor `a[rendezesiMezo]` ugyanaz, mint `a.ar`. Ha `'cim'`, akkor ugyanaz, mint `a.cim`. Így **egyetlen függvény** képes minden oszlop szerint rendezni.

### Miért ellenőrizzük az adattípust?

Az `id`, `ar`, `darabszam` számok, a `cim`, `szerzo` szövegek. Számoknál kivonást, szövegeknél `localeCompare()`-t használunk.

### Miért nem `useState` a `rendezettLista`?

A `rendezettLista` **számított adat**, amely a `konyvLista`, `rendezesiMezo` és `irany` aktuális értékéből mindig előállítható. Nem kell külön state-ben tárolni. Ha a felhasználó könyvet töröl, új könyvet vesz fel, vagy megváltoztatja a rendezést, a React újrarendereléskor újraszámolja a listát.

## 8. A Context típusdefiníciójának kiegészítése

A meglévő `TablazatContextTipus` típushoz adjuk hozzá a rendezéshez szükséges mezőket:

```tsx
interface TablazatContextTipus {
    // A már meglévő mezők (könyvlista, törlés, hozzáadás stb.) maradnak.
    rendezettLista: KonyvTipus[];
    rendezesiMezo: RendezesiMezo | null;
    irany: RendezesiIrany;
    rendezes: (mezo: RendezesiMezo) => void;
}
```

**Figyelem:** ez csak a *hozzáadandó mezőket bemutató részlet*. A meglévő interface többi tagját nem szabad törölni.

A Provider `value` objektumába is tegyük be őket:

```tsx
<TablazatContext.Provider value={{
    // ...a korábban átadott értékek,
    rendezettLista,
    rendezesiMezo,
    irany,
    rendezes
}}>
    {children}
</TablazatContext.Provider>
```

A `// ...` itt **magyarázó megjegyzés**, nem helyettesíti a ténylegesen szükséges Context-értékeket.

## 9. Rendezőgombok a `Tablazat.tsx` fejlécében

A táblázat komponensének nincs szüksége saját rendezési state-re. A Contextből olvassa ki az adatokat és a függvényt:

```tsx
import Sor from './Sor';
import './tablazat.css';
import { useTablazatContext } from '../contexts/TablazatContext';

function Tablazat() {
    const { rendezettLista, rendezesiMezo, irany, rendezes } =
        useTablazatContext();

    function nyil(mezo: 'id' | 'cim' | 'szerzo' | 'ar' | 'darabszam') {
        if (rendezesiMezo !== mezo) return '↕';
        return irany === 'novekvo' ? '▲' : '▼';
    }

    return (
        <div className="tablazat-container">
            <table>
                <thead>
                    <tr>
                        <th><button type="button" onClick={() => rendezes('id')}>ID {nyil('id')}</button></th>
                        <th><button type="button" onClick={() => rendezes('cim')}>Cím {nyil('cim')}</button></th>
                        <th><button type="button" onClick={() => rendezes('szerzo')}>Szerző {nyil('szerzo')}</button></th>
                        <th><button type="button" onClick={() => rendezes('ar')}>Ár (Ft) {nyil('ar')}</button></th>
                        <th><button type="button" onClick={() => rendezes('darabszam')}>Darabszám {nyil('darabszam')}</button></th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {rendezettLista.map(konyv => (
                        <Sor konyv={konyv} key={konyv.id} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Tablazat;
```

A `key={konyv.id}` **fontos**: rendezéskor a sorok sorrendje változik, de a könyvek azonosítója nem. Ezért jobb az ID, mint a tömbindex.




## 12. Kapcsolat a kereséssel

Ha a könyvesboltban már van keresőmező is, **először szűrünk, utána rendezünk**:

```tsx
const szurtLista = konyvLista.filter(konyv =>
    konyv.cim.toLocaleLowerCase('hu').includes(kereses.toLocaleLowerCase('hu')) ||
    konyv.szerzo.toLocaleLowerCase('hu').includes(kereses.toLocaleLowerCase('hu'))
);

const rendezettLista = [...szurtLista];
// Itt következik a korábban bemutatott sort() rendezés.
```

Ezáltal a felhasználó például először rákereshet az „Orwell” szóra, majd az eredményt ár szerint rendezheti.

## 13. Gyakori hibák

| Hiba | Miért probléma? | Megoldás |
|---|---|---|
| `konyvLista.sort(...)` | Közvetlenül módosítja a state tömbjét. | Előbb másolat: `[...konyvLista]`. |
| `key={index}` | Rendezéskor más könyv kerülhet ugyanarra az indexre. | `key={konyv.id}`. |
| Szövegek kivonása | A szöveg nem rendezhető `a.cim - b.cim` módon. | `localeCompare(..., 'hu')`. |
| A rendezett listának külön state | Feleslegesen megkettőzi az adatokat. | Számított `const rendezettLista`. |
| Csak a gomb megjelenése változik | Nem módosul a rendezési állapot. | A gomb hívja meg a `rendezes()` függvényt. |
| `sort()` a szűrés előtt | Nem hibás, de a tananyagban nehezebb követni az adatfolyamot. | Előbb `filter()`, majd `sort()`. |


## 14. Összefoglalás

A rendezés megvalósításához három dolgot különítünk el:

1. **Adatok:** `konyvLista` – a Contextben tárolt könyvek.
2. **Állapot:** `rendezesiMezo` és `irany` – a felhasználó választása.
3. **Számított eredmény:** `rendezettLista` – a másolt és rendezett lista.

A felhasználói felület a fejlécgombokkal módosítja az állapotot, a Provider kiszámítja az új sorrendet, a `Tablazat` pedig megjeleníti. **Nem kell minden számított adatnak külön state-et létrehozni.**

### Gondolkodtató kérdések

- Miért nem jó közvetlenül a `konyvLista` tömbön meghívni a `sort()`-ot?
- Miért kell a rendezéshez két state, ha a `rendezettLista` maga nem state?
- Mi történik, ha a rendezési mező `'ar'`, és mi történik, ha `'cim'`?
- Miért célszerű `key={konyv.id}`-t használni?
- Miért előnyös, hogy a Context tárolja a rendezési beállításokat, de a táblázat csak megjeleníti az eredményt?
