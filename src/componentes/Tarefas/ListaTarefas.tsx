import type { EstadoTarefa, Tarefa } from "./Comum"
import { ItemTarefa } from "./ItemTarefa"
import SemTarefas from "./SemTarefas"

type Props = {
    tarefas: Tarefa[]
    aoEditar: (tarefa: Tarefa) => void
    aoExcluir: (tarefa: Tarefa) => void
    aoAlterarEstado: (tarefa: Tarefa, estado: EstadoTarefa) => void
}

export default function ListaTarefas(x: Props) {

    let componente = <SemTarefas></SemTarefas>;
    if (x.tarefas.length > 0) {

        const listaDeTarefas = x.tarefas.map((t) => (
            <ItemTarefa
                key={t.id}
                tarefa={t}
                aoEditar={x.aoEditar}
                aoExcluir={x.aoExcluir}
                aoAlterarEstado={x.aoAlterarEstado}
            />
        ));

        componente = <ol className="lista-tarefas">{listaDeTarefas}</ol>

    }

    return (componente)
    
}
