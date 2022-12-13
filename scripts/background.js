chrome.runtime.onMessage.addListener(async (req) => {
  console.log('接收了来自 content.js的消息', req);
  chrome.storage.sync.set({ color: 'red' });
  const color = await chrome.storage.sync.get('color');
  console.log(color, 111)
})


chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function (msg) {
    if (msg.joke === "Knock knock")
      port.postMessage({ question: "Who's there?" });
    else if (msg.answer === "Madame")
      port.postMessage({ question: "Madame who?" });
    else if (msg.answer === "Madame... Bovary")
      port.postMessage({ question: "I don't get it." });
  });
});