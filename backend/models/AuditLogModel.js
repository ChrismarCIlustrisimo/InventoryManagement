import mongoose from 'mongoose'; 

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now,},
  user: { type: String, required: true, },
  action: {type: String, required: true,},
  module: { type: String, required: true, },
  event: { type: String,  required: true, },
  previousValue: { type: mongoose.Schema.Types.Mixed, default: 'N/A', },
  updatedValue: { type: mongoose.Schema.Types.Mixed,  default: 'N/A', },
});

const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);

export default AuditLogModel;
