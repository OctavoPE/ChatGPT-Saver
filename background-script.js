/**
 * Code written by Jeanmarco Allain
 */

/**
 * Begins download sequence for given object url and filename.
 * @param {String} url url to the blob object
 * @param {String} filename name of the file to download
 */
function beginDownload(url,filename){
    function onStartedDownload(id) {
        console.log(`Started downloading: ${id}`);
    }     
    function onFailed(error) {
        console.log(`Download failed: ${error}`);
    }
    console.log("Downloading...");
    let downloading = browser.downloads.download({
        url : url,
        filename : filename,
        conflictAction : 'uniquify'
    });
    downloading.then(onStartedDownload, onFailed);
}

/**
 * Downloands conversation as HTML file.
 */
function downloadhtml(content){
    let arr = [];
    const style = `<style>
    html{font-family: Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;}
    body{background-color: #343541;}
    div{color: #ececf1;
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 20px;
    padding-left: 5em;
    padding-right: 5em;
    }
    .prompt{background-color:#343541;}
    .response{background-color:#444654;}
    </style>`;
    const header = '<!DOCTYPE html><html lang=\'en\'><head>' + style +'<title>Conversation</title></head><body>';
    arr.push(header);
    let i = 1;
    content.forEach(element => { 
        // Mod 0 is a response, else it's a user prompt.
        if(i % 2 == 0){
            let line = `<div class="response">${element}</div>`;
            arr.push(line);
        }
        else{
            let line = `<div class="prompt">${element}</div>`;
            arr.push(line);
        }
        i++;
    });

    const footer = '</body></html>';
    arr.push(footer);
    
    const blob = new Blob(arr, { type: "text/html" }); 
    beginDownload(URL.createObjectURL(blob),'conversation.html');
}

/**
 * Downloads conversation as text file.
 */
function downloadtext(content){   
    // We need to add a newline after each message (element).
    const conversationArray = content.flatMap(x => [x, "\r\n\r\n"]);
    const blob = new Blob(conversationArray, { type: "text/plain" }); 
    beginDownload(URL.createObjectURL(blob),'conversation.txt');
}

/**
 * Only background scripts have access to the entire WebExtension API, which is used to download files.
 * Therefore, we can establish a listener that runs from our content script to our background script.
 */
browser.runtime.onMessage.addListener((message) => {
    if (message.command === "download") {
        if (message.type === "html") {
            downloadhtml(message.content);
        }
        else {
            downloadtext(message.content);
        }     
    }
});