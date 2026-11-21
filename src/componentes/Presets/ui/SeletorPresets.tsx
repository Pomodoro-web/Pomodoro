import { useContext } from 'react'
import { PresetContext } from '../contexto/PresetContext'
import { formatarResumoPreset } from '../dominio/validacoes'
import ModalGerenciador from './ModalGerenciador'
import './presets.css'

export default function SeletorPresets() {
  const contexto = useContext(PresetContext)

  if (!contexto) {
    return null
  }

  const { presets, presetAtivo, selecionarPreset, abrirGerenciador } = contexto

  return (
    <div className="seletor-presets-container">
      <div className="seletor-presets-barra">
        <label htmlFor="seletor-presets-dropdown" className="seletor-presets-rotulo">
          Modo:
        </label>

        <select
          id="seletor-presets-dropdown"
          className="seletor-presets-select"
          value={presetAtivo.id}
          onChange={(e) => selecionarPreset(e.target.value)}
        >
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.nome} ({preset.tempoFocoMin}m foco)
            </option>
          ))}
        </select>

        <button
          type="button"
          className="botao-abrir-gerenciador"
          onClick={abrirGerenciador}
          title="Personalizar temporizadores"
        >
          ⚙ Personalizar
        </button>
      </div>

      <p className="seletor-presets-resumo">
        {formatarResumoPreset(presetAtivo)}
      </p>

      {/* Modal auto-contido gerenciado pelo contexto */}
      <ModalGerenciador />
    </div>
  )
}
