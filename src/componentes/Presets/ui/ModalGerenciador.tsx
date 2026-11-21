import { useEffect, useState } from 'react'
import { usePresets } from '../contexto/PresetContext'
import type { PresetPersistido, FormularioPresetDados } from '../dominio/tipos'
import { formatarResumoPreset } from '../dominio/validacoes'
import FormularioPreset from './FormularioPreset'

export default function ModalGerenciador() {
  const {
    presets,
    presetAtivo,
    selecionarPreset,
    criarPreset,
    atualizarPreset,
    excluirPreset,
    restaurarPadroes,
    modalGerenciadorAberto,
    fecharGerenciador
  } = usePresets()

  const [modoEdicao, setModoEdicao] = useState(false)
  const [presetEmEdicao, setPresetEmEdicao] = useState<PresetPersistido | null>(null)

  // Fecha o modal ao pressionar ESC
  useEffect(() => {
    function tratarKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && modalGerenciadorAberto) {
        if (modoEdicao) {
          setModoEdicao(false)
          setPresetEmEdicao(null)
        } else {
          fecharGerenciador()
        }
      }
    }

    window.addEventListener('keydown', tratarKeyDown)
    return () => window.removeEventListener('keydown', tratarKeyDown)
  }, [modalGerenciadorAberto, modoEdicao, fecharGerenciador])

  if (!modalGerenciadorAberto) {
    return null
  }

  function handleSalvar(dados: FormularioPresetDados) {
    if (presetEmEdicao) {
      const res = atualizarPreset(presetEmEdicao.id, dados)
      if (res.sucesso) {
        setModoEdicao(false)
        setPresetEmEdicao(null)
      }
    } else {
      const res = criarPreset(dados)
      if (res.sucesso) {
        setModoEdicao(false)
      }
    }
  }

  function handleExcluir(preset: PresetPersistido) {
    const confirmou = window.confirm(`Deseja realmente excluir o preset "${preset.nome}"?`)
    if (confirmou) {
      excluirPreset(preset.id)
    }
  }

  return (
    <div className="modal-presets-backdrop" onClick={fecharGerenciador}>
      <div
        className="modal-presets-dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-presets"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-presets-cabecalho">
          <h2 id="titulo-modal-presets">Gerenciar Temporizadores</h2>
          <button
            type="button"
            className="botao-fechar-modal"
            onClick={fecharGerenciador}
            aria-label="Fechar janela"
          >
            ×
          </button>
        </header>

        <div className="modal-presets-corpo">
          {modoEdicao ? (
            <FormularioPreset
              presetInicial={presetEmEdicao}
              aoSalvar={handleSalvar}
              aoCancelar={() => {
                setModoEdicao(false)
                setPresetEmEdicao(null)
              }}
            />
          ) : (
            <>
              <div className="modal-presets-acoes-topo">
                <button
                  type="button"
                  className="botao-novo-preset"
                  onClick={() => {
                    setPresetEmEdicao(null)
                    setModoEdicao(true)
                  }}
                >
                  + Novo Preset
                </button>
                <button
                  type="button"
                  className="botao-restaurar-padroes"
                  onClick={restaurarPadroes}
                  title="Restaura os presets padrão de fábrica"
                >
                  Restaurar Padrões
                </button>
              </div>

              <ul className="lista-presets">
                {presets.map((preset) => {
                  const isAtivo = preset.id === presetAtivo.id

                  return (
                    <li
                      key={preset.id}
                      className={`item-preset ${isAtivo ? 'ativo' : ''}`}
                    >
                      <div className="info-preset">
                        <div className="titulo-preset-linha">
                          <p className="nome-preset">{preset.nome}</p>
                          {preset.somenteLeitura ? (
                            <span className="badge-tag badge-padrao">Padrão</span>
                          ) : (
                            <span className="badge-tag badge-custom">Personalizado</span>
                          )}
                          {isAtivo && <span className="badge-tag badge-ativo">Ativo</span>}
                        </div>
                        <p className="detalhes-preset">{formatarResumoPreset(preset)}</p>
                      </div>

                      <div className="acoes-preset">
                        {!isAtivo && (
                          <button
                            type="button"
                            className="botao-acao-preset botao-acao-ativar"
                            onClick={() => selecionarPreset(preset.id)}
                          >
                            Usar
                          </button>
                        )}
                        {!preset.somenteLeitura && (
                          <>
                            <button
                              type="button"
                              className="botao-acao-preset"
                              onClick={() => {
                                setPresetEmEdicao(preset)
                                setModoEdicao(true)
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="botao-acao-preset botao-acao-excluir"
                              onClick={() => handleExcluir(preset)}
                            >
                              Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
