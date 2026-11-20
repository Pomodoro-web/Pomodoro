type PropriedadesExibirTempo = {
  tempo: number
}

function ExibirTempo({ tempo }: PropriedadesExibirTempo) {
  return (
    <p className="tempo">
      {tempo}
    </p>
  )
}

export default ExibirTempo