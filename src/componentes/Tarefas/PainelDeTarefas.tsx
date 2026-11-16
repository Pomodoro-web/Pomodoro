function PainelDeTarefas() {
  return (
    <aside className="tarefas">
      <div className="cabecalho-tarefas">
        <h2>Tarefas</h2>
        <button>+ Nova tarefa</button>
      </div>

      <div className="lista-tarefas">
        <p>Nenhuma tarefa cadastrada.</p>
      </div>
    </aside>
  )
}

export default PainelDeTarefas