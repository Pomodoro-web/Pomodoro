import {

    getTextoEquivalenteEstado,
    getTextoEquivalentePrioridade,
    type EstadoTarefa,
    type Tarefa

} from "./Comum"

type Props = {
    tarefa: Tarefa
    aoEditar: (tarefa: Tarefa) => void
    aoExcluir: (tarefa: Tarefa) => void
    aoAlterarEstado: (tarefa: Tarefa, estado: EstadoTarefa) => void
}

export function ItemTarefa(args: Props) {
    /*

                    <select
                        value={args.tarefa.estado}
                        onChange={(evento) => args.aoAlterarEstado(args.tarefa, evento.target.value as EstadoTarefa)}
                    >
                        {getTextoEquivalenteEstado(args.tarefa.estado)}
                    </select>
    */
    return (
        <li className={`tarefa-item prioridade${args.tarefa.prioridade}`}>

            <div>

                <label>
                    <input
                        type="checkbox"
                        checked={args.tarefa.estado === 'concluida'}
                        onChange={(evento) => args.aoAlterarEstado(args.tarefa, evento.target.checked ? 'concluida' : 'todo')}
                    />
                    <span className={args.tarefa.estado === 'concluida' ? 'concluido' : ''}>{args.tarefa.titulo}</span>
                </label>

                <div>
                    <span className="tag-prioridade">
                        {getTextoEquivalentePrioridade(args.tarefa.prioridade)}
                    </span>

                </div>

            </div>

            <div>
                <button onClick={() => args.aoEditar(args.tarefa)}>
                    Editar
                </button>
                <button onClick={() => args.aoExcluir(args.tarefa)}>
                    Excluir
                </button>
            </div>

        </li>
    )
}
