import type { PresetPersistido } from '../dominio/tipos'

export interface IPresetRepositorio {
  listar(): PresetPersistido[]
  obterPorId(id: string): PresetPersistido | undefined
  salvar(preset: PresetPersistido): void
  remover(id: string): boolean
  obterIdAtivo(): string
  definirIdAtivo(id: string): void
  restaurarPadroes(): PresetPersistido[]
}
