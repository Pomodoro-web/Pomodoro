import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'

function Timer() {
  const [tempo, setTempo] = useState(25 * 60)
  const [rodando, setRodando] = useState(false)

  useEffect(() => {
    if (!rodando) {
      return
    }

    const intervalo = setInterval(() => {
      setTempo((tempoAtual) => tempoAtual - 1)
    }, 1000)

    return () => clearInterval(intervalo)
  }, [rodando])

  function reiniciar() {
    setRodando(false)
    setTempo(25 * 60)
  }

  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>

      <ExibirTempo tempo={tempo} />

      <ControlesTimer
        iniciar={() => setRodando(true)}
        pausar={() => setRodando(false)}
        reiniciar={reiniciar}
      />
    </section>
  )
}
export default Timer