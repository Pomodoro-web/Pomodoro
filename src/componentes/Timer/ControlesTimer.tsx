type PropriedadesControlesTimer = {
  iniciar: () => void
  pausar: () => void
  reiniciar: () => void
}

function ControlesTimer({
  iniciar,
  pausar,
  reiniciar
}: PropriedadesControlesTimer) {
  return (
    <div className="controles">
      <button onClick={iniciar}>
        Iniciar
      </button>

      <button onClick={pausar}>
        Pausar
      </button>

      <button onClick={reiniciar}>
        Reiniciar
      </button>
    </div>
  )
}

export default ControlesTimer