// background.js
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message.message === "get-user-data") {
    sendResponse({ message: "ok" });
    // Automatically parse data to google sign-up DOM
    let tabs = await chrome.tabs.query({
      url: `https://quizlet.com/create-set`,
      // url: `https://quizlet.com/723330318/autosaved`,
      status: "complete",
    });
    let targetTab = [...tabs].length > 0 ? tabs[0] : tabs;
    if (!targetTab) {
      console.log("No tab found");
      return;
    }
    await chrome.scripting.executeScript({
      target: {
        tabId: targetTab.id,
      },
      func: (message) => {
        let result = document.querySelector(".ImportTerms-textarea");
        let check = document.querySelector(".ImportTerms-preview");
        check.style.display = "block";
        let inputAdd = document.querySelectorAll(".UIInput-input")[0];
        let inputDot = document.querySelectorAll(".UIInput-input")[1];
        result.value = message.kq;
        inputAdd.value = "+";
        inputDot.value = "_";
        console.log(message.kq);
      },
      args: [message],
    });
  }
});
