module.exports = {
    attributes: {
        tipo: {
            type: 'string', 
            required: true, 
            unique: true
        },
        capacidad: {
            type: 'number'
        }
    }
};