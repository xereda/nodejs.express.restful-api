"use strict";

// Objeto contendo as mensagens de erros do sistema.
module.exports = [
  { code: 1,  description: "Erro ao conectar ao banco de dados."},
  { code: 2,  description: "Não foi possível retonar a lista de usuários." },
  { code: 3,  description: "Não foi possível localizar o usuário." },
  { code: 4,  description: "Não foi possível criar o usuário." },
  { code: 5,  description: "Não foi possível atualizar o usuário." },
  { code: 6,  description: "Parâmetro identificador do usuário deve ser informado." },
  { code: 7,  description: "Campo aceita apenas valor lógico (%1)." },
  { code: 8,  description: "Campo (%1) é obrigatório." },
  { code: 9,  description: "O identificador informado para o campo 'createdById' não existe no coleção de usuários." },
  { code: 10, description: "Informe o identificador do usuário que está criando este documento." },
  { code: 11, description: "Informe o identificador do usuário que está atualizando este documento." },
  { code: 12, description: "O identificador informado para o campo 'updatedById' não existe no coleção de usuários." },
  { code: 13, description: "Campo (%1) é obrigatório para atualização." },
  { code: 14, description: "Rota não está prevista na API. Verifique se o path e o método http estão corretos." },
  { code: 15, description: "Erro no servidor." },
  { code: 16, description: "Senha inválida! Informe pelo menos 5 caracteres." },
  { code: 17, description: "Informe pelo menos 3 caracteres para o campo (%1)." },

];
