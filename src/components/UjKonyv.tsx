
import { useState } from "react";

import "./ujKonyv.css"
import { useTablazatContext, type UjKonyvTipus } from "../contexts/TablazatContext";


function UjKonyv() {
  const { konyvHozzaadas } = useTablazatContext();

  const [ujKonyv, setUjKonyv] = useState<UjKonyvTipus>({
    cim: "",
    szerzo: "",
    ar: 0,
    darabszam: 0
  });

  function adatValtozas(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type } = e.target;

    setUjKonyv({
      ...ujKonyv,
      [name]: type === "number" ? Number(value) : value
    });
  }

  function mentes(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    konyvHozzaadas(ujKonyv);

    setUjKonyv({
      cim: "",
      szerzo: "",
      ar: 0,
      darabszam: 0
    });
  }

  return (
    <section className="uj-konyv">
      <h2>Új könyv rögzítése</h2>

      <form onSubmit={mentes}>
        <div className="form-mezo">
          <label htmlFor="cim">Könyv címe</label>
          <input
            type="text"
            id="cim"
            name="cim"
            value={ujKonyv.cim}
            onChange={adatValtozas}
            required
          />
        </div>

        <div className="form-mezo">
          <label htmlFor="szerzo">Szerző</label>
          <input
            type="text"
            id="szerzo"
            name="szerzo"
            value={ujKonyv.szerzo}
            onChange={adatValtozas}
            required
          />
        </div>

        <div className="form-mezo">
          <label htmlFor="ar">Ár (Ft)</label>
          <input
            type="number"
            id="ar"
            name="ar"
            min="3000"
            value={ujKonyv.ar}
            onChange={adatValtozas}
            required
          />
        </div>

        <div className="form-mezo">
          <label htmlFor="darabszam">Darabszám</label>
          <input
            type="number"
            id="darabszam"
            name="darabszam"
            min="0"
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
  );
}

export default UjKonyv;
