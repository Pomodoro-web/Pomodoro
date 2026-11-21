import './App.css'
import PainelDeTarefas from './componentes/Tarefas/PainelDeTarefas'
import Timer from './componentes/Timer/Timer'
import { PresetProvider } from './componentes/Presets'

function App() {
  return (
    <PresetProvider>
      <main className="app">
        <Timer />
        <PainelDeTarefas />
      </main>
    </PresetProvider>
  )
}

export default App