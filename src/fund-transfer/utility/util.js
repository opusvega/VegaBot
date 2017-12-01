async function payeeList(result){
  var fbResponse = {};
  fbResponse.attachment = {};
  fbResponse.attachment.payload = {};
  /*Facebook*/
  fbResponse.attachment.type = "template";
  fbResponse.attachment.payload.template_type = "generic";
  //fbResponse.attachment.payload.top_element_style = "compact";
  fbResponse.attachment.payload.elements = [];
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
    fbResponse.attachment.payload.elements.push(fbElementsObj);
  }
  return fbResponse;
}


exports.payeeList = payeeList;