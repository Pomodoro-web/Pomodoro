import {useEffect, useState} from 'react'

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

        <p className="tempo">{tempo}</p>

        <div className="controles">
          <button onClick={() => setRodando(true)}>Iniciar</button>
          <button onClick={() => setRodando(false)}>Pausar</button>
          <button onClick={reiniciar}>Reiniciar</button>
        </div>
      </section>
    )
}

export default Timer