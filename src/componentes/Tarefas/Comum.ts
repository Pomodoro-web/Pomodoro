
// estados importantes para a tarefa
export type EstadoTarefa = 'backlog' | 'todo' | 'emExecucao' | 'concluida' | 'cancelada';

export function getTextoEquivalenteEstado(x: EstadoTarefa) : string {
    switch (x) {
        case 'todo':
            return "Pendente.";
        case 'backlog':
            return "Incerta.";
        case 'cancelada':
            return "Cancelada!";
        case 'concluida':
            return "Concluída!"
        default:
            return "Em execução.";
    }
};

export function getTextoEquivalentePrioridade(x: number) : string {
    switch (x) {
        case 0:
            return "Baixa";
        case 1:
            return "Média"
        default:
            return "Alta";
    }
}

export type Tarefa = {
    id: number
    titulo: string
    estado: EstadoTarefa
    prioridade: number
    criadaEm: string
    atualizadaEm: string
};



// nesse caso, o que o usuario deve infomrar para criar a tarefa
export type FormularioTarefa = Pick<Tarefa, 'titulo' | 'estado' | 'prioridade'>;


export const CHAVE_LS_TAREFAS = 'pomodoro.tarefas'
export const CHAVE_LS_TAREFAS_CONTADOR = 'pomodoro.tarefas.contador'


export const formularioInicial: FormularioTarefa = {
    titulo: '',
    estado: 'backlog',
    prioridade: 1,
};

export function carregarTarefas(): Tarefa[] {

    const dados = localStorage.getItem(CHAVE_LS_TAREFAS)
    if (!dados) { 
        return []
    }

    return JSON.parse(dados);

}

export function salvarTarefas(tarefas: Tarefa[]): void {

    localStorage.setItem(CHAVE_LS_TAREFAS, JSON.stringify(tarefas))

}

export function gerarIDUnico(): number {
    // para garantir que seja unico mesmo, vamos ir salvando no localStorage tambem

    const novoId = localStorage.getItem(CHAVE_LS_TAREFAS_CONTADOR);

    if (novoId == null) {
        localStorage.setItem(CHAVE_LS_TAREFAS_CONTADOR, "2");
        return 1;
    }

    const idNum = Number.parseInt(novoId);
    localStorage.setItem(CHAVE_LS_TAREFAS_CONTADOR, String(idNum + 1));

    return idNum;

}
