# Documentação TimeSheet

##### Prestativ - Fabrica SAP

##### Av Diário de Notícias 200 - conj 901 - Porto Alegre - RS

##### [Ver Endereço no Mapa](https://www.google.com/maps/place/Prestativ/@-30.0842972,-51.2465929,15z/data=!4m5!3m4!1s0x0:0x77f3b62364d4c17b!8m2!3d-30.0842972!4d-51.2465929)

##### [Site da Prestativ](www.prestativ.com.br)

##### [Facebook da Prestativ](https://www.facebook.com/prestativsap)

##### [LinkedIn da Prestativ](https://www.linkedin.com/company/prestativ/)

##### [GitHub da Prestativ](/)

##### **_Documento Elaborado por Filipe Bacof_**

##### _Colaborador desde DEZ-2022_

##### filipe.bacof@prestativ.com.br

##### (51) 3407-0977

##### **GitHub dos Desenvolvedores do Timesheet:**

##### [GitHub do Filipe](https://github.com/Filipe-Bacof)

##### [GitHub do Pedro](https://github.com/pedroota)

---

## Propósito do TimeSheet

- Gostaria de introduzir essa seção mencionando a forma como a empresa trabalhava anteriormente sem esse sistema;
- A rotina girava em torno de planílhas no excel, que consumiam mais de 3 dias de trabalho, também ocorriam eventualmente perdas financeiras, devido por exemplo: informações duplicadas, informações com nomes diferentes, falta de informações, demora para localizar algo em meio ao excesso de informações, etc...
- O timesheet surgiu com o objetivo de facilitar a administração dessas informações, poupar uma quantidade considerável de tempo e evitar retrabalho no setor administrativo;
- O que antes era trabalhoso e caro de se fazer, será feito em apenas uma manhã;

---

## Funcionalidades

> listagem dos requisitos funcionais do sistema:

1. Sistema seguro de Login e Autenticação de Usuários;
2. Cadastro de usuários pode ser feito apenas pelo usuário Administrador (assin como Edição e Exclusão);
   ### Campos Disponíveis:
   - Código do Usuário;
   - Nome;
   - Sobrenome;
   - Email;
   - Senha;
   - Nível do Usuário / Permissões / Atuação e Interação com o Sistema;
   - Data de Criação;
   - Data de Edição;
3. Recuperação de Senha na tela de Login, pode ser feito apenas com o email corporativo (final = @prestativ.com.br);
4. Tela para visualizar o lançamento de horas (TIMESHEET), serão a mesma tela com exibição de forma distinta para usuários diferentes:
   - Para Administrador irá aparecer TODAS as informações;
   - Para Consultor, algumas informações não devem ser exibidas;
5. Filtragem de Informações na tela principal de Timesheet:
   - Por Data;
   - Por Usuário (colaborador`es` vinculado`s` ao lançamento);
   - Por Cliente;
   - Por Projeto;
   - Por Atividade;
   - `Deve ser possível utilizar todos os filtros de forma independente, ou combinados;`
6. Deve ser Exibido apenas o mês atual na tela, porém com uma forma de visualizar o histórico;
7. O lançamento das horas deve ser feito em apenas 1 dia no máximo depois do período trabalhado (essa informação deve ser possível alterar posteriormente via backend, não precisa ser editável pelo front-end);
8. Cadastro de Clientes (assim como Edição e Exclusão):
   ### Campos Disponíveis:
   - Código do Cliente;
   - Nome / Razão Social;
   - CNPJ;
   - Endereço Completo (Rua, Número, Complemento, CEP, Bairro, Cidade, Estado);
   - Período de faturamento (de xx/xx/xxxx até xx/xx/xxxx = será utilizado no timesheet para calculo de faturamento, nem todas as empresas são 01 até 31);
   - Dia Limite de Faturamento;
   - Dia de Pagamento;
   - Valor;
   - Gerente de Projetos;
   - Data de Criação;
   - Data de Edição;
9. Cadastro de Projetos (assim como Edição e Exclusão):
   ### Campos Disponíveis:
   - Código Referencia ao Cliente;
   - Código do Projeto;
   - Título do Projeto;
   - Descrição;
   - Valor;
   - Gerente de Projetos;
   - Data de Criação;
   - Data de Edição;
