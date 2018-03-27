const log = console.log;
const mongoConnection = require("./mongoConnection");

module.exports.isUserValid = async (req) =>{
    try{
            log("isUserValid");
            let db = await mongoConnection.getDb();
            let userName = req.body.result.parameters.username;
            let result = await db.collection("users").find({username : userName}).toArray();
            //db.close();
            if(result.length != 0){
                return true;
            }
            else{
                return false;
            }

    }
    catch(error){
        log(error);
    }
}

let isUserLogedIn = async (req) => {
    try{
        let db = await mongoConnection.getDb();
        let sessionId = req.body.sessionId;
        log(sessionId);
        let result = await db.collection("users").findOne({sessionId : sessionId});
        //db.close();
        log(result);
        if(result){
            return result;
        }
        else{
            log("inside else");
            return true;
        }    
    }
    catch(error){
        log(error);
    }
    
}

module.exports.userLogin = async (req) => {
    try{
        log("Inside isUserLogedIn")
        let result1 = await isUserLogedIn(req);
        log(result1);
        if(result1 === true){
            let db = await mongoConnection.getDb();
            let sessionId = req.body.sessionId;
            let username = req.body.result.parameters.username;
            let result = await db.collection("users").updateOne({username : username},{$set : {sessionId : sessionId,sessionStartTime : new Date()}});
            //db.close();
        }

    }
    catch(error){
        log(error);
    }
}

module.exports.userLogout = async (req) => {
    let db = await mongoConnection.getDb();
    let sessionId = req.body.sessionId;
    log(" Logout SessId: ",sessionId)
    let result = await db.collection("users").updateOne({sessionId : sessionId},{$set : {sessionId : null, token : null}, $unset:{sessionSummary:1}});
    
}

module.exports.getUsername = async (userId) => {
    let db = await mongoConnection.getDb();
    let user = await db.collection("users").findOne({username : userId});
    return user.name;
}

module.exports.getUserDetails = async (sessionId) => {
    try{
        let db = await mongoConnection.getDb();
        log("session inside getUserDetails",sessionId);
        let result = await db.collection("users").findOne({sessionId : sessionId});
        //db.close();
        log("InsidegetUserDetails ",result);
        return result;
    }catch(error){
        log(error);
    }
    
}

module.exports.updateToken = async (username, token) => {
    let db = await mongoConnection.getDb();
    let result = await db.collection("users").updateOne({username : username},{$set : {token : token}});
    //db.close();
}
module.exports.updateCardStatus = async (sessionId, cardType, cardAction, cardNumber) => {
    let status = (cardAction == "block") ? true:false;
    log("updateCardStatus==>status=>",status);
    let db = await mongoConnection.getDb();
    // let result = await db.collection("users").updateOne(
    //     { "sessionId": sessionId, "bankDetails.0.cards.type" : cardType,"bankDetails.0.cards.id" : cardNumber }, 
    //     { "$set": { "bankDetails.0.cards.$.isBlocked": status } 
    // });
   let result = await db.collection("users").updateOne(
        { "sessionId": sessionId, "bankDetails.0.cards":{$elemMatch : {"type": cardType, "id" : cardNumber}}}, 
        { "$set": { "bankDetails.0.cards.$.isBlocked": status } 
    });
 }

module.exports.updateCardSessionSummary = async (sessionId, cardType, cardAction, cardNumber) => {
    let db = await mongoConnection.getDb();
    let result = await db.collection("users").updateOne(
        {"sessionId" : sessionId, "bankDetails.0.cards":{$elemMatch : {"type": cardType, "id" : cardNumber}}},
        {$push:
            {"sessionSummary":  
                {
                   "intent": "card",
                    "type" : cardType,
                    "action" : cardAction,
                    "id" : cardNumber
                }
            }
        }
    );
}

module.exports.updateTransactionSessionSummary = async (sessionId, userName, bankName, bankAccount, currency, amount) => {
    let db = await mongoConnection.getDb();
    let result = await db.collection("users").updateOne(
        {"sessionId" : sessionId},
        {$push:
            {"sessionSummary":  
                {
                   "intent": "transaction",
                    "to" : userName,
                    "bank" : bankName,
                    "account" : bankAccount,
                    "currency" : currency,
                    "amount" : amount
                }
            }
        }
    );
}
module.exports.isUserLogedIn = isUserLogedIn