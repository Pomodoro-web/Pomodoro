import './App.css'
import PainelDeTarefas from './componentes/Tarefas/PainelDeTarefas'
import Timer from './componentes/Timer/Timer'

function App() {
  return (
    <main className="app">
      <Timer />
      <PainelDeTarefas />
    </main>
  )
}

export default App