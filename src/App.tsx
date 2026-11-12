import './App.css'

function App() {
  return (
    <main className="app">
      <section className="pomodoro">
        <h1>Pomodoro</h1>

        <p className="tempo">25:00</p>

        <div className="controles">
          <button>Iniciar</button>
          <button>Pausar</button>
          <button>Pular</button>
        </div>
      </section>

    <aside className="tarefas">
      <div className="cabecalho-tarefas">
        <h2>Tarefas</h2>
        <button>+ Nova tarefa</button>
      </div>

      <div className="lista-tarefas">
        <p>Nenhuma tarefa cadastrada.</p>
      </div>
    </aside>  
    </main>
  )
}

export default App