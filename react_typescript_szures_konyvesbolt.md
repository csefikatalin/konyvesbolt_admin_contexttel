# React + TypeScript – Könyvlista szűrése


**Cél:** a felhasználó egy keresőmezőbe gépelve azonnal szűrhesse a könyveket **cím** vagy **szerző** alapján. A keresés együtt működjön a korábban elkészített rendezéssel.


## 1. Mit szeretnénk megvalósítani?

A könyvesbolt adminfelületén már megjelenik a könyvlista egy táblázatban. Most egy keresőmezőt teszünk a táblázat fölé. Ha a felhasználó beírja, hogy `orwell`, csak azok a könyvek jelenjenek meg, amelyek címében vagy szerzőjében szerepel ez a szöveg.

A keresésnek **gépelés közben** kell működnie, külön Keresés gomb nélkül. Ha a mezőt kiürítjük, ismét minden könyv megjelenik.

A keresés nem töröl könyveket: csak azt változtatja meg, **melyik könyveket jelenítjük meg**.

## 2. A `filter()` metódus ismétlése

A `filter()` egy tömb elemei közül kiválogatja azokat, amelyek megfelelnek egy feltételnek. **Új tömböt ad vissza**, az eredetit nem módosítja.

```ts
const szamok = [3, 8, 12, 5, 20];
const nagyok = szamok.filter(szam => szam > 10);

console.log(nagyok); // [12, 20]
```

A könyvek esetében például így válogathatjuk ki a készleten lévőket:

```ts
const keszleten = konyvLista.filter(konyv => konyv.darabszam > 0);
```

**Összehasonlítás:** a törlésnél a `filter()` segítségével **kihagytuk** a törlendő ID-jú könyvet. A keresésnél **megtartjuk** a keresésnek megfelelő könyveket. A teljes `konyvLista` egyik esetben sem módosul közvetlenül.

## 3. Hogyan keresünk szövegben? – `includes()`

Az `includes()` megvizsgálja, hogy egy szöveg tartalmaz-e egy másik szöveget. Logikai értéket (`true` vagy `false`) ad vissza.

```ts
const cim = "A Pál utcai fiúk";

console.log(cim.includes("utcai")); // true
console.log(cim.includes("Orwell")); // false
```

Az `includes()` alapértelmezés szerint különbséget tesz kis- és nagybetű között. Ezért mindkét szöveget kisbetűssé alakítjuk:

```ts
const talalat = cim.toLowerCase().includes("PÁL".toLowerCase());
// true
```

A `trim()` eltávolítja a keresőszöveg elejéről és végéről a véletlenül beírt szóközöket:

```ts
const keresettSzoveg = kereses.trim().toLowerCase();
```

> Megjegyzés: ez a megoldás kis- és nagybetűtől független, de **nem ékezetfüggetlen**. Például az `arany` nem fog egyezni az `árany` szöveggel.

## 4. Mi legyen state?

A felhasználó által beírt szöveg változik, és a változásnak új megjelenítést kell eredményeznie. Ezért a keresőszöveget `useState`-ben tároljuk:

```tsx
const [kereses, setKereses] = useState<string>("");
```

- `kereses`: az aktuálisan beírt szöveg.
- `setKereses`: a keresőszöveget módosító függvény.
- `""`: kezdetben üres a keresőmező.

**A `szurtLista` viszont nem state.** A `konyvLista` és a `kereses` alapján bármikor kiszámítható. Ha külön state-ben tárolnánk, feleslegesen kellene két listát szinkronban tartanunk.

## 5. A keresés megvalósítása a Contextben

A meglévő `TablazatProvider` komponensben hozzuk létre a keresőszöveg state-jét:

```tsx
const [kereses, setKereses] = useState<string>("");
```

Ezután állítsuk elő a szűrt listát:

```tsx
const keresettSzoveg = kereses.trim().toLowerCase();

const szurtLista = konyvLista.filter(konyv =>
    konyv.cim.toLowerCase().includes(keresettSzoveg) ||
    konyv.szerzo.toLowerCase().includes(keresettSzoveg)
);
```

A `||` jelentése **vagy**: a könyv akkor jelenjen meg, ha a címében **vagy** a szerző nevében megtaláljuk a keresett szöveget.

Mi történik üres keresésnél? JavaScriptben minden szöveg tartalmazza az üres karakterláncot (`""`), így ilyenkor minden könyv átmegy a szűrésen.

### Miért a Contextben?

A keresési beállítás központilag elérhető lesz, és a táblázatnak nem kell ismernie a szűrés részleteit. A `Szuro` komponens csak beolvassa a keresőszöveget, a `Tablazat` pedig megjeleníti az eredményt.

