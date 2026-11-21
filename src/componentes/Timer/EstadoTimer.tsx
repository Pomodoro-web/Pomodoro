type PropriedadesEstadoTimer = {
  estado: string
}

function EstadoTimer({ estado }: PropriedadesEstadoTimer) {
  return (
    <p className="estado-timer">
      {estado}
    </p>
  )
}

export default EstadoTimer