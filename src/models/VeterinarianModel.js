const { Schema, model } = require('mongoose');

const VeterinarianSchema = new Schema({
  nombre: String,
  especialidad: String,
  horario: String,
  imagen: String
});
  // Otros campos según sea necesario

//turnos: [{
//  type: Schema.Types.ObjectId, //? asi o "moongoose.Schema.Types.ObjectId" ?
//  ref: 'Turno'
//}]

const Profesional = model('Veterinarian', VeterinarianSchema);
