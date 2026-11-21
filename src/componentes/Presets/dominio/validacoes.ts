import type { FormularioPresetDados, ErrosValidacaoPreset, Preset } from './tipos'

export const LIMITES_PRESET = {
  nome: { min: 2, max: 40 },
  foco: { min: 1, max: 180 },
  pausaCurta: { min: 1, max: 60 },
  ciclos: { min: 1, max: 12 },
  pausaLonga: { min: 1, max: 90 }
} as const

export function validarFormularioPreset(dados: FormularioPresetDados): {
  valido: boolean
  erros: ErrosValidacaoPreset
} {
  const erros: ErrosValidacaoPreset = {}
  const nomeTrim = dados.nome.trim()

  if (!nomeTrim) {
    erros.nome = 'O nome do preset é obrigatório.'
  } else if (nomeTrim.length < LIMITES_PRESET.nome.min) {
    erros.nome = `O nome deve ter no mínimo ${LIMITES_PRESET.nome.min} caracteres.`
  } else if (nomeTrim.length > LIMITES_PRESET.nome.max) {
    erros.nome = `O nome não pode exceder ${LIMITES_PRESET.nome.max} caracteres.`
  }

  if (
    !Number.isInteger(dados.tempoFocoMin) ||
    dados.tempoFocoMin < LIMITES_PRESET.foco.min ||
    dados.tempoFocoMin > LIMITES_PRESET.foco.max
  ) {
    erros.tempoFocoMin = `O foco deve ser entre ${LIMITES_PRESET.foco.min} e ${LIMITES_PRESET.foco.max} minutos.`
  }

  if (
    !Number.isInteger(dados.tempoPausaCurtaMin) ||
    dados.tempoPausaCurtaMin < LIMITES_PRESET.pausaCurta.min ||
    dados.tempoPausaCurtaMin > LIMITES_PRESET.pausaCurta.max
  ) {
    erros.tempoPausaCurtaMin = `A pausa curta deve ser entre ${LIMITES_PRESET.pausaCurta.min} e ${LIMITES_PRESET.pausaCurta.max} minutos.`
  }

  if (
    !Number.isInteger(dados.ciclosAntesPausaLonga) ||
    dados.ciclosAntesPausaLonga < LIMITES_PRESET.ciclos.min ||
    dados.ciclosAntesPausaLonga > LIMITES_PRESET.ciclos.max
  ) {
    erros.ciclosAntesPausaLonga = `Os ciclos devem ser entre ${LIMITES_PRESET.ciclos.min} e ${LIMITES_PRESET.ciclos.max}.`
  }

  if (
    !Number.isInteger(dados.tempoPausaLongaMin) ||
    dados.tempoPausaLongaMin < LIMITES_PRESET.pausaLonga.min ||
    dados.tempoPausaLongaMin > LIMITES_PRESET.pausaLonga.max
  ) {
    erros.tempoPausaLongaMin = `A pausa longa deve ser entre ${LIMITES_PRESET.pausaLonga.min} e ${LIMITES_PRESET.pausaLonga.max} minutos.`
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros
  }
}

export function formatarResumoPreset(preset: Preset): string {
  return `${preset.tempoFocoMin}m foco • ${preset.tempoPausaCurtaMin}m pausa • ${preset.ciclosAntesPausaLonga} ciclos • ${preset.tempoPausaLongaMin}m pausa longa`
}
