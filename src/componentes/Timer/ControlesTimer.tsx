type PropriedadesControlesTimer = {
  iniciar: () => void
  pausar: () => void
  reiniciar: () => void
  pular: () => void
  encerrar:() => void
}

function ControlesTimer({
  iniciar,
  pausar,
  reiniciar, 
  pular,
  encerrar
}: PropriedadesControlesTimer) {
  return (
    <div className="controles">
      <button onClick={iniciar}> Iniciar </button>
      <button onClick={pausar}>Pausar</button>
      <button onClick={reiniciar}>Reiniciar</button>
      <button onClick={pular}>Pular</button>
      <button onClick={encerrar}>Encerrar</button>
    </div>
  )
}

export default ControlesTimer