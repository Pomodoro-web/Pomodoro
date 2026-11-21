import type { PresetPersistido } from './tipos'

/**
 * Presets predefinidos da aplicação com configurações consagradas da técnica Pomodoro.
 */
export const PRESETS_PADRAO: readonly PresetPersistido[] = [
  {
    id: 'padrao-classico',
    nome: 'Pomodoro Clássico',
    tempoFocoMin: 25,
    tempoPausaCurtaMin: 5,
    ciclosAntesPausaLonga: 4,
    tempoPausaLongaMin: 15,
    criadoEm: '2026-01-01T00:00:00.000Z',
    atualizadoEm: '2026-01-01T00:00:00.000Z',
    somenteLeitura: true
  },
  {
    id: 'padrao-foco-longo',
    nome: 'Foco Profundo (Deep Work)',
    tempoFocoMin: 50,
    tempoPausaCurtaMin: 10,
    ciclosAntesPausaLonga: 4,
    tempoPausaLongaMin: 30,
    criadoEm: '2026-01-01T00:00:00.000Z',
    atualizadoEm: '2026-01-01T00:00:00.000Z',
    somenteLeitura: true
  },
  {
    id: 'padrao-sprint-curto',
    nome: 'Sprint Rápido',
    tempoFocoMin: 15,
    tempoPausaCurtaMin: 3,
    ciclosAntesPausaLonga: 4,
    tempoPausaLongaMin: 10,
    criadoEm: '2026-01-01T00:00:00.000Z',
    atualizadoEm: '2026-01-01T00:00:00.000Z',
    somenteLeitura: true
  }
]

export const ID_PRESET_PADRAO_INICIAL = 'padrao-classico'
