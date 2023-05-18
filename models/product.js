const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: {
        values: ["Men", "Women", "Kids"],
      message:
      "Please select category ONLY from - Man, Women, or Kids",
    },
  },

  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
    required: true,
  },
      
    
  productName : String,

  stock: {
      type: Number,
      required: true,
      
  },

  price: {
    type: Number,
    required: [true, "please mention the Selling Price of the Product!"],
    // minlength: [, ""],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  description: {
    type: String,
    required: [true, "please provide product description"],
  },


  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  

  createdAt: {
        type: Date,
        default: Date.now,
      },

  
  //this field was updated in order videos later
//   stock: {
//     type: Number,
//     required: [true, "Plese"],
//   },
//   brand: {
//     type: String,
//     required: [true, "please add a brand for clothing"],
//   },
//   ratings: {
//     type: Number,
//     default: 0,
//   },
//   numberOfReviews: {
//     type: Number,
//     default: 0,
//   },
//   reviews: [
//     {
//       user: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true,
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       rating: {
//         type: Number,
//         required: true,
//       },
//       comment: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
});

module.exports = mongoose.model("Product", productSchema);