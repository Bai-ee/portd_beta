chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(
    tabs[0].id,
    { method: "enableFeature" },
    function (response) {
      // // console.log("Tab Response:", response);
    }
  );
});

window.close();
