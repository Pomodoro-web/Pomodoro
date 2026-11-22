import { getTextoEquivalenteEstado, getTextoEquivalentePrioridade, type EstadoTarefa, type FormularioTarefa } from "./Comum"
import { useState } from 'react'

type Props = {
    dados: FormularioTarefa
    erroTitulo: string
    nova: boolean
    aoAlterar: (dados: FormularioTarefa) => void
    aoSalvar: (evento: FormularioTarefa) => void
    aoCancelar: () => void
}

const TAMANHO_MAX_TITULO = 100;

export default function ComponenteFormulario(x: Props) {

    const [dadosFormulario, setDadosFormulario] = useState<FormularioTarefa>(x.dados);
    const [tituloInvalido, setTituloInvalido] = useState(false);

    function extrairDados(): void {
        
        if (dadosFormulario.titulo.length == 0 || dadosFormulario.titulo.length > TAMANHO_MAX_TITULO) {
            setTituloInvalido(true);
            return;
        } else {
            setTituloInvalido(false);
        }

        if (x.nova) {
            x.aoSalvar(dadosFormulario);
        } else {
            x.aoAlterar(dadosFormulario);
        }

        x.aoCancelar();
        
    }

    return (
        <form id="formulario-tarefa">
            <h3>{x.nova ? 'Nova tarefa' : 'Editar tarefa'}</h3>
            <label htmlFor="campo-titulo-tarefa">Título:&nbsp;</label>
            <input
                id="campo-titulo-tarefa"
                autoFocus
                maxLength={TAMANHO_MAX_TITULO}
                value={dadosFormulario.titulo}
                onChange={(e) => { 
                    setDadosFormulario({ ...dadosFormulario, titulo: e.currentTarget.value });
                    setTituloInvalido(false);
                }}
                placeholder="O que você precisa fazer?"
            />
            <br></br>
            {tituloInvalido && (
                <span className="msg-validacao">Certifique-se de colocar um título, e que ele não ultrapasse {TAMANHO_MAX_TITULO} caracteres.</span>
            )}
            <div className="campos-tarefa">
                <div>
                    <label htmlFor="prioridade-tarefa">Prioridade:&nbsp;</label>
                    <select
                        id="prioridade-tarefa"
                        value={dadosFormulario.prioridade}
                        onChange={(e) => { setDadosFormulario({ ...dadosFormulario, prioridade: Number.parseInt(e.target.value) }) } }
                    >
                        <option key="0" value="0">{getTextoEquivalentePrioridade(0)}</option>
                        <option key="1" value="1">{getTextoEquivalentePrioridade(1)}</option>
                        <option key="2" value="2">{getTextoEquivalentePrioridade(2)}</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="estado-tarefa">Estado:&nbsp;</label>
                    <select
                        id="estado-tarefa"
                        value={dadosFormulario.estado}
                        onChange={(e) => { setDadosFormulario({ ...dadosFormulario, estado: e.target.value as EstadoTarefa }) } }
                    >
                        <option key="backlog" value="backlog">{getTextoEquivalenteEstado("backlog")}</option>
                        <option key="cancelada" value="cancelada">{getTextoEquivalenteEstado("cancelada")}</option>
                        <option key="concluida" value="concluida">{getTextoEquivalenteEstado("concluida")}</option>
                        <option key="emExecucao" value="emExecucao">{getTextoEquivalenteEstado("emExecucao")}</option>
                        <option key="todo" value="todo">{getTextoEquivalenteEstado("todo")}</option>
                    </select>
                </div>
            </div>

            <div id="acoes-formulario-tarefa">
                <button type="button" className="botao-secundario-tarefa" onClick={x.aoCancelar}>Cancelar</button>
                <button type="button" className="botao-nova-tarefa" onClick={extrairDados}>
                    {x.nova ? 'Adicionar tarefa' : 'Alterar tarefa'}
                </button>
            </div>

        </form>
    );
}