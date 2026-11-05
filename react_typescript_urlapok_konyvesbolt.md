# Űrlapok készítése Reactben – TypeScript


## 1. Mire való az űrlap?

Az űrlap (`<form>`) lehetővé teszi, hogy a felhasználó adatokat adjon meg. A könyvesbolti alkalmazásban új könyvet rögzítünk. A következő adatokat kérjük be:

- könyv címe (`cim`),
- szerző (`szerzo`),
- ár forintban (`ar`),
- raktáron lévő darabszám (`darabszam`).

Az **ID-t nem a felhasználó írja be**: azt az alkalmazás állítja elő.

## 2. Egy hagyományos HTML-űrlap

```html
<form>
  <div>
    <label for="cim">Könyv címe</label>
    <input type="text" id="cim" name="cim" required>
  </div>
  <div>
    <label for="ar">Ár (Ft)</label>
    <input type="number" id="ar" name="ar" min="0" required>
  </div>
  <button type="submit">Mentés</button>
</form>
```

**Fontos elemek és attribútumok:**

| Elem vagy attribútum | Szerepe |
|---|---|
| `<form>` | Összefogja az űrlapmezőket. |
| `<label>` | Megnevezi a mezőt; kattintással is fókuszálhatóvá teszi. |
| `htmlFor` / HTML-ben `for` | A címkét a megfelelő `id`-jú mezőhöz kapcsolja. |
| `<input>` | Adatbeviteli mező. |
| `type="text"` | Szöveges adat bevitele. |
| `type="number"` | Szám megadása. |
| `name` | Azonosítja az adatot az űrlap feldolgozásakor. |
| `required` | A mező kitöltése kötelező. |
| `min="0"` | Nem enged negatív számot a böngésző beépített ellenőrzésében. |
| `type="submit"` | Elindítja az űrlap elküldését. |

React JSX-ben a `for` helyett **`htmlFor`** szerepel, és a tageket megfelelően le kell zárni, például `<input />`.

## 3. Miért használunk state-et Reactben?

Reactben gyakran azt szeretnénk, hogy a beviteli mezők tartalma az alkalmazás állapotában (`state`) is rendelkezésre álljon. Ezt nevezzük **vezérelt űrlapmezőnek** (*controlled input*).

A működés:

1. A `value` megmutatja a state aktuális értékét a mezőben.
2. A felhasználó gépel.
3. Az `onChange` eseménykezelő meghívja a state-et frissítő függvényt.
4. A React újrarenderel, a mező az új értéket mutatja.

### Első példa: egyetlen szövegmező

```tsx
import { useState } from 'react'

function CimBevitel() {
  const [cim, setCim] = useState<string>('')

  return (
    <div>
      <label htmlFor="cim">Könyv címe</label>
      <input
        id="cim"
        type="text"
        value={cim}
        onChange={(e) => setCim(e.target.value)}
      />
      <p>Beírt cím: {cim}</p>
    </div>
  )
}

export default CimBevitel
```

Az `e.target.value` **szöveg**, amelyet az eseményt kiváltó beviteli mezőből olvasunk ki.

> Ha `value={cim}` szerepel a mezőn, de nincs megfelelő `onChange`, akkor a felhasználó nem tudja szokásos módon módosítani a mező tartalmát.

## 4. Több mező kezelése egyetlen objektummal

Négy külön state helyett tárolhatjuk a könyv adatait **egyetlen objektumban**:

```tsx
const [ujKonyv, setUjKonyv] = useState({
  cim: '',
  szerzo: '',
  ar: 0,
  darabszam: 0
})
```

Egyetlen mező módosításakor meg kell tartanunk az objektum többi tulajdonságát is:

```tsx
setUjKonyv({
  ...ujKonyv,
  cim: 'Abigél'
})
```

A `...ujKonyv` átmásolja a korábbi tulajdonságokat, a `cim` pedig új értéket kap. **Nem módosítjuk közvetlenül a state-objektumot.**

## 5. Közös eseménykezelő a mezőkhöz

A mezők `name` attribútumát az objektum megfelelő tulajdonságával azonosan nevezzük el. Így egyetlen függvény kezelheti mind a négy mezőt:

```tsx
function adatValtozas(e: React.ChangeEvent<HTMLInputElement>) {
  const { name, value, type } = e.target

  setUjKonyv(elozo => ({
    ...elozo,
    [name]: type === 'number' ? Number(value) : value
  }))
}
```

**A kód értelmezése:**