10. Cadastro de Atividades (assim como Edição e Exclusão):
    ### Campos Disponíveis:
    - Código Referencia ao Projeto;
    - Código da Atividade;
    - Título da Atividade;
    - Descrição;
    - Valor;
    - Gerente de Projetos;
    - Número do Chamado;
    - Data de Criação;
    - Data de Edição;
11. Logo após as horas serem lançadas, deve ser possível editar como Consultor, porém ao ser marcado algum dos campos (Escopo Fechado, Faturável, Lançado, Aprovado) já não deve mais ser possível alterar;
12. Os usuários com os níveis correspondentes devem poder marcar os campos mencionados no item 11. sendo o nível ADMINISTRADOR responsável pelo APROVADO;
13. Exibição na tela do timesheet os campos VALOR e GERENTE DE PROJETO conforme abaixo:
    - CLIENTE é Obrigatório ter ambos cadastrador, o VALOR e o GP vinculado;
    - ATIVIDADE e PROJETO é OPICIONAL esse cadastro;
    - A prioridade é exibir as informações do campo ATIVIDADE;
    - Caso ATIVIDADE esteja vazio, deve mostrar então as informações do PROJETO;
    - E Caso PROJETO esteja também vazio, deve ser exibido o que está em CLIENTE;
14. RELATÓRIOS:
    - Exibição do total de Horas já lançadas dentro de cada atividade (total no mês + total geral);
    - Exibição em forma de DASHBOARD (resumo por mês);
15. Capacidade de exportar os relatórios em forma XLSX (Excel);
16. Responsividade para ver em telas menores e dispositivos móveis `(secundário)`;
17. Tema Claro e Tema Escuro `(secundário)`;
18. Informações precisam ser salvas quando lançar as horas, abaixo as informações que devem estar no Banco de Dados:
    ### Campos Disponíveis:
    - Horário Inicial;
    - Horário Final;
    - Vínculo com Usuários e com Atividades;
    - Ajuste;
    - Numero do Chamado `campo de texto livre`;
    - Escopo Fechado;
    - Faturável;
    - Lançado;
    - Aprovado;
    - Data de Criação;
    - Data de Edição;

---

## Telas

> AINDA SEM PRINTS, PORÉM DEVEM SER ADICIONADOS COM O SISTEMA PRONTO

1. Tela de Login
   - input de email corporativo (@prestativ.com.br);
   - input de senha;
   - link para esquecimento de senha, pode ser recuperada pelo email corporativo;
   - Logo da Prestativ
   - ![Tela de Login](/)
2. Tela de TimeSheet
   - Onde serão exibidos os dados de quase todas as tabelas;
   - Um botão abaixo onde é possível adicionar uma nova linha editável, e então inserir as horas que foram trabalhadas;
   - Botões à direita no final da linha, para deletar esses dados, esse pode sumir depois de um determinado período, e outro para editar, que irá sumir após o "check" de algum dos campos de aprovação
   - Conforme o usuário for digitando as informações o sistema vai facilitar, por exemplo:
     - Ao clicar e selecionar a DATA, já exibir ao lado o DIA DA SEMANA correspondente
     - Ao inserir as horas Iniciais e Finais, calcular automaticamente o total;
     - Ao selecionar o Cliente, carregar os Projetos desse cliente;
     - Ao selecionar o Projeto, carregar as Atividades deste Projeto;
     - As atividades/Projetos/Clientes que irão aparecer depende do nível do usuário, se for consultor por exemplo, exibir apenas os que estão disponíveis para esse lançar as horas, porém para administrador é para aparecer todos caso ele queira executar o lançamento;
     ### Campos Disponíveis:
     - Data (*¹ *²)
     - Dia da Semana (atualiza automaticamente)
     - Hora Inicial (\*¹ Combinando a Data com a Hora forma um Timestamp)
     - Hora Final (\*² Combinando a Data com a Hora forma um Timestamp)
     - Tempo Total (atualiza automaticamente)
     - Ajuste (pode ser ajustado por )
     - Tempo Total com Ajuste (Atualiza automaticamente a partir do total + ajuste)
     - Cliente
     - Projeto
     - Atividade
     - Consultor
     - Numero do Chamado (campo de texto livre)
     - Observações
     - Aprovado Gerente de Projetos (ou GP / BOOLEAN)
     - Escopo Fechado (BOOLEAN)
     - Faturável (BOOLEAN)
     - Aprovado (pelo administrador / BOOLEAN)
   - ![Tela Timesheet](/)
