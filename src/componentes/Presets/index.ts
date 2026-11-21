// Domínio e Tipagens (Contrato Oficial)
export type {
  Preset,
  PresetPersistido,
  FormularioPresetDados,
  ErrosValidacaoPreset
} from './dominio/tipos'

export { PRESETS_PADRAO, ID_PRESET_PADRAO_INICIAL } from './dominio/padroes'
export {
  validarFormularioPreset,
  formatarResumoPreset,
  LIMITES_PRESET
} from './dominio/validacoes'

// Persistência
export type { IPresetRepositorio } from './persistencia/repositorio'
export {
  LocalStoragePresetRepositorio,
  repositorioPresets,
  CHAVE_LS_PRESETS,
  CHAVE_LS_PRESET_ATIVO,
  gerarIdPreset
} from './persistencia/localStorage'

// Contexto e Hooks
export {
  PresetContext,
  usePresets,
  usePresetAtivoOpcional
} from './contexto/PresetContext'
export type { ContextoPresetTipo } from './contexto/PresetContext'
export { PresetProvider } from './contexto/PresetProvider'

// Componentes Visuais
export { default as SeletorPresets } from './ui/SeletorPresets'
export { default as ModalGerenciador } from './ui/ModalGerenciador'
export { default as FormularioPreset } from './ui/FormularioPreset'
