import { ItemTarefa } from './ItemTarefa';
import type { Tarefa, EstadoTarefa } from './Comum';
import ListaTarefas from './ListaTarefas';
import CabecalhoTarefas from './HeaderTarefas';


function PainelDeTarefas() {

    function dummy(t: Tarefa): void { }

    function dummy2(): void {}

    let t: Tarefa;
    t = {
        id: 0,
        titulo: 'belo titulo',
        estado: 'emExecucao',
        prioridade: 1,
        criadaEm: '',
        atualizadaEm: '',
    };

    let tt: Tarefa[] = [

        {
            id: 0,
            titulo: 'belo titulo',
            estado: 'emExecucao',
            prioridade: 1,
            criadaEm: '',
            atualizadaEm: '',
        },

        {
            id: 1,
            titulo: 'titulo ainda mais bonito',
            estado: 'cancelada',
            prioridade: 0,
            criadaEm: '',
            atualizadaEm: '',
        },

    ];

    let formularioAberto = false;

    return (
        <div id="tarefas">
            <CabecalhoTarefas quantidade={tt.length} criarTarefa={dummy2} />
            {formularioAberto && (<p>O formulario de criacao de tarefa esta aberto!!</p>)}
            <ListaTarefas
                tarefas={tt}
                aoEditar={dummy}
                aoExcluir={dummy}
                aoAlterarEstado={dummy}
            />
        </div>
    )

}

export default PainelDeTarefas
