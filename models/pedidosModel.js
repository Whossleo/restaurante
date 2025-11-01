const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
  numeroPedido: {
    type: Number
  },
  mesa: { 
    type: Schema.Types.ObjectId, 
    ref: 'Mesa', 
    required: true 
  },
  platos: [
    {
      producto: { type: Schema.Types.ObjectId, ref: 'Platos', required: true },
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      cantidad: { type: Number, required: true },
      adicionales: { type: String }
    }
  ],
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente',
    required: true
  },
  fechaPedido: { 
    type: Date, 
    default: Date.now 
  }
});

pedidoSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const ultimo = await this.constructor.findOne({}, {}, { sort: { numeroPedido: -1 } });
      this.numeroPedido = ultimo ? ultimo.numeroPedido + 1 : 1;
    } catch (err) {
      console.error('Error al generar número de pedido:', err);
    }
  }
  next();
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
