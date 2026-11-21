type PropriedadesControlesTimer = {
  iniciar: () => void
  pausar: () => void
  reiniciar: () => void
  pular: () => void
}

function ControlesTimer({
  iniciar,
  pausar,
  reiniciar, 
  pular
}: PropriedadesControlesTimer) {
  return (
    <div className="controles">
      <button onClick={iniciar}> Iniciar </button>
      <button onClick={pausar}>Pausar</button>
      <button onClick={reiniciar}>Reiniciar</button>
      <button onClick={pular}>Pular</button>
    </div>
  )
}

export default ControlesTimer