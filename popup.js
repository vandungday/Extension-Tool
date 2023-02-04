let urlCurrent;

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  urlCurrent = tabs[0].url;
  // use `url` here inside the callback because it's asynchronous!
});

const handleCLickBtn = async () => {
  let tabs = await chrome.tabs.query({
    // url: "https://eop.edu.vn/study/task/60273?id=dglNUUOw7FGFaIrG%2BbiKEBnQ%3D%3D",
    url: `${urlCurrent}`,
    status: "complete",
  });
  // alert(urlCurrent);
  if (!tabs) return;
  let targetTab = [...tabs].length > 0 ? tabs[0] : tabs;
  // Bắn dữ liệu từ trang index
  await chrome.scripting.executeScript({
    target: {
      tabId: targetTab.id,
    },
    func: async () => {
      const voca = document.querySelectorAll(".ditem > h4");
      const means = document.querySelectorAll(".ditem > p > b");
      const c = [...voca].map((item) => item.innerText);
      const d = [...means].map((item) => item.innerText);
      const result = c.map((item, index) => {
        return item + " : " + d[index] + "<br/>";
      });
      const kq = result.join("");
      const data = { kq, message: "get-user-data" };
      console.log(data);
      // 1. Send a message to the service worker requesting the user's data
      // 2. Got an asynchronous response with the data from the service worker
      let response = await chrome.runtime.sendMessage(data);
      if (response.message === "ok") {
        console.log("received message from background");
      }
    },
    args: [tabs],
  });
};
const passDataBtn = document.addEventListener("click", handleCLickBtn);
