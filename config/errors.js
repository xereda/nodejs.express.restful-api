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
  { code: 22, description: "Informe uma das opções (%1) para o campo (%2)." },
  { code: 23, description: "O campo (%1) deve estrar entre %2 e %3 caracteres." },
  { code: 24, description: "O campo (%1) deve ser igual ou maior que %2 caracteres." },
  { code: 25, description: "O campo (%1) deve ser igual ou menor que %2 caracteres." },
  { code: 26, description: "O campo (%1) deve ter %2 caracteres exatos." },
  { code: 27, description: "Informe um CPF válido para o campo (%1)." },
  { code: 28, description: "Informe um CNPJ válido para o campo (%1)." },
  { code: 29, description: "Informe o identificador do usuário que está criando este sub documento." },
  { code: 30, description: "Informe o identificador do usuário que está atualizando este sub documento." },
  { code: 31, description: "O campo %1 não é referente a um sub documento na collection %2." },
  { code: 32, description: "Sub documento já está vinculado ao documento principal" },
  { code: 33, description: "Sub documento não existe na collection %1" },
  { code: 34, description: "%1 não é um sub documento da collection %2 ou a propriedade 'subDoc' (Array) não está definida em seu esquema." },
  { code: 35, description: "Não foram informados campos para atualização do sub documento." },
  { code: 36, description: "O valor informado no campo '%1' não é um documento na collection '%2." },
  { code: 37, description: "O sub documento não pode ter seu índice duplicado." },
  { code: 38, description: "O sub documento '%1' deve ser tratado em seu controle individual na API." },
  { code: 39, description: "Informe o campo '%1' no formato correto (HH:MM)." },
  { code: 40, description: "O valor informado em '%1' não pode ser igual ou maior que o valor informado em '%2'." },
  { code: 41, description: "A data informada em '%1' não pode ser igual ou maior que a data informada em '%2'." },
  { code: 42, description: "A data informada em '%1' deve ser maior ou igual a data atual." },
  { code: 43, description: "Esse documento não pode ser excluído pois está relacionado em outros documentos do sistema. Segue lista de dependentes: %1" },

];
