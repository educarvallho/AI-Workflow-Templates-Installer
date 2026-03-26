'use strict';

module.exports = `Tech Spec: [Nome do Projeto/Módulo]
1. Visão Geral
[Resumo de 1-2 parágrafos: O que esse código faz? É um serviço legado, um BFF ou uma lib compartilhada? Qual o problema de negócio principal que resolve?]

2. Stack Tecnológico
Core: [Linguagem/Versão] + [Framework/Versão]
Build/Package: [Ferramenta] (ex: Maven, NPM, Gradle)
Banco de Dados: [Tech] (ex: Postgres, Mongo, Redis)
Interface: [Tech] (ex: REST, gRPC, GraphQL)
Dependências Chave: [Listar apenas as críticas, ex: Resilience4j, BullMQ]
3. Arquitetura e Padrões
[Mapeie os padrões encontrados. Seja binário: É X ou Y?]

3.1. Padrões Predominantes
Módulo/Diretório Padrão Arquitetural Notas
src/main/java/br/com/x/legacy Layered (MVC) Controller->Service->Repository (Gordo)
src/core Clean Architecture Isolamento total de domínio
src/modules/payment NestJS Modules Padrão Controller/Service/Provider
3.2. Engines e Abstrações Core
[Liste frameworks proprietários ou lógicas complexas centrais "não-padrão"]

[Nome da Engine]: [Como funciona? ex: Chain of Responsibility via DB]
[Nome da Abstração]: [Objetivo e onde é usada]
4. Design de Código e Convenções
4.1. Nomenclatura
DTOs: [Sufixo/Padrão] (ex: *Dto, *Request, *Vm)
Implementações: [Padrão] (ex: IUser vs UserImpl)
Testes: [Sufixo] (ex: *Test, *Spec)
4.2. Tratamento de Erros
[Como erros são propagados? Exceptions (Java), Result Monads, Global Filters?]
[Padrão de resposta de erro da API]
5. Integrações Externas
[Liste APENAS dependências externas ao codebase]

[Sistema X]: [Objetivo] (ex: Processamento de pgtos) - [Protocolo]
[Sistema Y]: [Objetivo] (ex: Envio de SMS) - [Protocolo]
6. Pontos Críticos ("Gotchas")
[O que um desenvolvedor novo precisa saber para não quebrar tudo?]

7. Mapa de Navegação
[Onde encontro as coisas?]

Regras de Negócio: [Caminho]
Pontos de Entrada (Controllers/Consumers): [Caminho]
Configuração de Infra: [Caminho]
`;
