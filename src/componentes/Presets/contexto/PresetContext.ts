import { createContext, useContext } from 'react'
import type { Preset, PresetPersistido, FormularioPresetDados, ErrosValidacaoPreset } from '../dominio/tipos'

export type ContextoPresetTipo = {
  presets: PresetPersistido[]
  presetAtivo: Preset
  selecionarPreset: (id: string) => void
  criarPreset: (dados: FormularioPresetDados) => {
    sucesso: boolean
    erros?: ErrosValidacaoPreset
    preset?: PresetPersistido
  }
  atualizarPreset: (id: string, dados: FormularioPresetDados) => {
    sucesso: boolean
    erros?: ErrosValidacaoPreset
  }
  excluirPreset: (id: string) => { sucesso: boolean; mensagem?: string }
  restaurarPadroes: () => void
  modalGerenciadorAberto: boolean
  abrirGerenciador: () => void
  fecharGerenciador: () => void
}

export const PresetContext = createContext<ContextoPresetTipo | null>(null)

export function usePresets(): ContextoPresetTipo {
  const contexto = useContext(PresetContext)
  if (!contexto) {
    throw new Error('usePresets deve ser utilizado dentro de um <PresetProvider>.')
  }
  return contexto
}

export function usePresetAtivoOpcional(): Preset | undefined {
  const contexto = useContext(PresetContext)
  return contexto?.presetAtivo
}