- `React.ChangeEvent<HTMLInputElement>`: TypeScript-típus, amely leírja, hogy egy `input` változási eseményét kapjuk.
- `name`: megmondja, melyik mezőt változtattuk meg (például `szerzo`).
- `value`: a mező pillanatnyi értéke, **szövegként**, még `type="number"` esetén is.
- `type`: segítségével megkülönböztetjük a szám- és szövegmezőket.
- `[name]`: **számított tulajdonságnév**. Ha `name === 'ar'`, akkor az `ar` tulajdonságot módosítjuk.
- `Number(value)`: számmá alakítja a beolvasott értéket.
- `setUjKonyv(elozo => ...)`: az előző state alapján hoz létre új objektumot.

**Megjegyzés:** A `Number('')` eredménye `0`, ezért a fenti egyszerű megoldásban egy kiürített számmező is nullát eredményezhet. Ez tanórai kiindulópontnak megfelelő; összetettebb űrlapoknál célszerű a beviteli mezők értékeit szövegként tárolni, és mentéskor számmá alakítani.

## 6. Teljes `UjKonyv` komponens

A következő példa a Contextben definiált `konyvHozzaadas` függvényt hívja meg. Feltételezzük, hogy a függvény paramétere az ID nélküli könyv adatait várja.

```tsx
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useTablazatContext } from '../contexts/TablazatContext'

function UjKonyv() {
  const { konyvHozzaadas } = useTablazatContext()

  const [ujKonyv, setUjKonyv] = useState({
    cim: '',
    szerzo: '',
    ar: 0,
    darabszam: 0
  })

  function adatValtozas(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target

    setUjKonyv(elozo => ({
      ...elozo,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  function mentes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!ujKonyv.cim.trim() || !ujKonyv.szerzo.trim()) return
    if (!Number.isFinite(ujKonyv.ar) || ujKonyv.ar < 0) return
    if (!Number.isInteger(ujKonyv.darabszam) || ujKonyv.darabszam < 0) return

    konyvHozzaadas({
      ...ujKonyv,
      cim: ujKonyv.cim.trim(),
      szerzo: ujKonyv.szerzo.trim()
    })

    setUjKonyv({
      cim: '',
      szerzo: '',
      ar: 0,
      darabszam: 0
    })
  }

  return (
    <section className="uj-konyv">
      <h2>Új könyv rögzítése</h2>

      <form onSubmit={mentes}>
        <div className="form-mezo">
          <label htmlFor="cim">Könyv címe</label>
          <input
            id="cim"
            name="cim"
            type="text"
            value={ujKonyv.cim}
            onChange={adatValtozas}
            required
          />
        </div>

        <div className="form-mezo">
          <label htmlFor="szerzo">Szerző</label>
          <input
            id="szerzo"
            name="szerzo"
            type="text"
            value={ujKonyv.szerzo}
            onChange={adatValtozas}
            required
          />
        </div>

        <div className="form-mezo">
          <label htmlFor="ar">Ár (Ft)</label>
          <input
            id="ar"
            name="ar"
            type="number"
            min="0"
            step="1"
            value={ujKonyv.ar}
            onChange={adatValtozas}
            required
          />
        </div>

        <div className="form-mezo">
          <label htmlFor="darabszam">Darabszám</label>
          <input
            id="darabszam"
            name="darabszam"
            type="number"
            min="0"
            step="1"
            value={ujKonyv.darabszam}
            onChange={adatValtozas}
            required
          />
        </div>

        <button type="submit" className="mentes">
          Könyv hozzáadása
        </button>
      </form>
    </section>
  )
}

export default UjKonyv
```

### Mi történik a Mentés gomb megnyomásakor?

1. A `type="submit"` gomb elindítja az űrlap `onSubmit` eseményét. **Fontos, hogy az onsubmit eseményt nem a gombra kell írni, hanem a FORM tagbe!**
2. A `mentes` függvény lefut.
3. Az `e.preventDefault()` megakadályozza a böngésző hagyományos űrlapbeküldését és az ezzel járó oldalnavigációt.
4. Ellenőrizzük az adatokat.
5. Meghívjuk a Contextből kapott `konyvHozzaadas(ujKonyv)` függvényt.
6. Sikeres helyi hozzáadás után alaphelyzetbe állítjuk a mezőket.

**Miért jobb az `onSubmit` a gomb `onClick` eseményénél?** Mert a felhasználó az Enter billentyűvel is beküldheti az űrlapot, és az űrlap működése a HTML szokásos szemantikáját követi.

## 7. A könyv hozzáadása a Contextben

A meglévő könyvtípus:

```tsx
export interface KonyvTipus {
  id: number
  cim: string
  szerzo: string
  ar: number
  darabszam: number
}
```

