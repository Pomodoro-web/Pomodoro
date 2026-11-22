import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'

type EstadoPomodoro = 'Foco' | 'Pausa curta' | 'Pausa longa'

type SessaoAtiva = {
  id: string
  presetId: string

  snapshotPreset: {
    tempoFocoMin: number
    tempoPausaCurtaMin: number
    ciclosAntesPausaLonga: number
    tempoPausaLongaMin: number
  }

  faseAtual: EstadoPomodoro
  cicloAtual: number

  status: 'emAndamento' | 'pausada' | 'concluida'

  inicioFaseEm: number
  fimFasePrevistoEm: number

  pausadaEm: number | null
  tempoRestanteAoPausarMs: number | null

  criadaEm: number
  atualizadaEm: number
}

const TEMPO_FOCO = 1 * 60
const TEMPO_PAUSA_CURTA = 0.5 * 60
const TEMPO_PAUSA_LONGA = 1 * 60
const CICLOS_ANTES_PAUSA_LONGA = 2

function Timer() {
  const [tempo, setTempo] = useState(TEMPO_FOCO)
  const [rodando, setRodando] = useState(false)
  const [estado, setEstado] = useState<EstadoPomodoro>('Foco')
  const [cicloAtual, setCicloAtual] = useState(1)
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)
  const [confirmarEncerramento, setConfirmarEncerramento] = useState(false)

  useEffect(() => {
    if (!rodando) {
      return
    }

    const intervalo = setInterval(() => {
      if (tempo <= 1) {
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

        return
      }

      setTempo((tempoAtual) => tempoAtual - 1)
    }, 1000)

    return () => clearInterval(intervalo)
  }, [rodando, tempo, estado, cicloAtual])


  function iniciarSessao() {
    const agora = Date.now()

    const sessao: SessaoAtiva = {
      id: crypto.randomUUID(),
      presetId: 'temporario',

      snapshotPreset: {
        tempoFocoMin: TEMPO_FOCO / 60,
        tempoPausaCurtaMin: TEMPO_PAUSA_CURTA / 60,
        ciclosAntesPausaLonga: CICLOS_ANTES_PAUSA_LONGA,
        tempoPausaLongaMin: TEMPO_PAUSA_LONGA / 60
      },

      faseAtual: 'Foco',
      cicloAtual: 1,

      status: 'emAndamento',

      inicioFaseEm: agora,
      fimFasePrevistoEm: agora + TEMPO_FOCO * 1000,

      pausadaEm: null,
      tempoRestanteAoPausarMs: null,

      criadaEm: agora,
      atualizadaEm: agora
    }

    localStorage.setItem(
      'pomodoro.sessaoAtiva',
      JSON.stringify(sessao)
    )

    setRodando(true)
  }

  function pausarSessao() {
    const sessaoSalva = localStorage.getItem('pomodoro.sessaoAtiva')

    if (!sessaoSalva) {
      return
    }

    const sessao: SessaoAtiva = JSON.parse(sessaoSalva)

    const agora = Date.now()

    sessao.status = 'pausada'
    sessao.pausadaEm = agora
    sessao.tempoRestanteAoPausarMs = tempo * 1000
    sessao.atualizadaEm = agora

    localStorage.setItem(
      'pomodoro.sessaoAtiva',
      JSON.stringify(sessao)
    )

    setRodando(false)
  }

  function reiniciar() {
    setConfirmarReinicio(true)
  }
  function confirmarReinicioDosCiclos() {
    setEstado('Foco')
    setCicloAtual(1)
    setTempo(TEMPO_FOCO)
    setConfirmarReinicio(false)
  }

  function pular() {
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
      setEstado('Foco')
      setTempo(TEMPO_FOCO)
    }

    else if (estado === 'Pausa longa') {
      setEstado('Foco')
      setTempo(TEMPO_FOCO)
    }
  }

  function encerrar() {
    setConfirmarEncerramento(true)
  }

  function confirmarEncerramentoDaSessao() {
    setRodando(false)
    setEstado('Foco')
    setCicloAtual(1)
    setTempo(TEMPO_FOCO)
    setConfirmarEncerramento(false)
  }
  

  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>

      <EstadoTimer estado={estado} />
      <ExibirTempo tempo={tempo} />

      <ControlesTimer
        iniciar={iniciarSessao}
        pausar={pausarSessao}
        reiniciar={reiniciar}
        pular={pular}
        encerrar = {encerrar}
      />

      {confirmarReinicio && (
        <div className="confirmacao">
          <p>Deseja reiniciar os ciclos?</p>

          <button onClick={confirmarReinicioDosCiclos}>
            Confirmar
          </button>
          <button onClick={() => setConfirmarReinicio(false)}>
            Cancelar
          </button>
        </div>
      )}

      {confirmarEncerramento && (
        <div className="confirmacao">
          <p>Deseja encerrar a sessão?</p>

          <button onClick={confirmarEncerramentoDaSessao}>
            Confirmar
          </button>

          <button onClick={() => setConfirmarEncerramento(false)}>
            Cancelar
          </button>
        </div>
      )}
    </section>
  )
}

export default Timer