Ez a felépítés **nem minden React-alkalmazásban kötelező**, de ebben a projektben jó gyakorlat a Context használatára.

## 6. A Context típusdefiníciójának kiegészítése

A meglévő Context-interfészhez adjuk hozzá:

```tsx
interface TablazatContextTipus {
    // ...a korábban létrehozott mezők és függvények
    kereses: string;
    setKereses: (szoveg: string) => void;
}
```

A `setKereses` egyszerű függvénytípusa azért elegendő, mert közvetlenül szöveget adunk át neki. A React teljes state-setter típusával is megadható:

```tsx
setKereses: React.Dispatch<React.SetStateAction<string>>;
```

Ez utóbbi a funkcionális frissítést is lehetővé teszi. A feladatunkhoz az egyszerűbb változat megfelelő.

Ne felejtsük el a Provider `value` objektumát sem:

```tsx
<TablazatContext.Provider value={{
    // ...a már meglévő értékek
    kereses,
    setKereses,
}}>
    {children}
</TablazatContext.Provider>
```

**Fontos:** a példában a `// ...` megjegyzések helyére a projekt már meglévő Context-értékei kerülnek; a fenti kód önmagában nem teljes Provider.

## 7. A `Szuro.tsx` komponens elkészítése

A szűrő külön komponens lesz, így a táblázat kódja áttekinthető marad.

```tsx
import { useTablazatContext } from '../contexts/TablazatContext';

function Szuro() {
    const { kereses, setKereses } = useTablazatContext();

    return (
        <div className="szuro">
            <label htmlFor="kereses">Könyv keresése:</label>
            <input
                type="search"
                id="kereses"
                placeholder="Cím vagy szerző..."
                value={kereses}
                onChange={(e) => setKereses(e.target.value)}
            />
        </div>
    );
}

export default Szuro;
```

### A legfontosabb attribútumok

| Attribútum | Szerepe |
|---|---|
| `type="search"` | Keresésre szolgáló beviteli mező; egyes böngészők törlőikont is adnak hozzá. |
| `id="kereses"` | Összekapcsolja a mezőt a `label` elemmel. |
| `placeholder` | Segítő szöveg az üres mezőben. |
| `value={kereses}` | A mező értékét a React state határozza meg. |
| `onChange` | Minden módosításkor frissíti a state-et. |

Ez **vezérelt űrlapmező**: a megjelenített érték a React state-jéből származik, és a felhasználó módosítása visszakerül a state-be.

## 8. A szűrés és a rendezés összekapcsolása

A korábbi rendezési tananyagban a `rendezettLista` a `konyvLista` másolatából indult:

```tsx
const rendezettLista = [...konyvLista];
```

Most a **szűrt listából** indulunk:

```tsx
const rendezettLista = [...szurtLista];
```

A meglévő rendezési algoritmus ezután változatlanul alkalmazható:

```tsx
if (rendezesiMezo !== null) {
    rendezettLista.sort((a, b) => {
        const ertekA = a[rendezesiMezo];
        const ertekB = b[rendezesiMezo];

        let eredmeny = 0;

        if (typeof ertekA === "number" && typeof ertekB === "number") {
            eredmeny = ertekA - ertekB;
        } else {
            eredmeny = String(ertekA).localeCompare(String(ertekB), "hu");
        }

        return irany === "novekvo" ? eredmeny : -eredmeny;
    });
}
```

A feldolgozás sorrendje:

```text
konyvLista (teljes, aktuális könyvlista)
       |
       v
filter() – cím vagy szerző szerinti keresés
       |
       v
szurtLista
       |
       v
sort() – a kiválasztott mező és irány szerint
       |
       v
rendezettLista
       |
       v
Tablazat – megjelenítés map() segítségével
```

A `Tablazat` komponensben továbbra is:

```tsx
<tbody>
    {rendezettLista.map(konyv => (
        <Sor konyv={konyv} key={konyv.id} />
    ))}
</tbody>
```

**Fontos:** a `sort()` helyben módosítja a tömböt, ezért készítünk másolatot. A `filter()` viszont eleve új tömböt ad vissza; a másolat itt a korábbi rendezési mintát teszi könnyen követhetővé.

## 9. A komponens elhelyezése

Az `App.tsx`-ben helyezzük a keresőt a táblázat elé:

```tsx
import Szuro from './components/Szuro';
import Tablazat from './components/Tablazat';

function App() {
    return (
        <main>
            <h1>Könyvesbolt – adminfelület</h1>
            <Szuro />
            <Tablazat />
        </main>
    );
}

export default App;
```

A példában a komponensek importútvonala a tényleges mappaszerkezettől függ. Az `App`-ot a `TablazatProvider`-nek kell körülvennie (például a `main.tsx`-ben), ahogy a korábbi feladatoknál.


