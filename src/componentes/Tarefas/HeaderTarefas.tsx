type Props = {
    quantidade: number
    criarTarefa: () => void
    habilitado: boolean
}

export default function HeaderTarefas(x: Props) {
    return (
        <header id="header-tarefas">
            <div>
                <h2>Tarefas</h2>
                <p>{x.quantidade} tarefas cadastradas.</p>
            </div>
            <button className={x.habilitado ? '""' : '"btnAtivo"'} disabled={!x.habilitado} onClick={x.criarTarefa}>
                <span>+</span> Nova tarefa
            </button>
        </header>
    )
}
