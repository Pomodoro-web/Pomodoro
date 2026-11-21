import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'

type EstadoPomodoro = 'Foco' | 'Pausa curta' | 'Pausa longa'

const TEMPO_FOCO = 1 * 60
const TEMPO_PAUSA_CURTA = 0.5 * 60
const TEMPO_PAUSA_LONGA = 1 * 60
const CICLOS_ANTES_PAUSA_LONGA = 2

function Timer() {
  const [tempo, setTempo] = useState(TEMPO_FOCO)
  const [rodando, setRodando] = useState(false)
  const [estado, setEstado] = useState<EstadoPomodoro>('Foco')
  const [cicloAtual, setCicloAtual] = useState(1)

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
        if (cicloAtual >= CICLOS_ANTES_PAUSA_LONGA) {
          setEstado('Pausa longa')
          setTempo(TEMPO_PAUSA_LONGA)
        } else {
          setEstado('Pausa curta')
          setTempo(TEMPO_PAUSA_CURTA)
        }
      }

      else if (estado === 'Pausa curta') {
        setCicloAtual((ciclo) => ciclo + 1)
        setEstado('Foco')
        setTempo(TEMPO_FOCO)
      }

      else if (estado === 'Pausa longa') {
        setCicloAtual(1)
        setEstado('Foco')
        setTempo(TEMPO_FOCO)
      }
    }
  }, [tempo, rodando, estado, cicloAtual])

  function reiniciar() {
    setRodando(false)
    setEstado('Foco')
    setCicloAtual(1)
    setTempo(TEMPO_FOCO)
  }

  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>

      <EstadoTimer estado={estado} />

      <p>Ciclo {cicloAtual}</p>

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