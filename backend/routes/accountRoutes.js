const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../Schemas/AccountSchema");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});
router.post("/transfer",authMiddleware,async(req,res)=>{

const session= await mongoose.startSession();
session.startTransaction();
const [amount,to]=req.body;
if(to===req.userId){
  await session.abortTransaction();
  res.status(403).json({

    msg:"Cannot send funds to yourself"
  })
}
//find the from account
const fromaccount=await Account.findOne({
  userId:req.userId
}).session(session)
if(!fromaccount || amount<fromaccount.balance){
  await session.abortTransaction();
  res.send("Insufficient balance!")
}
const toaccount=await Account.findOne({
  userId:to
}).session(session)
if (!toaccount) {
  await session.abortTransaction();
  return res.status(400).json({
    message: "Invalid account",
  });
}
//start algo to transfer
fromaccount.findByIdAndUpdate(req.userId,{
  $inc:{balance:-amount}
}).session(session)
toaccount.findByIdAndUpdate(to,{
  $inc:{balance:amount}
}).session(session);
await session.commitTransaction()
res.send(
  "Transaction Successful"
)
}
)

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();//either all of this happens togetheror none of this happens i.e it roll backs
  //atomic transactions
  session.startTransaction();

  const { amount, to } = req.body;

  // Don't allow transfer to oneself
  if (to === req.userId) {
    await session.abortTransaction();
    return res.json({ message: "Cannot Transfer to yourself!" });
  }

  // Fetch the accounts within transaction
  const account = await Account.findOne({
    userId: req.userId,
  }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  // Fetch the accounts within transaction
  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);//execute the query within a session

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer within transaction
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  // Commit Transaction
  await session.commitTransaction();

  res.json({
    message: "Transfer successful",
  });
});

module.exports = router;