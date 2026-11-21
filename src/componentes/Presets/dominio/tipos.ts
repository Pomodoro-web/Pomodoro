/**
 * Contrato oficial de integração para o Timer definido em conjunto com a equipe.
 */
export type Preset = {
  id: string
  nome: string
  tempoFocoMin: number
  tempoPausaCurtaMin: number
  ciclosAntesPausaLonga: number
  tempoPausaLongaMin: number
}

/**
 * Extensão do contrato para persistência com metadados de auditoria (ISO timestamps).
 */
export type PresetPersistido = Preset & {
  criadoEm: string
  atualizadoEm: string
  somenteLeitura?: boolean
}

/**
 * Dados manipulados pelo formulário para cadastro ou edição de um preset.
 */
export type FormularioPresetDados = {
  nome: string
  tempoFocoMin: number
  tempoPausaCurtaMin: number
  ciclosAntesPausaLonga: number
  tempoPausaLongaMin: number
}

export type ErrosValidacaoPreset = Partial<Record<keyof FormularioPresetDados, string>>
