import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'

import {
  buscarSessao,
  salvarSessao,
  removerSessao
} from './persistenciaSessao'

import type {
  EstadoPomodoro,
  SessaoAtiva
} from './persistenciaSessao'

const TEMPO_FOCO = 1 * 60
const TEMPO_PAUSA_CURTA = 0.5 * 60
const TEMPO_PAUSA_LONGA = 1 * 60
const CICLOS_ANTES_PAUSA_LONGA = 2

function obterAgora() {
  return Date.now()
}

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
    const sessaoSalva = buscarSessao()

    if (sessaoSalva) {
      if (sessaoSalva.status === 'pausada') {
        retomarSessao()
        return
      }

      if (sessaoSalva.status === 'emAndamento') {
        return
      }
    }

    const agora = obterAgora()

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

    salvarSessao(sessao)

    setEstado('Foco')
    setCicloAtual(1)
    setTempo(TEMPO_FOCO)
    setRodando(true)
  }

  function pausarSessao() {
    const sessao = buscarSessao()

    if (!sessao) {
      return
    }

    const agora = obterAgora()

    sessao.status = 'pausada'
    sessao.pausadaEm = agora
    sessao.tempoRestanteAoPausarMs = tempo * 1000
    sessao.atualizadaEm = agora

    salvarSessao(sessao)

    setRodando(false)
  }

  function retomarSessao() {
    const sessao = buscarSessao()

    if (!sessao) {
      return
    }

    if (sessao.status !== 'pausada') {
      return
    }

    const agora = obterAgora()
    const tempoRestante = sessao.tempoRestanteAoPausarMs ?? 0

    sessao.status = 'emAndamento'
    sessao.inicioFaseEm = agora
    sessao.fimFasePrevistoEm = agora + tempoRestante
    sessao.pausadaEm = null
    sessao.tempoRestanteAoPausarMs = null
    sessao.atualizadaEm = agora

    salvarSessao(sessao)

    setRodando(true)
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
    let novaFase: EstadoPomodoro
    let novoTempo: number

    if (estado === 'Foco') {
      if (cicloAtual >= CICLOS_ANTES_PAUSA_LONGA) {
        novaFase = 'Pausa longa'
        novoTempo = TEMPO_PAUSA_LONGA
      } else {
        novaFase = 'Pausa curta'
        novoTempo = TEMPO_PAUSA_CURTA
      }
    }

    else if (estado === 'Pausa curta') {
      novaFase = 'Foco'
      novoTempo = TEMPO_FOCO
    }

    else {
      novaFase = 'Foco'
      novoTempo = TEMPO_FOCO
    }

    setEstado(novaFase)
    setTempo(novoTempo)

    const sessao = buscarSessao()

    if (!sessao) {
      return
    }

    const agora = obterAgora()

    sessao.faseAtual = novaFase
    sessao.cicloAtual = cicloAtual
    sessao.inicioFaseEm = agora
    sessao.fimFasePrevistoEm = agora + novoTempo * 1000
    sessao.atualizadaEm = agora

    if (sessao.status === 'pausada') {
      sessao.pausadaEm = agora
      sessao.tempoRestanteAoPausarMs = novoTempo * 1000
    }

    salvarSessao(sessao)
  }

  function encerrar() {
    setConfirmarEncerramento(true)
  }

  function confirmarEncerramentoDaSessao() {
    removerSessao()

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
        encerrar={encerrar}
      />

      {confirmarReinicio && (
        <div className="confirmacao">
          <p>Deseja reiniciar os ciclos?</p>
          <button onClick={confirmarReinicioDosCiclos}>Confirmar</button>
          <button onClick={() => setConfirmarReinicio(false)}>Cancelar</button>
        </div>
      )}

      {confirmarEncerramento && (
        <div className="confirmacao">
          <p>Deseja encerrar a sessão?</p>
          <button onClick={confirmarEncerramentoDaSessao}>Confirmar</button>
          <button onClick={() => setConfirmarEncerramento(false)}>Cancelar</button>
        </div>
      )}
    </section>
  )
}

export default Timer