import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'
import { type Preset, usePresetAtivoOpcional, SeletorPresets } from '../Presets'

type EstadoPomodoro = 'Foco' | 'Pausa curta' | 'Pausa longa'

type PropriedadesTimer = {
  preset?: Preset
}

function Timer({ preset: presetProp }: PropriedadesTimer = {}) {
  const presetDoContexto = usePresetAtivoOpcional()
  const presetAtivo = presetProp ?? presetDoContexto
  const tempoPadraoSegundos = (presetAtivo?.tempoFocoMin ?? 25) * 60

  const [tempo, setTempo] = useState(tempoPadraoSegundos)
  const [rodando, setRodando] = useState(false)
  const [prevPresetId, setPrevPresetId] = useState(presetAtivo?.id)
  
  const [estado] = useState<EstadoPomodoro>('Foco')

  // Padrão React para ajuste de estado durante render quando o preset mudar
  if (presetAtivo && presetAtivo.id !== prevPresetId) {
    setPrevPresetId(presetAtivo.id)
    if (!rodando) {
      setTempo(presetAtivo.tempoFocoMin * 60)
    }
  }

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
    setTempo((presetAtivo?.tempoFocoMin ?? 25) * 60)
  }

  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>
      <SeletorPresets />
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