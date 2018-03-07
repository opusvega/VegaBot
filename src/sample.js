const Client = require("node-rest-client").Client;
const client = new Client();
const hostUrl = "https://apisandbox.openbankproject.com/"
const mongoConnection = require("./fundTransfer/mongoDb/mongoConnection");
const log = console.log;
async function generateOpenBankToken(){

	try{
        let username = "mukeshj";
        let password = "Mukesh@123"
        log("inside generateOpenBankToken=======?>");
        let token;
        // let result = await mongoHandler.getUserDetails(sessionId);
        // let password = result.password;
        // let username = result.username;
        log("DirectLogin username = "+username+", password = "+password+", consumer_key = 0zexlchainswyghkpfvsk0jk3w2rica1s5yjv1rg");
        let args = {
            data : {},
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "DirectLogin username = "+username+", password = "+password+", consumer_key = 0zexlchainswyghkpfvsk0jk3w2rica1s5yjv1rg"
            }
        }
        return new Promise(function(resolve,reject){
            client.post(hostUrl+"my/logins/direct",args, async function (data, response){
                token = data.token;
                log(token);
               // await mongoHandler.updateToken(username, token);
                resolve(token);
            });
        }); 

    }catch(error){
        log(error);
    }
}

async function call(){
	let res = await generateOpenBankToken();
 	console.log("global;",res);	
}

call();