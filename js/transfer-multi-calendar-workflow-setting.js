chrome.runtime.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      if (document.getElementById("show-event-details-btn-hidden")) {
        document.getElementById("show-event-details-btn-hidden").onclick =
          function (event) {
            transferSetting();
          };
      }
      if (document.getElementById("is-default-account")) {
        document.getElementById("is-default-account").onclick = function (
          event
        ) {
          transferSetting(true);
        };
      }
    }
  }, 10);
});

const transferSetting = (isDefaultAccount) => {
  document.getElementById("page-title").innerText = "Redirecting ...";
  document.getElementById("show-event-details-btn").disabled = true;

  const inputVal = document.getElementById("multi-calendar-email-order").value;
  const order = isDefaultAccount ? "1" : inputVal;
  if (!isDefaultAccount && !order) {
    alert("Failed to register input. Please enter again.");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get("accountId");

  chrome.runtime.sendMessage(
    {
      action: "add-setting",
      payload: {
        settingKey: "promptMultiCalendarWorkflow",
        itemKey: accountId,
        itemValue: order,
      },
    },
    function (response) {
      let { err, data } = response;
      if (err) {
        alert("Failed to transfer you to the event details page.");
        document.getElementById("page-title").innerText = "Quick Check";
        document.getElementById("show-event-details-btn").disabled = false;
        return;
      }
      if (data) {
        const link = document.getElementById(
          "view-event-details-link-hidden"
        ).innerText;
        location.href = link;
      }
    }
  );
};

function isNumeric(num) {
  return !isNaN(num);
}
