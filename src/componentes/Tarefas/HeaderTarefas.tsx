type Props = {
    quantidade: number
    criarTarefa: () => void
}

export default function HeaderTarefas(x: Props) {
    return (
        <header>
            <div>
                <h2>Tarefas</h2>
                <p>{x.quantidade} tarefas cadastradas.</p>
            </div>
            <button onClick={x.criarTarefa}>
                <span>+</span> Nova tarefa
            </button>
        </header>
    )
}
