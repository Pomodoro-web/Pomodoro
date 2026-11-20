type PropriedadesExibirTempo = {
  tempo: number
}

function ExibirTempo({ tempo }: PropriedadesExibirTempo) {
  const minutos = Math.floor(tempo / 60)
  const segundos = tempo % 60

  const tempoFormatado =
    `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`

  return (
    <p className="tempo">
      {tempoFormatado}
    </p>
  )
}

export default ExibirTempo