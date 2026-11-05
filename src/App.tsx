import { useState } from 'react'

import './App.css'
import Tablazat from './components/Tablazat'
import UjKonyv from './components/UjKonyv'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <header><h1>Admin felület</h1></header>
        <section><UjKonyv/></section>
        <section>section</section>
        <article>
          <Tablazat />
        </article>
        <footer><p>Készítette: Saját név</p></footer>
      </main>
    </>
  )
}

export default App
