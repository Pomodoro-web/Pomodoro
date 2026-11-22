import { useState, type FormEvent } from 'react'
import type { FormularioPresetDados, PresetPersistido, ErrosValidacaoPreset } from '../dominio/tipos'
import { validarFormularioPreset } from '../dominio/validacoes'

type Props = {
  presetInicial?: PresetPersistido | null
  aoSalvar: (dados: FormularioPresetDados) => void
  aoCancelar: () => void
}

export default function FormularioPreset({ presetInicial, aoSalvar, aoCancelar }: Props) {
  const [nome, setNome] = useState(presetInicial?.nome ?? '')
  const [tempoFocoMin, setTempoFocoMin] = useState(presetInicial?.tempoFocoMin ?? 25)
  const [tempoPausaCurtaMin, setTempoPausaCurtaMin] = useState(presetInicial?.tempoPausaCurtaMin ?? 5)
  const [ciclosAntesPausaLonga, setCiclosAntesPausaLonga] = useState(presetInicial?.ciclosAntesPausaLonga ?? 4)
  const [tempoPausaLongaMin, setTempoPausaLongaMin] = useState(presetInicial?.tempoPausaLongaMin ?? 15)

  const [erros, setErros] = useState<ErrosValidacaoPreset>({})

  function submeter(e: FormEvent) {
    e.preventDefault()

    const dados: FormularioPresetDados = {
      nome,
      tempoFocoMin: Number(tempoFocoMin),
      tempoPausaCurtaMin: Number(tempoPausaCurtaMin),
      ciclosAntesPausaLonga: Number(ciclosAntesPausaLonga),
      tempoPausaLongaMin: Number(tempoPausaLongaMin)
    }

    const validacao = validarFormularioPreset(dados)
    if (!validacao.valido) {
      setErros(validacao.erros)
      return
    }

    setErros({})
    aoSalvar(dados)
  }

  return (
    <form className="formulario-preset" onSubmit={submeter} noValidate>
      <h3 className="formulario-preset-cabecalho">
        {presetInicial ? 'Editar Temporizador Personalizado' : 'Novo Temporizador Personalizado'}
      </h3>

      <div className="campo-grupo">
        <label htmlFor="campo-nome-preset">Nome do Preset</label>
        <input
          id="campo-nome-preset"
          type="text"
          className={`campo-input ${erros.nome ? 'com-erro' : ''}`}
          placeholder="Ex: Estudo Intensivo, Leitura, Código"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
        />
        {erros.nome && <span className="msg-validacao">{erros.nome}</span>}
      </div>

      <div className="grid-campos-tempos">
        <div className="campo-grupo">
          <label htmlFor="campo-foco">Foco (minutos)</label>
          <input
            id="campo-foco"
            type="number"
            min={1}
            max={180}
            className={`campo-input ${erros.tempoFocoMin ? 'com-erro' : ''}`}
            value={tempoFocoMin}
            onChange={(e) => setTempoFocoMin(Number(e.target.value))}
          />
          {erros.tempoFocoMin && <span className="msg-validacao">{erros.tempoFocoMin}</span>}
        </div>

        <div className="campo-grupo">
          <label htmlFor="campo-pausa-curta">Pausa Curta (minutos)</label>
          <input
            id="campo-pausa-curta"
            type="number"
            min={1}
            max={60}
            className={`campo-input ${erros.tempoPausaCurtaMin ? 'com-erro' : ''}`}
            value={tempoPausaCurtaMin}
            onChange={(e) => setTempoPausaCurtaMin(Number(e.target.value))}
          />
          {erros.tempoPausaCurtaMin && <span className="msg-validacao">{erros.tempoPausaCurtaMin}</span>}
        </div>

        <div className="campo-grupo">
          <label htmlFor="campo-ciclos">Ciclos até pausa longa</label>
          <input
            id="campo-ciclos"
            type="number"
            min={1}
            max={12}
            className={`campo-input ${erros.ciclosAntesPausaLonga ? 'com-erro' : ''}`}
            value={ciclosAntesPausaLonga}
            onChange={(e) => setCiclosAntesPausaLonga(Number(e.target.value))}
          />
          {erros.ciclosAntesPausaLonga && <span className="msg-validacao">{erros.ciclosAntesPausaLonga}</span>}
        </div>

        <div className="campo-grupo">
          <label htmlFor="campo-pausa-longa">Pausa Longa (minutos)</label>
          <input
            id="campo-pausa-longa"
            type="number"
            min={1}
            max={90}
            className={`campo-input ${erros.tempoPausaLongaMin ? 'com-erro' : ''}`}
            value={tempoPausaLongaMin}
            onChange={(e) => setTempoPausaLongaMin(Number(e.target.value))}
          />
          {erros.tempoPausaLongaMin && <span className="msg-validacao">{erros.tempoPausaLongaMin}</span>}
        </div>
      </div>

      <div className="formulario-preset-acoes">
        <button type="button" className="botao-secundario" onClick={aoCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao-primario">
          {presetInicial ? 'Salvar Alterações' : 'Criar Preset'}
        </button>
      </div>
    </form>
  )
}
