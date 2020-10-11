import mongoose from 'mongoose';
//import URLSlugs from 'mongoose-url-slugs';

const Zombie = mongoose.Schema({
    name: { type: String, required: true },
    items: [Number],
    created_at: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Zombie', Zombie);
