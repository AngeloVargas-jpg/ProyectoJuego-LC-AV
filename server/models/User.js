import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true // se guarda ya encriptada con bcrypt, nunca en texto plano
  },
  victorias: {
    type: Number,
    default: 0
  },
  derrotas: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;