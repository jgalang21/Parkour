const { ObjectId, Decimal128 } = require('mongodb');
const mongoose = require('mongoose');

const ListingSchema = mongoose.Schema({

    hostId : {
        type : ObjectId,
        required : 'You must enter this field!'
    },
    address: {
        street: {
            type: String,
            required: 'You must enter this field!'
        },
        city: {
            type: String,
            required: 'You must enter this field!'
        },

        state: {
            type: String,
            required: 'You must enter this field!'
        },
        zipCode: {
            type: String, 
            required: 'You must enter this field!'
        }
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        }

    },

    numSpots: {
        type: Number,
        required: 'You must enter this field!'
    },
    price: {
        type: Decimal128,
        required: 'You must enter this field!'
    },
    startDate: {
        type: Date,
        required: 'You must enter this field!'
    },
    endDate: {
        type: Date,
        required: 'You must enter this field!'
    },
    renters: {
        type: Array,
        required: false
    }
});

ListingSchema.index({location: '2dsphere'});

module.exports = mongoose.model('Listing', ListingSchema);