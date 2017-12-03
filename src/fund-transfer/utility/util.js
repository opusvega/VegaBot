async function payeeList(result,returnJsonObj){
  for (var res in result){
    var fbElementsObj = {};
    const payeeName = result[res].payeename;
    const nickName = result[res].nickname;
    const bankName = result[res].bankname;
    const accountNumber = result[res].accountnumber;
    const routingNumber = result[res].routingnumber;
    const uid = result[res].uid;
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