import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { ItemTarefa } from './ItemTarefa';
import { type Tarefa, type EstadoTarefa, carregarTarefas, type FormularioTarefa, gerarIDUnico } from './Comum';
import ListaTarefas from './ListaTarefas';
import CabecalhoTarefas from './HeaderTarefas';
import ComponenteFormulario from './ComponenteFormulario';


function PainelDeTarefas() {

    let [dummy, setDummy] = useState();
    let [tarefas, setTarefas] = useState(carregarTarefas());
    let [formularioAberto, setFormularioAberto] = useState(false);
    let [tarefaEmEdicao, setTarefaEmEdicao] = useState(-1);
    let [formularioAtual, setFormularioAtual] = useState(false);
    let [criandoNovaTarefa, setCriandoNovaTarefa] = useState(false);

    let [dadosFormulario, setDadosFormulario] = useState<FormularioTarefa>({ estado:'backlog', prioridade:0, titulo:"Titulo" });

    function criarNovaTarefa() : void {
        setFormularioAberto(true);
        setCriandoNovaTarefa(true);
    }

    function atualizar(x: (atuais: Tarefa[]) => Tarefa[]) {
        // setStoragePronto(true)
        setTarefas(x)
    }

    function excluirTarefa(tarefa: Tarefa) {

    }

    function cancelarFormulario() {
        setFormularioAberto(false);
    }

    function editarTarefa() {
        


    }

    function adicionarNovaTarefa() {

        const novaTarefa: Tarefa = {
            id: gerarIDUnico(),
            atualizadaEm: new Date().toISOString(),
            criadaEm: new Date().toISOString(),
            estado: dadosFormulario.estado,
            prioridade: dadosFormulario.prioridade,
            titulo: dadosFormulario.titulo,
        };

        tarefas.push(novaTarefa);

        setTarefas(tarefas);

    }

    /*
        function salvarTarefa(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const titulo = formulario.titulo.trim()
    if (!titulo) {
      setErroTitulo('Informe o título da tarefa.')
      return
    }
    if (titulo.length > 100) {
      setErroTitulo('O título deve ter no máximo 100 caracteres.')
      return
    }

    const agora = new Date().toISOString()
    if (tarefaEditando) {
      atualizarTarefas((atuais) => atuais.map((tarefa) =>
        tarefa.id === tarefaEditando ? { ...tarefa, ...formulario, titulo, atualizadaEm: agora } : tarefa,
      ))
    } else {
      atualizarTarefas((atuais) => [...atuais, {
        id: gerarId(), titulo, estado: formulario.estado, prioridade: formulario.prioridade,
        criadaEm: agora, atualizadaEm: agora,
      }])
    }
    fecharFormulario()
  }
    */


    return (
        <div id="tarefas">
        
            <CabecalhoTarefas quantidade={tarefas.length} criarTarefa={criarNovaTarefa} />

            {formularioAberto && (
                <ComponenteFormulario
                    dados={dadosFormulario}
                    erroTitulo={"errro"}
                    nova={criandoNovaTarefa}
                    aoAlterar={(d: FormularioTarefa) => {

                        const t = tarefas.find(
                            (t: Tarefa, index: number, obj: Tarefa[]) => {
                                return t.id === tarefaEmEdicao;
                            }
                        );

                        if (t === undefined) {
                            return;
                        }

                        setTarefas(
                            tarefas.map((tarefa) =>
                                tarefa.id === tarefaEmEdicao ? {
                                    ...tarefa,
                                    ...d,
                                    titulo: d.titulo.trim(),
                                    atualizadaEm: new Date().toISOString(),
                                } : tarefa
                            )
                        );

                    }}
                    aoSalvar={(d: FormularioTarefa) => {

                        const novaTarefa: Tarefa = {
                            id: gerarIDUnico(),
                            atualizadaEm: new Date().toISOString(),
                            criadaEm: new Date().toISOString(),
                            estado: d.estado,
                            prioridade: d.prioridade,
                            titulo: d.titulo,
                        };

                        setTarefas([...tarefas, novaTarefa]);

                    }}
                    aoCancelar={cancelarFormulario}
                />
            )}

            <ListaTarefas
                tarefas={tarefas}
                aoEditar={(x: Tarefa) => {
                    setTarefaEmEdicao(x.id);
                    setFormularioAberto(true);
                    setCriandoNovaTarefa(false);
                    setDadosFormulario({
                        titulo: x.titulo,
                        estado: x.estado,
                        prioridade: x.prioridade,
                    });
                }}
                aoExcluir={(x: Tarefa) => {
  
                    if (confirm(`Deseja excluir a tarefa "${x.titulo}"?`)) {
                        setTarefas(tarefas.filter(x => x.id !== x.id));
                    }
                    setTarefaEmEdicao(-1);

                }}
                aoAlterarEstado={(x: Tarefa) => {

                }}
            />

        </div>
    )

}

export default PainelDeTarefas
