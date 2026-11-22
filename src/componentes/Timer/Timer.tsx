import { useEffect, useState } from 'react'
import ExibirTempo from './ExibirTempo'
import ControlesTimer from './ControlesTimer'
import EstadoTimer from './EstadoTimer'
import { type Preset, usePresetAtivoOpcional, SeletorPresets } from '../Presets'

import {
  buscarSessao,
  salvarSessao,
  removerSessao
} from './persistenciaSessao'

import type {
  EstadoPomodoro,
  SessaoAtiva
} from './persistenciaSessao'

const TEMPO_FOCO = 0.5 * 60
const TEMPO_PAUSA_CURTA = 0.2 * 60
const TEMPO_PAUSA_LONGA = 0.5 * 60
const CICLOS_ANTES_PAUSA_LONGA = 2

function obterAgora() {
  return Date.now()
}

function obterDuracaoDaFase(fase: EstadoPomodoro) {
  if (fase === 'Foco') {
    return TEMPO_FOCO
  }
  if (fase === 'Pausa curta') {
    return TEMPO_PAUSA_CURTA
  }
  
  return TEMPO_PAUSA_LONGA
}

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
  const [estado, setEstado] = useState<EstadoPomodoro>('Foco')
  const [cicloAtual, setCicloAtual] = useState(1)
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)
  const [confirmarEncerramento, setConfirmarEncerramento] = useState(false)

  useEffect(() => {
    const sessao = buscarSessao()

    if (!sessao) {
      return
    }

    if (sessao.status === 'pausada') {
      const tempoRestante = sessao.tempoRestanteAoPausarMs ?? 0

      const restaurarSessao = setTimeout(() => {
        setEstado(sessao.faseAtual)
        setCicloAtual(sessao.cicloAtual)
        setTempo(Math.ceil(tempoRestante / 1000))
        setRodando(false)
      }, 0)

      return () => clearTimeout(restaurarSessao)
    }

    if (sessao.status === 'emAndamento') {
      const agora = obterAgora()
      let faseAtual = sessao.faseAtual
      let cicloAtualRestaurado = sessao.cicloAtual
      let fimDaFase = sessao.fimFasePrevistoEm

      while (fimDaFase <= agora) {
        if (faseAtual === 'Foco') {
          if (cicloAtualRestaurado >= CICLOS_ANTES_PAUSA_LONGA) {
            faseAtual = 'Pausa longa'
          } else {
            faseAtual = 'Pausa curta'
          }
        }

        else if (faseAtual === 'Pausa curta') {
          cicloAtualRestaurado = cicloAtualRestaurado + 1
          faseAtual = 'Foco'
        }

        else {
          cicloAtualRestaurado = 1
          faseAtual = 'Foco'
        }

        fimDaFase = fimDaFase + obterDuracaoDaFase(faseAtual) * 1000
      }

      const tempoRestante = fimDaFase - agora

      sessao.faseAtual = faseAtual
      sessao.cicloAtual = cicloAtualRestaurado
      sessao.inicioFaseEm = fimDaFase - obterDuracaoDaFase(faseAtual) * 1000
      sessao.fimFasePrevistoEm = fimDaFase
      sessao.atualizadaEm = agora

      salvarSessao(sessao)

      const restaurarSessao = setTimeout(() => {
        setEstado(faseAtual)
        setCicloAtual(cicloAtualRestaurado)
        setTempo(Math.ceil(tempoRestante / 1000))
        setRodando(true)
      }, 0)

      return () => clearTimeout(restaurarSessao)
    }
  }, [])

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
      if (tempo <= 1) {
        let novaFase: EstadoPomodoro
        let novoTempo: number
        let novoCiclo = cicloAtual

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
          novoCiclo = cicloAtual + 1
        }

        else {
          novaFase = 'Foco'
          novoTempo = TEMPO_FOCO
          novoCiclo = 1
        }

        setEstado(novaFase)
        setTempo(novoTempo)
        setCicloAtual(novoCiclo)

        const sessao = buscarSessao()

        if (sessao) {
          const agora = obterAgora()

          sessao.faseAtual = novaFase
          sessao.cicloAtual = novoCiclo
          sessao.inicioFaseEm = agora
          sessao.fimFasePrevistoEm = agora + novoTempo * 1000
          sessao.atualizadaEm = agora

          salvarSessao(sessao)
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
    const sessao = buscarSessao()

    if (sessao) {
      const agora = obterAgora()

        sessao.faseAtual = 'Foco'
        sessao.cicloAtual = 1
        sessao.inicioFaseEm = agora
        sessao.fimFasePrevistoEm = agora + TEMPO_FOCO * 1000
        sessao.atualizadaEm = agora

        if (sessao.status === 'pausada') {
          sessao.pausadaEm = agora
          sessao.tempoRestanteAoPausarMs = TEMPO_FOCO * 1000
        }

        salvarSessao(sessao)
    }

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
    setTempo((presetAtivo?.tempoFocoMin ?? 25) * 60)
    setConfirmarEncerramento(false)
  }

  return (
    <section className="pomodoro">
      <h1>Pomodoro</h1>
      <SeletorPresets />
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