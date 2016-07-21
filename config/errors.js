"use strict";

// Objeto contendo as mensagens de erros do sistema.
module.exports = [
  { code: 1,  description: "Erro ao conectar ao banco de dados."},
  { code: 2,  description: "Não foi possível retonar a lista de documentos." },
  { code: 3,  description: "Não foi possível localizar o documento." },
  { code: 4,  description: "Não foi possível criar o documento." },
  { code: 5,  description: "Não foi possível atualizar o documento." },
  { code: 6,  description: "Parâmetro identificador do documento deve ser informado." },
  { code: 7,  description: "Campo aceita apenas valor lógico (%1)." },
  { code: 8,  description: "Campo (%1) é obrigatório." },
  { code: 9,  description: "O identificador informado para o campo 'createdById' não existe na coleção de usuários." },
  { code: 10, description: "Informe o identificador do usuário que está criando este documento." },
  { code: 11, description: "Informe o identificador do usuário que está atualizando este documento." },
  { code: 12, description: "O identificador informado para o campo 'updatedById' não existe no coleção de usuários." },
  { code: 13, description: "Campo (%1) é obrigatório para atualização." },
  { code: 14, description: "Rota não está prevista na API. Verifique se o path e o método http estão corretos." },
  { code: 15, description: "Erro no servidor." },
  { code: 16, description: "Senha inválida! Informe pelo menos 5 caracteres." },
  { code: 17, description: "Informe pelo menos (%2) caracteres para o campo (%1)." },
  { code: 18, description: "Informe o e-mail no formato correto." },
  { code: 19, description: "Informe corretamente as coordenadas geográficas." },
  { code: 20, description: "Informe um valor entre %1 e %2 para o campo %3." },
  { code: 21, description: "O campo de geolocalização (%1) requer uma array com dois elementos do tipo float. Sendo que o primeiro é referente a longitude e seu valor deve estar entre -180 à 180. O segundo elemento é a latiudade e deve estar entre -85 à 85." },

];
