import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'

type EstadoPomodoro = 'Foco' | 'Pausa curta' | 'Pausa longa'

function Timer() {
  const [tempo, setTempo] = useState(1 * 60)
  const [rodando, setRodando] = useState(false)
  
  const [estado] = useState<EstadoPomodoro>('Foco')

  useEffect(() => {
    if (!rodando) {
      return
    }

    const intervalo = setInterval(() => {
      setTempo((tempoAtual) => {
        if (tempoAtual <= 1) {
          setRodando(false)
          return 0
        }

        return tempoAtual - 1
      })
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