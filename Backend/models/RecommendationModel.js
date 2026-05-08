import { Schema, model, Types } from 'mongoose'

const replySchema = new Schema({
	user: {
		type: Types.ObjectId,
		ref: 'User',
		required: [true, 'reply user ID is required']
	},
	message: {
		type: String,
		required: [true, 'reply message is required'],
		trim: true,
		maxlength: [300, 'reply message cannot exceed 300 characters']
	}
}, {
	timestamps: true,
	versionKey: false
})

const recommendationSchema = new Schema({
	user: {
		type: Types.ObjectId,
		ref: 'User',
		required: [true, 'user ID is required']
	},
	message: {
		type: String,
		required: [true, 'recommendation message is required'],
		trim: true,
		maxlength: [500, 'recommendation message cannot exceed 500 characters']
	},
	likes: [{
		type: Types.ObjectId,
		ref: 'User'
	}],
	views: {
		type: Number,
		default: 0
	},
	viewedBy: [{
		type: Types.ObjectId,
		ref: 'User'
	}],
	replies: [{
		type: replySchema,
		default: []
	}],
	isActive: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true,
	versionKey: false,
	strict: 'throw'
})

export const RecommendationModel = model('Recommendation', recommendationSchema)