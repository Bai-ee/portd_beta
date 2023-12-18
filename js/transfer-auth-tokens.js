chrome.runtime.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      transferToken();
      clearInterval(readyStateCheckInterval);
    }
  }, 10);
});

const transferToken = () => {
  const accountInfo = localStorage.getItem("zoomiesAccountInfo");

  if (accountInfo) {
    chrome.runtime.sendMessage(
      {
        action: "save-new-account",
        payload: JSON.parse(accountInfo),
      },
      function (response) {
        let { err, data } = response;
        if (err) {
          // alert("Failed to link account.");
          chrome.runtime.sendMessage({
            action: "close-callback-tab",
          });
          return;
        }
        if (data) {
          localStorage.removeItem("zoomiesAccountInfo");

          // alert("Account linked succesfully. You may return to the extension.");
          // chrome.runtime.sendMessage({
          //   action: "close-callback-tab",
          // });
        }
      }
    );
  } else {
    // alert("Failed to link account.");
  }
};
