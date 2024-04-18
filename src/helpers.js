const QUESTION_TYPES = {
    MULT_CHOICE: { id: 'MULT_CHOICE', label: "Opción Múltiple"},
    FILLING: { id: 'FILLING', label: "Rellenar"},
}

const STATEMENT_TYPES = {
    TEXT: {id: 'TEXT', label: "Campo de Texto"},
    FILL: {id: 'FILL', label: "Campo de Relleno"},
    SELECT: {id: 'SELECT', label: "Menú de Selección"},
}


module.exports = {
    QUESTION_TYPES,
    STATEMENT_TYPES
}