3. Tela de Usuários
   - Usuários normais não devem ser capazes de se cadastrar, através da tela de login por exemplo, é necessário logar com um usuário já existente com permissão de cadastro;
   - ![Tela de Usuários](/)
4. Tela de Clientes `(não precisa ser uma tela, pode ser incluso na DASHBOARD)`
   - Um Cliente pode ter vários Projetos vinculados a ele;
   - ![Tela de Clientes](/)
5. Tela de Projetos `(não precisa ser uma tela, pode ser incluso na DASHBOARD)`
   - Um Projeto pode ter várias Atividades vinculadas a ele
   - ![Tela de Projetos](/)
6. Tela de Atividades `(não precisa ser uma tela, pode ser incluso na DASHBOARD)`
   - Uma Atividade pode ter vários lançamentos de horas de vários consultores diferentes dentro dela;
   - ![Tela de Atividades](/)
7. Tela de Dashboard
   - Tela para visualizar o resumo de cada MÊS
   - Listagem de todos os clientes e visualização de todos os projetos vinculados a esse cliente;
   - Ao clicar em determinado projeto deve expandir e exibir as atividades vinculadas a esse projeto;
   - Ver total de horas acumuladas em um projeto (total de todas as atividades desse projeto);
   - ![Tela Dashboard](/)

---

## Níveis de Usuários

> Existem atualmente no sistema 4 níveis de Usuários, sendo eles:

1.  Administrador:
    - Consegue efetuar todas as operações no sistema;
    - Consegue visualizar todas as informações;
    - Aprovação das horas (ultimo campo de check "APROVADO")
    - Único Usuário capaz de visualizar Dashboard
2.  Consultores (colaboradores / funcionários):
    - Responsáveis por efetuar o lançamento de horas no timesheet;
    - Não visualizam todos os campos do timesheet;
    ***
    ### Campos Disponíveis:
            - Data
            - Dia da Semana
            - Hora Inicial
            - Hora Final
            - Tempo Total
            - Cliente
            - Projeto
            - Atividade
            - Consultor (sempre o seu próprio nome, campo já vem preenchido para o consultor)
            - Numero do Chamado (campo de texto livre)
            - Observações
3.  Operadores
    - Cadastrar e Editar Usuários;
    - Cadastrar e Editar Atividades;
    - Cadastrar e Editar Projetos;
    - Cadastrar e Editar Clientes;
    - Visualização desses dados;
4.  Gerente de Projetos (GP - responsável por aprovar os usuários e cadastro):
    - Cadastrar e Editar Atividades;
    - Cadastrar e Editar Projetos;
    - Cadastrar e Editar Clientes;
    - Visualiza Horas apenas dos seus Clientes, Projetos e Atividades;
    - Aprovação das horas (campo de check "APROVADO GP");

---

## Front-End

> Linguagens Utilizadas

1. React.JS;
2. Material UI;
3. TypeScript;
4. Axios;
5. React Dom;
6. React Router;
7. React Hook Form;
8. Sass;
9. Prettier;
10. Husky;
11. YARN;
12. Eslint;
13. Git E GitHub;

---

## Back-End

> Linguagens Utilizadas

1. Node.JS;
2. Mongo DB;
3. Mongoose;
4. Docker;
5. Express (node);
6. TypeScript;
7. BCRYPT;
8. JWT (JSON Web Token);
9. Nodemon;
10. ESLint;
11. Prettier;
12. Husky;
13. CookieParser;
14. DotENV;
15. YARN;
16. Git E GitHub;

---

## Histórico

1. Versões de teste executadas em DEZ/2022 - codigos reaproveitados e implementados;
2. Primeiro Protótipo entregue dia 12/01/2023 (data limite);
   - Estava com x coisas faltando e com x coisas funcionando;
3. Projeto foi finalizado e entregue dia 10/02/2023 (data limite);

---

## Futuro

- Caso esteja adicionando alguma funcionalidade no futuro, sinta-se à vontade para editar este documento e melhorá-lo, pelo bem da empresa, e dos próximos programadores que forem editar o código fonte do Timesheet.

---
