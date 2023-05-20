/**
 * Code written by Jeanmarco Allain
 */

/**
 * Global shield, to prevent the script from running more than once.
 */
(function () {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * Parses HTML and returns the conversation as an array of strings.
     * @returns the conversation as an array of strings.
     */
    function GetConversation(){

        /**
         * Parses div of provided XPATH and returns the text content.
         * @param {string} xpath XPATH of the div to parse.
         * @returns text content of the div.
         */
        function parseDiv(xpath){
            let text = "";
            const result = document.evaluate(xpath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                const targetElement = result.singleNodeValue;
                text = targetElement.textContent;
            }
            return text;
        }

        const arr = [];

        try{
            console.log("Getting convo:");
            let convoOngoing = true;
            let i = 1;
            while(convoOngoing){
                // if mod 0, then it's a response, else it's a user prompt.
                if(i % 2 == 0){
                    let xpathExpression = "./div[1]/div[2]/div[2]/div/main/div[2]/div/div/div/div[" + i + "]/div/div[2]/div[1]/div";
                    let thisLine = parseDiv(xpathExpression);
                    console.log(`Current line: ${thisLine}`);
                    if(thisLine != ""){
                        arr.push(thisLine.replace('This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area.',''));
                    }
                    else{
                        convoOngoing = false;
                    }
                }
                else{
                    let xpathExpression = "./div[1]/div[2]/div[2]/div/main/div[2]/div/div/div/div[" + i + "]/div/div[2]/div[1]/div";
                    let thisLine = parseDiv(xpathExpression);
                    console.log(`Current line: ${thisLine}`);
                    if(thisLine != ""){
                        arr.push(thisLine.replace('This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area.',''));
                    }
                    else{
                        convoOngoing = false;
                    }
                }
                i++;
            }
        }
        catch(e){
            console.log("Conversation ended.");
        }

        console.log(`Done. Arr is ${arr}`);
        return arr;
    }

    /**
     * Checks if the current page is a chat.
     * @returns true if the current page is a chat, false otherwise.
     */
    function isChat(){
        let docURL = document.URL;
        let firstMsg = null;
        if(docURL.includes("chat.openai")){
            const Ele = function getElementByXpath(path) {
                return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }
            firstMsg = Ele("/html/body/div[1]/div[2]/div[2]/div/main/div[2]/div/div/div/div[1]/div/div[2]/div[1]/div");
            if(firstMsg != null){
                return true;
            }
        }
        return false;
    }
    /**
     * If the current page is a chat, process the request by sending a message to background-script.js.
     * We must do this because this content script does not have access to the entire WebExtension API.
     * @param {*} req type of save the user has specified.
     */
    function processRequest(req){
        console.log("Running...");
        if(isChat()){
            console.log("Chat detected");
            console.log(`Type: ${req}`);
            const thisConvo = GetConversation();
            if(req == "html"){
                browser.runtime.sendMessage({command: "download", type: "html", content: thisConvo});
            }
            else if(req == "text"){
                browser.runtime.sendMessage({command: "download", type: "text", content: thisConvo});
            }
        }
        else{
            console.log("Not a chat");
        }
    }
    /**
     * Receives message from popup\page.js and processes it.
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "save") {
          processRequest(message.type);
        }
    });
})();