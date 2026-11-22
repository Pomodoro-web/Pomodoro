import { useEffect, useState, type ReactNode } from 'react'
import type { Preset, PresetPersistido, FormularioPresetDados } from '../dominio/tipos'
import { validarFormularioPreset } from '../dominio/validacoes'
import { repositorioPresets, gerarIdPreset } from '../persistencia/localStorage'
import type { IPresetRepositorio } from '../persistencia/repositorio'
import { ID_PRESET_PADRAO_INICIAL } from '../dominio/padroes'
import { PresetContext } from './PresetContext'

type PresetProviderProps = {
  children: ReactNode
  repositorio?: IPresetRepositorio
}

export function PresetProvider({ children, repositorio = repositorioPresets }: PresetProviderProps) {
  const [presets, setPresets] = useState<PresetPersistido[]>(() => repositorio.listar())
  const [idAtivo, setIdAtivo] = useState<string>(() => repositorio.obterIdAtivo())
  const [modalGerenciadorAberto, setModalGerenciadorAberto] = useState(false)

  // Sincroniza id ativo no repositório
  useEffect(() => {
    repositorio.definirIdAtivo(idAtivo)
  }, [idAtivo, repositorio])

  // Identifica o preset ativo atual ou usa o primeiro disponível como fallback
  const presetAtivoPersistido =
    presets.find((p) => p.id === idAtivo) ??
    presets.find((p) => p.id === ID_PRESET_PADRAO_INICIAL) ??
    presets[0]

  // Converte para a interface estrita Preset exigida pelo Timer
  const presetAtivo: Preset = {
    id: presetAtivoPersistido.id,
    nome: presetAtivoPersistido.nome,
    tempoFocoMin: presetAtivoPersistido.tempoFocoMin,
    tempoPausaCurtaMin: presetAtivoPersistido.tempoPausaCurtaMin,
    ciclosAntesPausaLonga: presetAtivoPersistido.ciclosAntesPausaLonga,
    tempoPausaLongaMin: presetAtivoPersistido.tempoPausaLongaMin
  }

  function selecionarPreset(id: string) {
    const existe = presets.some((p) => p.id === id)
    if (existe) {
      setIdAtivo(id)
      repositorio.definirIdAtivo(id)
    }
  }

  function criarPreset(dados: FormularioPresetDados) {
    const validacao = validarFormularioPreset(dados)
    if (!validacao.valido) {
      return { sucesso: false, erros: validacao.erros }
    }

    const agora = new Date().toISOString()
    const novoPreset: PresetPersistido = {
      id: gerarIdPreset(),
      nome: dados.nome.trim(),
      tempoFocoMin: dados.tempoFocoMin,
      tempoPausaCurtaMin: dados.tempoPausaCurtaMin,
      ciclosAntesPausaLonga: dados.ciclosAntesPausaLonga,
      tempoPausaLongaMin: dados.tempoPausaLongaMin,
      criadoEm: agora,
      atualizadoEm: agora,
      somenteLeitura: false
    }

    repositorio.salvar(novoPreset)
    const atualizados = repositorio.listar()
    setPresets(atualizados)
    setIdAtivo(novoPreset.id)

    return { sucesso: true, preset: novoPreset }
  }

  function atualizarPreset(id: string, dados: FormularioPresetDados) {
    const existente = presets.find((p) => p.id === id)
    if (!existente) {
      return { sucesso: false, erros: { nome: 'Preset não encontrado.' } }
    }

    if (existente.somenteLeitura) {
      return { sucesso: false, erros: { nome: 'Presets padrão do sistema não podem ser alterados.' } }
    }

    const validacao = validarFormularioPreset(dados)
    if (!validacao.valido) {
      return { sucesso: false, erros: validacao.erros }
    }

    const presetAtualizado: PresetPersistido = {
      ...existente,
      nome: dados.nome.trim(),
      tempoFocoMin: dados.tempoFocoMin,
      tempoPausaCurtaMin: dados.tempoPausaCurtaMin,
      ciclosAntesPausaLonga: dados.ciclosAntesPausaLonga,
      tempoPausaLongaMin: dados.tempoPausaLongaMin,
      atualizadoEm: new Date().toISOString()
    }

    repositorio.salvar(presetAtualizado)
    const atualizados = repositorio.listar()
    setPresets(atualizados)

    return { sucesso: true }
  }

  function excluirPreset(id: string) {
    const preset = presets.find((p) => p.id === id)
    if (!preset) {
      return { sucesso: false, mensagem: 'Preset não encontrado.' }
    }

    if (preset.somenteLeitura) {
      return { sucesso: false, mensagem: 'Presets padrão não podem ser excluídos.' }
    }

    const removeu = repositorio.remover(id)
    if (removeu) {
      const atualizados = repositorio.listar()
      setPresets(atualizados)
      const novoIdAtivo = repositorio.obterIdAtivo()
      setIdAtivo(novoIdAtivo)
      return { sucesso: true }
    }

    return { sucesso: false, mensagem: 'Falha ao remover o preset.' }
  }

  function restaurarPadroes() {
    const restaurados = repositorio.restaurarPadroes()
    setPresets(restaurados)
    setIdAtivo(ID_PRESET_PADRAO_INICIAL)
  }

  return (
    <PresetContext.Provider
      value={{
        presets,
        presetAtivo,
        selecionarPreset,
        criarPreset,
        atualizarPreset,
        excluirPreset,
        restaurarPadroes,
        modalGerenciadorAberto,
        abrirGerenciador: () => setModalGerenciadorAberto(true),
        fecharGerenciador: () => setModalGerenciadorAberto(false)
      }}
    >
      {children}
    </PresetContext.Provider>
  )
}
