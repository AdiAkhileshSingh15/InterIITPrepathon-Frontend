import { Schema, model, models } from 'mongoose';

const FlareDataSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  result: {
    type: [[String]],
    required: [true, 'Detected flare result is required!'],
  },
  lcData: {
    type: [Object],
    required: [true, 'Flare data is required!'],
  }
});

const FlareData = models.FlareData || model('FlareData', FlareDataSchema);

export default FlareData;
