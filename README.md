# Pomodoro

## Painel de tarefas
O subsistema de tarefas utiliza o arquivo-fonte Comum.ts, que fornece
um acesso homogêneo ao localStorage, além de definir o tipo fundamental (Tarefa).
É dividido em 6 subcomponentes: Formulário, cabeçalho, item, lista de itens, ausência de tarefas, e raiz (painel).
Utiliza funcionalides básicas do React: useState para gerenciar estado básico, useEffect para manter as tarefas em localStorage,
e useMemo para mantê-las ordenadas na memória, conforme a prioridade.

## Timer
O Timer é responsável pelo controle das sessões Pomodoro e pela alternância entre as fases de foco, pausa curta e pausa longa. Utiliza useState para gerenciar o tempo restante, fase atual, ciclo e estado da sessão, e useEffect para controlar a contagem regressiva e restaurar sessões em andamento.
A persistência da sessão é realizada no localStorage, armazenando informações como preset utilizado, fase atual, ciclo, status e timestamps. O Timer também utiliza um snapshot do preset selecionado no início da sessão, garantindo que alterações posteriores no preset não modifiquem uma sessão já iniciada.
Entre as funcionalidades estão iniciar, pausar, retomar, pular fases, reiniciar ciclos, encerrar a sessão, restaurar automaticamente o progresso após recarregar a página e emitir um alerta sonoro ao final de cada fase.
## Presets do Timer
todo

