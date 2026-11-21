import type { PresetPersistido } from '../dominio/tipos'
import type { IPresetRepositorio } from './repositorio'
import { PRESETS_PADRAO, ID_PRESET_PADRAO_INICIAL } from '../dominio/padroes'

export const CHAVE_LS_PRESETS = 'pomodoro.presets'
export const CHAVE_LS_PRESET_ATIVO = 'pomodoro.presets.ativo'

export function gerarIdPreset(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `preset-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export class LocalStoragePresetRepositorio implements IPresetRepositorio {
  listar(): PresetPersistido[] {
    try {
      const raw = localStorage.getItem(CHAVE_LS_PRESETS)
      if (!raw) {
        this.salvarTodos(PRESETS_PADRAO as PresetPersistido[])
        return [...PRESETS_PADRAO]
      }
      const parsed = JSON.parse(raw) as PresetPersistido[]
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.salvarTodos(PRESETS_PADRAO as PresetPersistido[])
        return [...PRESETS_PADRAO]
      }
      return parsed
    } catch {
      return [...PRESETS_PADRAO]
    }
  }

  obterPorId(id: string): PresetPersistido | undefined {
    return this.listar().find((p) => p.id === id)
  }

  salvar(preset: PresetPersistido): void {
    const lista = this.listar()
    const index = lista.findIndex((p) => p.id === preset.id)
    if (index >= 0) {
      lista[index] = preset
    } else {
      lista.push(preset)
    }
    this.salvarTodos(lista)
  }

  remover(id: string): boolean {
    const lista = this.listar()
    const preset = lista.find((p) => p.id === id)
    if (!preset || preset.somenteLeitura) {
      return false
    }
    const filtrada = lista.filter((p) => p.id !== id)
    this.salvarTodos(filtrada)

    if (this.obterIdAtivo() === id) {
      this.definirIdAtivo(filtrada[0]?.id ?? ID_PRESET_PADRAO_INICIAL)
    }
    return true
  }

  obterIdAtivo(): string {
    try {
      const id = localStorage.getItem(CHAVE_LS_PRESET_ATIVO)
      if (id) {
        return id
      }
    } catch {
      // Ignora erro de acesso ao storage
    }
    return ID_PRESET_PADRAO_INICIAL
  }

  definirIdAtivo(id: string): void {
    try {
      localStorage.setItem(CHAVE_LS_PRESET_ATIVO, id)
    } catch {
      // Ignora erro de acesso ao storage
    }
  }

  restaurarPadroes(): PresetPersistido[] {
    const padroes = [...PRESETS_PADRAO]
    this.salvarTodos(padroes)
    this.definirIdAtivo(ID_PRESET_PADRAO_INICIAL)
    return padroes
  }

  private salvarTodos(presets: PresetPersistido[]): void {
    try {
      localStorage.setItem(CHAVE_LS_PRESETS, JSON.stringify(presets))
    } catch {
      // Fallback em caso de erro de armazenamento
    }
  }
}

export const repositorioPresets = new LocalStoragePresetRepositorio()
