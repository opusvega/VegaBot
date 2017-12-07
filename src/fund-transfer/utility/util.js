async function payeeList(result,returnJsonObj){
  for (var res in result){
    var fbElementsObj = {};
    let payeeName = result[res].payeename;
    let nickName = result[res].nickname;
    let bankName = result[res].bankname;
    let accountNumber = result[res].accountnumber;
    let routingNumber = result[res].routingnumber;
    let uid = result[res].uid;
    fbElementsObj.title = payeeName;
            fbElementsObj.subtitle = `Nickname : ${nickName}
BankName : ${bankName}
AccountNumber : ${accountNumber}
RoutingNumber : ${routingNumber}`;
    var button = {};
    button.title = "Proceed";
    button.type = "postback";                        
    button.payload = "UID " + parseInt(uid);  
    fbElementsObj.buttons = [];                    
    fbElementsObj.buttons.push(button);      
    returnJsonObj.messages[0].payload.facebook.attachment.payload.elements.push(fbElementsObj);
  }
  return returnJsonObj;
}


exports.payeeList = payeeList;