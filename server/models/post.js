const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    image: { 
        url: {
            type: String,
            default: ' '
        },
        public_id: {
            type: String,
            default: Date.now
        }
    },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        default: null, ref: 'User' 
    },
}, 
{ 
    timestamps: true
 });

module.exports = mongoose.model('Post', postSchema);