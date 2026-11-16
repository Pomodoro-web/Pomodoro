import {useEffect, useState} from 'react'

function Timer() {
  const [tempo, setTempo] = useState(25 * 60)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo((tempoAtual) => tempoAtual - 1)
    }, 1000)
    return () => clearInterval(intervalo)
    }, [])
  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>

      <p className="tempo">{tempo}</p>

      <div className="controles">
        <button>Iniciar</button>
        <button>Pausar</button>
        <button>Reiniciar</button>
      </div>
    </section>
  )
}

export default Timer