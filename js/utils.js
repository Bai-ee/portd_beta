// This file contains methods that are to be used in different js files
// it is imported in notes.html

function popupToBackground(action, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action,
        payload,
      },
      async (response) => {
        let { err, data } = response;
        if (err && !err.customErrorCode) {
          return reject(err);
        }

        try {
          await errorManagement(err);
        } catch (err) {
          return resolve(data);
        }

        return resolve(data);
      }
    );
  });
}

String.prototype.hashCode = function () {
  return uuidv4();
};

const injectStyles = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

const injectScripts = (id, src) => {
  if (document.getElementById(id)) return;
  // document.getElementById("id").remove();
  const script = document.createElement("script");
  script.id = id;
  script.type = "text/javascript";
  script.src = src;
  document.body.appendChild(script);
};

// Function to insert HTML content into target section
const insertHTMLIntoTargetSection = (id, html) => {
  var targetSection = document.getElementById(id);
  targetSection.innerHTML = html;
};

// this function generates a random unique id
const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

const showRefreshTimerInUtils = (lastRefreshTime) => {
  if (!lastRefreshTime) {
    return;
  }

  if (document.getElementById("refresh-alert-container")) {
    let countdown = parseInt(11 - (Date.now() - lastRefreshTime) / 1000);
    if (countdown > 0) {
      document.querySelector(".refresh-timer-footer").style.display = "flex";
    }
    updateRefreshTimer(countdown);

    timerInterval = setInterval(() => {
      updateRefreshTimer(countdown);
      if (countdown <= 0) {
        document.querySelector(".refresh-timer-footer").style.display = "none";
        clearInterval(timerInterval);
        location.reload();
      }
      countdown -= 1;
    }, 1000);
  }
};

const throttle = (err) => {
  return new Promise((resolve, reject) => {
    const { details } = err;
    showRefreshTimerInUtils(details.lastRemoteMeetingsRefreshAuto);
    return resolve(true);
  });
};

const errorManagement = (err) => {
  return new Promise(async (resolve, reject) => {
    if (!(err && err.customErrorCode)) {
      return resolve(true);
    }

    const errorAction = {
      ERR001: alertAndRemoveAccount,
      ERR002: throttle,
    };

    const action = errorAction[err.customErrorCode];
    if (action) {
      await action(err);
    }

    return resolve(true);
  });
};

const alertAndRemoveAccount = (err) => {
  return new Promise(async (resolve, reject) => {
    const { details } = err;

    await popupToBackground("remove-account", err.details.accountId);
    alert(`${details.email} got disconnected. Please login again.`);

    window.location.reload();
    resolve(true);
  });
};

const compareMeetings = (a, b) => {
  const currentTime = new Date().getTime();

  // Check if a's time has already passed
  const aIsPast = new Date(a.time).getTime() < currentTime;

  // Check if b's time has already passed
  const bIsPast = new Date(b.time).getTime() < currentTime;

  if (aIsPast && !bIsPast) {
    return 1; // a comes after b
  } else if (!aIsPast && bIsPast) {
    return -1; // a comes before b
  } else {
    // Sort by time in ascending order
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  }
};

const getMeetingsFromBackgroundWorker = async (
  filterDate = new Date(),
  mutateBadge = false
) => {
  try {
    const meetings = (await popupToBackground("get-meetings")) || [];

    // console.log("get-meetings: ", meetings);

    if (meetings && meetings?.length) {
      let tempMeetings = [];

      // filter the meetings for current date
      for (let i = 0; i <= meetings.length - 1; i++) {
        // console.log(
        //   moment(meetings[i].startTime).format("L"),
        //   " ",
        //   moment().format("L")
        // );
        if (
          moment(meetings[i].startTime).format("L") ==
          moment(filterDate).format("L")
        ) {
          tempMeetings.push(meetings[i]);
        }
      }

      // console.log("filtered meetings:", tempMeetings);

      let meetingsLen = tempMeetings.filter(
        (item) => new Date(item.startTime).getTime() >= new Date().getTime()
      ).length;

      // console.log("meetingsLen: ", meetingsLen);

      if (mutateBadge) if (meetingsLen >= 0) setBadgeText(meetingsLen);
      // else hideBadge();

      // if (tempMeetings.length == 0)
      // console.log(`No meetings for ${moment(filterDate).format("L")}`);

      return tempMeetings;
    } else return [];
  } catch (ex) {
    // console.log("No meetings found!");
    return [];
  }
};

const setBadgeText = async (text) => {
  try {
    let badgeElement = document.getElementById("meetings-count");
    badgeElement.innerText = text;
    badgeElement.style.display = "block";
    await popupToBackground("badge-text", text.toString());
  } catch (ex) {
    // console.log("setBadgeText Error: ", ex.message);
  }
};

const hideBadge = async () => {
  try {
    let badgeElement = document.getElementById("meetings-count");
    badgeElement.innerText = "0";
    await popupToBackground("badge-text", "");
  } catch (ex) {
    // console.log("hideBadge Error: ", ex.message);
  }
};

const getDateDescription = (targetDate) => {
  const today = moment();
  const tomorrow = moment().add(1, "day");
  const startOfWeek = moment().startOf("isoWeek");
  const startOfMonth = moment().startOf("month");
  targetDate = moment(targetDate);

  // console.log(targetDate.isSame(today, "d"));
  // console.log(targetDate.isSame(tomorrow, "d"));

  if (targetDate.isSame(today, "d")) {
    return "today";
  } else if (targetDate.isSame(tomorrow, "d")) {
    return "tomorrow";
  } else if (targetDate.isSame(startOfWeek, "isoWeek")) {
    return "this week";
  } else if (targetDate.isSame(startOfMonth, "month")) {
    return "this month";
  } else {
    return "later";
  }
};

// ! dont understand the use of this
// // Standard Google Universal Analytics code
// (function (i, s, o, g, r, a, m) {
//   i["GoogleAnalyticsObject"] = r;
//   (i[r] =
//     i[r] ||
//     function () {
//       (i[r].q = i[r].q || []).push(arguments);
//     }),
//     (i[r].l = 1 * new Date());
//   (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
//   a.async = 1;
//   a.src = g;
//   m.parentNode.insertBefore(a, m);
// })(
//   window,
//   document,
//   "script",
//   "https://www.google-analytics.com/analytics.js",
//   "ga"
// ); // Note: https protocol here

// ga("create", "UA-81669205-5", "auto"); // Enter your GA identifier
// ga("set", "checkProtocolTask", function () {}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
// ga("require", "displayfeatures");
