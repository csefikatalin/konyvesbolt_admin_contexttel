
export interface KonyvTipus {
  id: number;
  cim: string;
  szerzo: string;
  ar: number;
  darabszam: number;
}

export const KONYVLISTA: KonyvTipus[] = [
  {
    id: 1,
    cim: "A Pál utcai fiúk",
    szerzo: "Molnár Ferenc",
    ar: 3490,
    darabszam: 12
  },
  {
    id: 2,
    cim: "Egri csillagok",
    szerzo: "Gárdonyi Géza",
    ar: 4290,
    darabszam: 8
  },
  {
    id: 3,
    cim: "Az arany ember",
    szerzo: "Jókai Mór",
    ar: 3990,
    darabszam: 6
  },
  {
    id: 4,
    cim: "Abigél",
    szerzo: "Szabó Magda",
    ar: 4490,
    darabszam: 15
  },
  {
    id: 5,
    cim: "Utas és holdvilág",
    szerzo: "Szerb Antal",
    ar: 3790,
    darabszam: 9
  },
  {
    id: 6,
    cim: "1984",
    szerzo: "George Orwell",
    ar: 4990,
    darabszam: 14
  },
  {
    id: 7,
    cim: "Állatfarm",
    szerzo: "George Orwell",
    ar: 3290,
    darabszam: 11
  },
  {
    id: 8,
    cim: "A kis herceg",
    szerzo: "Antoine de Saint-Exupéry",
    ar: 2990,
    darabszam: 20
  },
  {
    id: 9,
    cim: "Harry Potter és a bölcsek köve",
    szerzo: "J. K. Rowling",
    ar: 5990,
    darabszam: 18
  },
  {
    id: 10,
    cim: "A Gyűrűk Ura",
    szerzo: "J. R. R. Tolkien",
    ar: 12990,
    darabszam: 5
  },
  {
    id: 11,
    cim: "A hobbit",
    szerzo: "J. R. R. Tolkien",
    ar: 5490,
    darabszam: 10
  },
  {
    id: 12,
    cim: "Büszkeség és balítélet",
    szerzo: "Jane Austen",
    ar: 4490,
    darabszam: 7
  },
  {
    id: 13,
    cim: "Jane Eyre",
    szerzo: "Charlotte Brontë",
    ar: 4790,
    darabszam: 4
  },
  {
    id: 14,
    cim: "Bűn és bűnhődés",
    szerzo: "Fjodor Dosztojevszkij",
    ar: 5990,
    darabszam: 6
  },
  {
    id: 15,
    cim: "A Mester és Margarita",
    szerzo: "Mihail Bulgakov",
    ar: 5290,
    darabszam: 8
  },
  {
    id: 16,
    cim: "Száz év magány",
    szerzo: "Gabriel García Márquez",
    ar: 6490,
    darabszam: 3
  },
  {
    id: 17,
    cim: "A szolgálólány meséje",
    szerzo: "Margaret Atwood",
    ar: 5490,
    darabszam: 9
  },
  {
    id: 18,
    cim: "Dűne",
    szerzo: "Frank Herbert",
    ar: 6990,
    darabszam: 13
  },
  {
    id: 19,
    cim: "Virágot Algernonnak",
    szerzo: "Daniel Keyes",
    ar: 4690,
    darabszam: 7
  },
  {
    id: 20,
    cim: "A marsi",
    szerzo: "Andy Weir",
    ar: 5990,
    darabszam: 0
  }
];