## 10. Mi történik gépelés közben?

1. A felhasználó beír egy karaktert a keresőmezőbe.
2. Lefut az `onChange`, amely meghívja a `setKereses()` függvényt.
3. Megváltozik a `kereses` state a Context Providerben.
4. A React újrarendereli a Providert, és újraszámítja a `szurtLista`, majd a `rendezettLista` értékét.
5. A táblázat már csak a megfelelő könyveket jeleníti meg.

Nincs szükség külön `setSzurtLista()` hívásra.

## 11. Mi történjen, ha nincs találat?

Érdemes a táblázatban tájékoztatni a felhasználót:

```tsx
<tbody>
    {rendezettLista.length === 0 ? (
        <tr>
            <td colSpan={6}>Nincs a keresésnek megfelelő könyv.</td>
        </tr>
    ) : (
        rendezettLista.map(konyv => (
            <Sor konyv={konyv} key={konyv.id} />
        ))
    )}
</tbody>
```

A `colSpan={6}` azért szerepel, mert a táblázatunknak hat oszlopa van, a törlésgomb oszlopával együtt.

## 12. Gyakori hibák

**1. Közvetlenül a teljes listát írjuk felül a szűrés eredményével.**

```tsx
// Nem célszerű: elveszítjük a nem látható könyveket az állapotból.
setKonyvLista(konyvLista.filter(konyv => konyv.cim.includes(kereses)));
```

A keresés csak megjelenítési feltétel legyen; ne módosítsa a teljes könyvállományt.

**2. Elfelejtjük a kisbetűsítést.**

Az `"orwell"` és `"Orwell"` eltérő karakterláncok. A `toLowerCase()` mindkét oldalon szükséges.

**3. Csak a címben keresünk.**

A feladat szerint a címben **és a szerző mezőben is** keresni kell, ezért a két feltételt `||` kapcsolja össze.

**4. Külön state-be tesszük a szűrt listát.**

A `szurtLista` kiszámítható, ezért felesleges másolatot tárolni state-ben.

**5. A `key` értékének a sor indexét adjuk.**

Szűrés és rendezés esetén az indexek változnak. A stabil `key={konyv.id}` megbízhatóbb.



## 13. Gyakorlófeladatok

### Alapfeladatok

1. **Találatok száma:** jelenítsd meg a keresőmező mellett, hogy hány könyv felel meg a keresésnek.
2. **Üres találati lista:** ha nincs találat, jelenjen meg a „Nincs találat” üzenet.
3. **Keresés törlése:** készíts külön „Keresés törlése” gombot, amely `setKereses("")` hívással kiüríti a mezőt.

### Haladó feladatok

4. **Készleten lévő könyvek:** adj hozzá egy jelölőnégyzetet: „Csak készleten”. Ha be van jelölve, csak a `darabszam > 0` könyvek jelenjenek meg.
5. **Árhatár:** legyen egy maximális ár mező; csak az ennél nem drágább könyvek jelenjenek meg.
6. **Ékezetfüggetlen keresés:** próbáld megoldani, hogy a `gardonyi` keresés a `Gárdonyi` szerzőre is találatot adjon.
7. **Összetett működés:** ellenőrizd, hogy a cím/szerző szerinti keresés, a készletszűrés és az ár szerinti rendezés egyszerre is megfelelően működik-e.

---

## Összefoglalás

A kereséshez **egy új state-re** (`kereses`) van szükség. A `Szuro` komponens vezérelt beviteli mezőként kezeli a felhasználó szövegét. A Contextben a `filter()` segítségével kiszámítjuk a `szurtLista` értékét, majd a korábbi rendezési beállítások alapján előállítjuk a `rendezettLista` értékét. A táblázatnak csak ezt az eredményt kell megjelenítenie.

**Alapelv:** az eredeti könyvlistát nem módosítjuk pusztán azért, mert a felhasználó keres vagy rendez. A szűrt és rendezett lista a meglévő state-ekből számított adat.

## Ellenőrző kérdések

1. Mi a különbség a `filter()` és a `sort()` között az eredeti tömb módosítása szempontjából?
2. Mit vizsgál az `includes()` metódus?
3. Miért alakítjuk kisbetűssé a keresőszöveget és a könyv adatait is?
4. Miért state a `kereses`, és miért nem state a `szurtLista`?
5. Mi történik, ha a keresőmező üres?
6. Miért a `szurtLista` alapján készítjük el a `rendezettLista` értékét?
7. Hogyan működik együtt az `onChange`, a `setKereses` és a React újrarenderelése?
8. Miért nem szabad a szűrés eredményével felülírni a teljes `konyvLista` state-et?
