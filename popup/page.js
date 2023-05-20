/**
 * Code written by Jeanmarco Allain
 */

/**  
 * When pop up is pressed, execute save.js script.
 * then, load the event listeners for the buttons.
 * When our buttons are pressed, send a message to save.js 
 */
browser.tabs.executeScript({file: "/save.js"}).then(()=>{

    document.getElementById("html-choice").addEventListener("click", (event) => {   
        /**
         * Send a message to save.js telling it that the user wants to save in HTML.
         */
        browser.tabs.query({active: true, currentWindow: true})
        .then((tabs)=>{
            browser.tabs.sendMessage(tabs[0].id, {
                command: "save",
                type: "html"
            });
        });
    });
    
    document.getElementById("text-choice").addEventListener("click", (event) => {
        /**
         * Send a message to save.js telling it that the user wants to save in text.
         */
        browser.tabs.query({active: true, currentWindow: true})
        .then((tabs)=>{
            browser.tabs.sendMessage(tabs[0].id, {
                command: "save",
                type: "text"
            });
        });
    });
    
    /**
     * Header button opens the github page.
     */
    document.getElementById("Header").addEventListener("click", (event) => {
        const chosenPage = `https://github.com/OctavoPE`;
        browser.tabs.create({
            url: chosenPage,
        });
    });
});