const mongoose = require("mongoose");

const Member = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      trim: true,
      minlength: [4, "Username must be at least 4 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    middleName: {
      type: String,
      required: [true, "middlename is required"],
      trim: true,
      minlength: [4, "middlename must be at least 4 characters long"],
      maxlength: [30, "middlename cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      required: [true, "lastname is required"],
      trim: true,
      minlength: [4, "lastname must be at least 4 characters long"],
      maxlength: [30, "lastname cannot exceed 30 characters"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: [true, "phone must be unique"],
      trim: true,
      minlength: [7, "phone must be at least 4 characters long"],
      maxlength: [10, "phone cannot exceed 10 characters"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
      trim: true,
      minlength: [4, "address must be at least 4 characters long"],
      maxlength: [30, "address cannot exceed 30 characters"],
    },
    middleScale: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: [true, "the shift is required"],
    },
    deletedAt: {
      type: mongoose.Schema.Types.Date,
      default: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "the gender is required"],
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const autoPopulateCreatedBy = function (next) {
  this.populate("createdBy"); // Populate the `createdBy` field
  next();
};

// Apply middleware for all relevant query operations
Member.pre(/^find/, autoPopulateCreatedBy); // Populate for `find` and `findOne`
Member.pre("findOneAndUpdate", autoPopulateCreatedBy); // Populate for `findOneAndUpdate`
Member.pre("findOneAndDelete", autoPopulateCreatedBy); // Populate for `findOneAndDelete`
Member.pre("findOneAndRemove", autoPopulateCreatedBy); // Populate for `findOneAndRemove`
// Middleware to handle soft delete
const handleSoftDelete = async function (next) {
  // Instead of deleting, update `deletedAt` to `false`
  const filter = this.getFilter(); // Get the query filter
  const update = { deletedAt: Date.now() };

  // Update the `deletedAt` field for the matched document(s)
  await this.model.updateMany(filter, update);

  // Prevent the actual delete operation
  next(
    new Error(
      "Soft delete operation completed. Document(s) are marked as inactive."
    )
  );
};

// Apply `pre` middleware for delete operations
Member.pre("findOneAndDelete", handleSoftDelete);
Member.pre("findByIdAndDelete", handleSoftDelete);
Member.pre("deleteMany", handleSoftDelete);

// Static method for finding all active documents
Member.statics.findActive = async function (filter = {}) {
  return this.find({ deletedAt: null, ...filter });
};

// Static method for finding one active document
Member.statics.findOneActive = async function (filter = {}) {
  return this.findOne({ deletedAt: null, ...filter });
};

// Static method for updating one active document
Member.statics.updateOneActive = async function (
  filter = {},
  update = {},
  options = {}
) {
  return this.updateOne({ deletedAt: null, ...filter }, update, options);
};

// Static method for updating multiple active documents
Member.statics.updateManyActive = async function (
  filter = {},
  update = {},
  options = {}
) {
  return this.updateMany({ deletedAt: null, ...filter }, update, options);
};

// Static method for deleting one active document (soft delete)
Member.statics.deleteOneActive = async function (filter = {}) {
  return this.updateOne({ deletedAt: null, ...filter }, { deletedAt: false });
};

// Static method for deleting multiple active documents (soft delete)
Member.statics.deleteManyActive = async function (filter = {}) {
  return this.updateMany({ deletedAt: null, ...filter }, { deletedAt: false });
};

// Static method for creating a document
Member.statics.createActive = async function (data) {
  return this.create({ deletedAt: null, ...data });
};

module.exports = mongoose.model("Member", Member);