export type EstadoPomodoro = 'Foco' | 'Pausa curta' | 'Pausa longa'

export type SessaoAtiva = {
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

const CHAVE_SESSAO = 'pomodoro.sessaoAtiva'

export function salvarSessao(sessao: SessaoAtiva) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
}

export function buscarSessao(): SessaoAtiva | null {
  const sessaoSalva = localStorage.getItem(CHAVE_SESSAO)

  if (!sessaoSalva) {
    return null
  }

  return JSON.parse(sessaoSalva)
}

export function removerSessao() {
  localStorage.removeItem(CHAVE_SESSAO)
}