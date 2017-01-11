schedule: {
  #  _id,
  *< scheduleDefinition: _id,
  *< life: _id,
  *< specialty: _id,
  *< workplace: _id,
  *< provider: _id,
  *< healthInsurance: _id,
  = parentSchedule: _id, // agenda de origem de transferência
     date: Date, // data da agenda
     duration: Hour, // hora da agenda - formato HHMM
  *  autoApproved: Boolean, // define se a agenda foi aprovada automaticamente
     lifeConfirmationDate: Date, // data da confirmacao pelo usuario do app
     originCancellation: Domain: [ 'app', 'portal' ], // define se o cancelamento foi efetuado pela clínica ou pelo usuario do app
  *  status: { Domain: [ 'opened', 'canceled', 'approved', // define o status da agenda
                        'transferred', 'missed', 'started',
                        'confirmedByLife', 'confirmed',
                        'checkIn', 'closed', 'reopened' ] },
     lifeSuggestions: [{ // sugestoes de dias da semana e peioodos do dia enviadas pelo usuario do app numa solicitacao de agenda
        *  weekDays: [ { Domain: [ "IND", "SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM" ] } ],
           indifferent: Boolean,
           morning: Boolean,
           earlyMorning: Boolean,
           lateMorning: Boolean,
           afternoon: Boolean,
           earlyAfternoon: Boolean,
           lateAfternoon: Boolean,
           evening: Boolean,
        *< createdById: _id,
        *@ createdAt: Date(now),
        *< updatedById: _id,
        *@ updatedAt: Date(now)
     }],
     canceled: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     approved: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     transferred: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     missed: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     started: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     confirmed: { // data da confirmacao do usuario
         date: Date,
       < user: _id,
         note: String(200)
     },
     checkIn: { // data da chegada do paciente no local de atendimento, normalmente confirmada pela recepcionista
         date: Date,
       < user: _id,
         note: String(200)
     },
     closed: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     reopened: {
         date: Date,
       < user: _id,
         note: String(200)
     },
     providerEvaluation: { // avaliacao do prestador pelo usuario do app
       score: { Domain: [ 1, 2, 3, 4, 5 ] },
       date: Date,
       note: String(500)
     },
     workplaceEvaluation: { // avaliacao do local de atendimento pelo usuario do app
       score: { Domain: [ 1, 2, 3, 4, 5 ] },
       date: Date,
       note: String(500)
     },
     *< createdById: _id,
     *@ createdAt: Date(now),
     *< updatedById: _id,
     *@ updatedAt: Date(now)
};

user: {
  #  _id,
  *  name: String,
  *! email: String,
  *  password: String,
  *  admin: Boolean,
  *  active: Boolean,
  *= createdById: _id,
  *@ createdAt: Date(now),
  *= updatedById: _id,
  *@ updatedAt: Date(now)
};