Új könyv rögzítésekor még nincs ID, ezért készíthetünk egy külön típust:

```tsx
type UjKonyvTipus = Omit<KonyvTipus, 'id'>
```

Az `Omit` azt jelenti: a `KonyvTipus` összes tulajdonsága megmarad, **kivéve az `id`-t**.

A Context típusdefiníciójában:

```tsx
konyvHozzaadas: (konyv: UjKonyvTipus) => void
```

A Providerben:

```tsx
function konyvHozzaadas(konyv: UjKonyvTipus) {
  setKonyvLista(elozoLista => {
    const ujId = Math.max(0, ...elozoLista.map(k => k.id)) + 1
    return [...elozoLista, { ...konyv, id: ujId }]
  })
}
```

A `konyvHozzaadas` függvényt a Provider `value` objektumában is át kell adni.

> **Fontos korlát:** Az itt használt ID-képzés tanórai, helyi állapotú alkalmazáshoz elegendő. Valódi adatbázisos rendszerben az egyedi azonosítót jellemzően a szerver vagy az adatbázis állítja elő. A fenti példában az adatok oldalfrissítés után elvesznek, ha nem mentjük őket tartós tárolóba.

## 8. Adatellenőrzés (validáció)

A HTML már tud néhány alapvető ellenőrzést:

```tsx
<input type="text" required />
<input type="number" min="0" step="1" required />
```

Ezeket érdemes **JavaScript-ellenőrzéssel is kiegészíteni**, például:

```tsx
if (ujKonyv.cim.trim().length === 0) return
if (ujKonyv.ar < 0) return
if (!Number.isInteger(ujKonyv.darabszam)) return
```

A `trim()` eltávolítja a szöveg elején és végén lévő szóközöket. Így nem fogadunk el olyan címet, amely csak szóközökből áll.

Éles alkalmazásban az ellenőrzést a szerveren is el kell végezni. A kliensoldali ellenőrzés elsősorban a felhasználónak ad gyors visszajelzést.



## 9. Gyakori hibák

| Hiba | Miért probléma? | Javítás |
|---|---|---|
| `for="cim"` JSX-ben | Reactben más az attribútum neve. | `htmlFor="cim"` |
| `onChange={setCim(...)}` | A függvény renderelés közben futna le. | `onChange={(e) => setCim(e.target.value)}` |
| `ujKonyv.cim = '...'` | Közvetlenül módosítja a state-objektumot. | `setUjKonyv(elozo => ({ ...elozo, cim: '...' }))` |
| A számmező értékét számnak tekintjük | Az `input.value` szöveget ad vissza. | `Number(e.target.value)` |
| Hiányzik a `preventDefault()` | A böngésző hagyományos űrlapbeküldést végezhet. | `e.preventDefault()` |
| A `name` eltér az objektum kulcsától | A közös eseménykezelő rossz tulajdonságot módosít. | Egyezzenek a nevek. |
| A felhasználó adja meg az ID-t | Ütköző azonosítók keletkezhetnek. | Az alkalmazás állítsa elő. |

## 10. További feladatok


**4. Ellenőrzés:** A cím és a szerző ne lehessen üres; az ár és a darabszám ne lehessen negatív; a darabszám egész szám legyen.

**5. Haladó feladat:** Ha a cím már szerepel a könyvlistában, jeleníts meg figyelmeztetést. A kis- és nagybetűket ne különböztesd meg.

**6. Haladó feladat:** A mentés után jelenjen meg egy visszajelzés: „A könyvet sikeresen hozzáadtuk.”

**7. Továbbfejlesztés:** Készíts könyvszerkesztő űrlapot is, amely a kiválasztott könyv adataival indul, és mentéskor ID alapján módosítja a listában lévő könyvet.

## 11. Összefoglalás

A React-űrlapkezelés legfontosabb fogalmai:

- **`useState`**: tárolja a mezők aktuális értékeit.
- **`value`**: összeköti a beviteli mezőt a state-tel.
- **`onChange`**: kezeli a felhasználó módosításait.
- **`name`**: lehetővé teszi a mezők közös eseménykezelését.
- **`onSubmit`**: az űrlap beküldését kezeli.
- **`preventDefault()`**: megakadályozza a böngésző alapértelmezett beküldési műveletét.
- **Context**: az űrlap komponensétől függetlenül elérhetővé teszi a könyvlista módosítását.

**Alapelv:** a beviteli mezők értékei state-ben vannak; a felhasználó eseményei módosítják ezt a state-et; mentéskor az adatokat a Contextben definiált függvény dolgozza fel.
