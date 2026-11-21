import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'

type EstadoPomodoro = 'Foco' | 'Pausa curta' | 'Pausa longa'

function Timer() {
  const [tempo, setTempo] = useState(1 * 60)
  const [rodando, setRodando] = useState(false)
  const [estado, setEstado] = useState<EstadoPomodoro>('Foco')

  useEffect(() => {
    if (!rodando) {
      return
    }

    const intervalo = setInterval(() => {
      setTempo((tempoAtual) => Math.max(0, tempoAtual - 1))
    }, 1000)

    return () => clearInterval(intervalo)
  }, [rodando])

 useEffect(() => {
  if (tempo === 0 && rodando) {
    if (estado === 'Foco') {
      setEstado('Pausa curta')
      setTempo(0.5 * 60)
    } else if (estado === 'Pausa curta') {
      setEstado('Foco')
      setTempo(1 * 60)
    }
  }
}, [tempo, rodando, estado])

  function reiniciar() {
    setRodando(false)
    setEstado('Foco')
    setTempo(1 * 60)
  }

  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>
      <EstadoTimer estado={estado} />
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