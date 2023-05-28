import Transaction from "../models/transaction";

export const createTransaction = async (req, res) => {
    try {
        const transaction = await new Transaction({...req.body, user: req.user._id}).save();
        console.log('created transaction..>', transaction)
      return res.json(transaction);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const transactions = async (req, res) => {
    try {
      const userID = req.query.userID;
      //const type = req.query.t_type;
      const allTransactions = await Transaction.find({user: userID /*, type: type*/}).sort({createdAt: -1});
      return res.json(allTransactions);
    } catch (err) {
      console.log(err);
    }
  };

  export const editTransaction = async (req, res) => {
    try {
      const {value, type, typeIndex, date, time, category, id} = req.body;
      const transaction = await Transaction.findByIdAndUpdate(id, {
        value: value,
        type: type,
        typeIndex: typeIndex,
        date: date,
        time: time,
        category: category,
      }, {
        new: true
      });
      return res.json(transaction);
    } catch (err) {
      console.log(err);
    }
  };

  export const removeTransaction = async (req, res) => {
    try {
      const deleted = await Transaction.findByIdAndRemove(req.params.transactionID);
      return res.json(deleted);
    } catch (err) {
      console.log(err);
    }
  };