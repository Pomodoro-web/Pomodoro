import { useEffect, useState, useMemo } from 'react'

import { type Tarefa, type EstadoTarefa, carregarTarefas, type FormularioTarefa, gerarIDUnico, salvarTarefas } from './Comum';
import ListaTarefas from './ListaTarefas';
import CabecalhoTarefas from './HeaderTarefas';
import ComponenteFormulario from './ComponenteFormulario';


function PainelDeTarefas() {

    const [tarefas, setTarefas] = useState(carregarTarefas());
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [tarefaEmEdicao, setTarefaEmEdicao] = useState(-1);
    const [criandoNovaTarefa, setCriandoNovaTarefa] = useState(false);

    const [dadosFormulario, setDadosFormulario] = useState<FormularioTarefa>({ estado:'backlog', prioridade: 1, titulo: "" });

    function ordenarTarefas(tarefas: Tarefa[]): Tarefa[] {

        const ordemEstado = {
            todo: 1,
            emExecucao: 2,
            concluida: 3,
            cancelada: 4,
            backlog: 5,
        };

        return [...tarefas].sort((a, b) => {

            const diferencaPrioridade = b.prioridade - a.prioridade;

            if (diferencaPrioridade !== 0) {
                return diferencaPrioridade;
            }

            return ordemEstado[a.estado] - ordemEstado[b.estado];

        });

    }

    const tarefasOrdenadas = useMemo(() => 
        ordenarTarefas(tarefas), [tarefas]
    );

    useEffect(() => {
        salvarTarefas(tarefas);
    }, [tarefas]);

    function criarNovaTarefa() : void {
        setFormularioAberto(true);
        setCriandoNovaTarefa(true);
        setDadosFormulario({
            estado: "backlog",
            prioridade: 1,
            titulo: "",
        });
    }

    function cancelarFormulario() {
        setFormularioAberto(false);
    }

    return (
        <div id="tarefas">
        
            <CabecalhoTarefas quantidade={tarefasOrdenadas.length} criarTarefa={criarNovaTarefa} habilitado={!formularioAberto} />

            {formularioAberto && (
                <ComponenteFormulario
                    dados={dadosFormulario}
                    erroTitulo={"errro"}
                    nova={criandoNovaTarefa}
                    aoAlterar={(d: FormularioTarefa) => {

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

            {!formularioAberto && (
                <ListaTarefas
                    tarefas={tarefasOrdenadas}
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
                            setTarefas(tarefas.filter(y => y.id !== x.id));
                        }
                        setTarefaEmEdicao(-1);

                    }}
                    aoAlterarEstado={(x: Tarefa, e: EstadoTarefa) => {
                        setTarefas(
                            tarefas.map((tarefa) =>
                                tarefa.id === x.id ? {
                                    ...tarefa,
                                    estado: e
                                } : tarefa
                            )
                        );
                    }}
                />
            )}

        </div>
    )

}

export default PainelDeTarefas
