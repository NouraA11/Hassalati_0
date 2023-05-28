import Category from "../models/category";
import Transaction from "../models/transaction";

export const createCategory = async (req, res) => {
    try {
        const category = await new Category({...req.body, user: req.user._id}).save();
        console.log('created category..>', category)
      return res.json(category);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const categories = async (req, res) => {
    try {
      const userID = req.query.userID;
      const allCategories = await Category.find({user: userID}).sort({createdAt: -1});
      return res.json(allCategories);
    } catch (err) {
      console.log(err);
    }
  };

  export const getCategory = async (req, res) => {
    try {
      const categoryID = req.query.categoryID;
      const category = await Category.findOne({_id: categoryID})
      return res.json(category);
    } catch (err) {
      console.log(err);
    }
  };

  export const editCategory = async (req, res) => {
    try {
      const {name, icon, type, typeIndex, id} = req.body;
      const category = await Category.findByIdAndUpdate(id, {
        name: name,
        icon: icon,
        type: type,
        typeIndex: typeIndex,
      }, {
        new: true
      });
      return res.json(category);
    } catch (err) {
      console.log(err);
    }
  };

  export const removeCategory = async (req, res) => {
    try {
      await Transaction.deleteMany({category : req.params.categoryID});
      const deleted = await Category.findByIdAndRemove(req.params.categoryID);
      return res.json(deleted);
    } catch (err) {
      console.log(err);
    }
  };