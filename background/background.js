chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install" || details.reason === "update") {
    chrome.runtime.setUninstallURL(`https://portd.io/uninstall`);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!sendResponse) {
    return;
  }
  switch (request.action) {
    case "load-meetings-for-notes":
      loadMeetingsForNotesCb((response) => {
        sendResponse(response);
      });
      break;
    case "get-meetings-remote":
      getRemoteMeetingsCb((response) => {
        sendResponse(response);
      });
      break;
    case "get-meetings":
      getMeetingsCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "get-accounts":
      getAllAccountsCb((response) => {
        sendResponse(response);
      });
      break;
    case "save-new-account":
      saveNewAccountCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "get-settings":
      getSettingsCb((response) => {
        sendResponse(response);
      });
      break;
    case "add-setting":
      addSettingCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "remove-setting":
      removeSettingCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "close-callback-tab":
      closeTab(sender);
      break;
    case "remove-account":
      removeAccountCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "clear-data":
      clearDataCb((response) => {
        sendResponse(response);
      });
      break;
    case "set":
      setCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "get":
      getCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "upsert":
      upsertCb(request.payload, (response) => {
        sendResponse(response);
      });
      break;
    case "badge-text":
      addBadgeText(request.payload);
    default:
      sendResponse({
        err: "Unknown operation",
        data: null,
      });
      break;
  }
  return true;
});

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

function generate32BitNumericUUID() {
  var randomInt = Math.floor(Math.random() * Math.pow(10, 9));
  return randomInt.toString().padStart(9, "0");
}

const getHashCode = function (string) {
  var hash = 0,
    i,
    chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

async function getAllAccountsCb(cb) {
  cb(await getAllAccounts());
}

async function loadMeetingsForNotesCb(cb) {
  cb(await loadMeetingsForNotes());
}

async function getRemoteMeetingsCb(cb) {
  cb(await getRemoteMeetings());
}

async function getMeetingsCb(payload, cb) {
  cb(await getMeetings(false)); // Removing payload as manualRefresh is now deprecated.
}

async function saveNewAccountCb(payload, cb) {
  cb(await saveNewAccount(payload));
}

async function getSettingsCb(cb) {
  cb(await getSettings());
}

async function addSettingCb(payload, cb) {
  cb(await addSetting(payload));
}

async function removeSettingCb(payload, cb) {
  cb(await removeSetting(payload));
}

async function removeAccountCb(payload, cb) {
  cb(await removeAccount(payload));
}

async function setCb(payload, cb) {
  cb(await set(payload));
}

async function getCb(payload, cb) {
  cb(await get(payload));
}

async function upsertCb(payload, cb) {
  cb(await upsert(payload));
}

function closeTab(sender) {
  chrome.tabs.remove(sender.tab.id);
}

function getAllAccounts() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["zoomiesAccounts"], function (result) {
      return resolve({ err: null, data: result.zoomiesAccounts });
    });
  });
}

function get(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      resolve({ err: null, data: result[key] });
    });
  });
}

function upsert(payload) {
  return new Promise((resolve, reject) => {
    const { key, id, data } = payload;
    chrome.storage.local.get([key], function (result) {
      let existingKeyValue = result[key];
      if (!existingKeyValue) {
        existingKeyValue = {};
      }
      if (!existingKeyValue[id]) {
        existingKeyValue[id] = {};
      }

      let existingIdValue = existingKeyValue[id];
      existingKeyValue[id] = { ...existingIdValue, ...data };

      let valueToSet = {};
      valueToSet[key] = existingKeyValue;
      set(valueToSet);
      resolve({ err: null, data: true });
    });
  });
}

function set(payload) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(payload, function () {
      resolve({ err: null, data: true });
    });
  });
}

function saveNewAccount(newAccount) {
  return new Promise(async (resolve, reject) => {
    const { err, data } = await getAllAccounts();
    let accounts = data || {};
    const zoomiesAccounts = Object.assign(accounts, newAccount);
    chrome.storage.local.set({ zoomiesAccounts }, function () {
      getMeetings(true);
      // updateBranding(Object.values(newAccount));
      resolve({ err: null, data: true });
    });
  });
}

function updateBranding(accounts) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!(accounts && accounts.length)) {
        return resolve(false);
      }

      let body = null;
      for (let accountId in accounts) {
        const account = accounts[accountId];
        let { id, email } = account;
        let emailDomain = null;
        const pos = email.search("@");
        if (pos > 0) {
          emailDomain = email.slice(pos + 1);
        }
        if (emailDomain) {
          body = body ? body : {};
          body[id] = emailDomain;
        }
      }

      if (!body) {
        return resolve(false);
      }

      const response = await fetch(
        `${chrome.runtime.getManifest().domain_url}/api/branding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ brandDomains: body }),
        }
      );

      let data = await response.json();
      const { brandImages } = data;
      await addSetting({
        settingKey: "zoomiesBranding",
        itemKey: null,
        itemValue: brandImages,
      });

      return resolve(true);
    } catch (err) {
      return resolve(false);
    }
  });
}

function addSetting(setting) {
  return new Promise(async (resolve, reject) => {
    const { err, data } = await getSettings();
    const settings = data ? data : {};

    const { settingKey, itemKey, itemValue } = setting;
    const settingToBeUpdated = settings[settingKey] ? settings[settingKey] : {};

    if (itemKey) {
      settingToBeUpdated[itemKey] = itemValue;
      settings[settingKey] = settingToBeUpdated;
    } else {
      settings[settingKey] = itemValue;
    }

    chrome.storage.local.set({ zoomiesSettings: settings }, function () {
      resolve({ err: null, data: true });
    });
  });
}

function removeSetting(settingKey) {
  return new Promise(async (resolve, reject) => {
    const { err, data } = await getSettings();
    const settings = data ? data : {};
    delete settings[settingKey];

    chrome.storage.local.set({ zoomiesSettings: settings }, function () {
      resolve({ err: null, data: true });
    });
  });
}

function getSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["zoomiesSettings"], function (result) {
      return resolve({ err: null, data: result.zoomiesSettings });
    });
  });
}

function removeAccount(accountId) {
  return new Promise(async (resolve, reject) => {
    await removeMeetingsFromAnAccount(accountId);
    chrome.storage.local.get(["zoomiesAccounts"], function (result) {
      let zoomiesAccounts = result.zoomiesAccounts;
      delete zoomiesAccounts[accountId];
      chrome.storage.local.set({ zoomiesAccounts }, function () {
        resolve({ err: null, data: true });
      });
    });
  });
}

function removeMeetingsFromAnAccount(accountId) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["zoomiesMeetings"], function (result) {
      let zoomiesMeetings = result.zoomiesMeetings.filter((meeting) => {
        return meeting.accountId !== accountId;
      });
      chrome.storage.local.set({ zoomiesMeetings }, function () {
        resolve({ err: null, data: true });
      });
    });
  });
}

// get-meetings
function getMeetings(
  newAccountMeetings,
  skipValidation,
  manualRefresh,
  overrideAutoRefresh
) {
  return new Promise(async (resolve, reject) => {
    try {
      let err, data;
      ({ err, data: zoomiesAccounts } = await getAllAccounts());

      if (err) {
        return resolve({ err, data: null });
      }

      // console.log("zoomiesAccounts: ", err, zoomiesAccounts);

      ({ err, data: localMeetings } = await getLocalMeetings());

      // console.log("getLocalMeetings", err, localMeetings);
      if (err) {
        return resolve({ err, data: null });
      }

      ({ err, data: validatedMeetings } = await validateMeetings(
        localMeetings,
        1
      ));
      // console.log("validateMeetings", err, validatedMeetings);

      if (err) {
        return resolve({ err, data: null });
      }

      // Set Alarms even if there is no remote fetch
      setAlarmsForCapturedMeetings(validatedMeetings);

      if (skipValidation) {
        validatedMeetings = localMeetings;
      }

      ({ err, data } = await canRefresh());
      if (err) {
        return resolve({ err: null, data: validatedMeetings });
      }

      // manual refresh and overrideAutoRefresh has been deprecated.
      const {
        auto,
        manual,
        lastRemoteMeetingsRefreshAuto,
        lastRemoteMeetingsRefreshManual,
      } = data;
      const allowRefresh = auto;

      if (
        validatedMeetings &&
        validatedMeetings.length > 0 &&
        !allowRefresh &&
        !newAccountMeetings
      ) {
        return resolve({
          err: {
            customErrorCode: "ERR002",
            details: { lastRemoteMeetingsRefreshAuto },
          },
          data: validatedMeetings,
        });
      }

      ({ err, data: remoteMeetings } = await getRemoteMeetings(
        validatedMeetings,
        manualRefresh
      ));

      if (err) {
        return resolve({ err, data: validatedMeetings });
      }

      ({ err, data: newMeetings } = await getLocalMeetings());
      if (err) {
        return resolve({ err: null, data: validatedMeetings });
      }

      ({ err, data: meetings } = await validateMeetings(newMeetings, 1));
      if (err) {
        return resolve({ err: null, data: validatedMeetings });
      }

      if (skipValidation) {
        validatedMeetings = newMeetings;
      }

      // TODO: Optimize this
      setAlarmsForCapturedMeetings(meetings);

      return resolve({ err: null, data: meetings });
    } catch (e) {
      // console.log("getMeetings", e.message);
      return resolve({ err: e, data: null });
    }
  });
}

function getLocalMeetings() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["zoomiesMeetings"], function (result) {
      const zoomiesMeetings = result.zoomiesMeetings || [];
      resolve({ err: null, data: zoomiesMeetings });
    });
  });
}

function makeArrayUniqueByProperties(array, properties) {
  const uniqueArray = [];
  const uniqueKeys = new Set();

  array.forEach((item) => {
    const key = properties.map((property) => item[property]).join("|");
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueArray.push(item);
    }
  });

  return uniqueArray;
}

// NOTE This method return meeting which have agenda and start time. Assign each meeting a unique id. Either return all meetings or meetings for the current date based on the purpose.
function validateMeetings(meetings, purpose) {
  return new Promise((resolve, reject) => {
    if (meetings) {
      meetings = meetings
        .filter((meeting) => {
          return meeting && meeting.agenda && meeting.startTime;
        })
        .filter((meeting) => {
          let localStartTime = meeting.startTime;

          if (meeting.provider === "microsoft") {
            localStartTime = new Date(
              new Date(meeting.startTime).getTime() +
                new Date(meeting.startTime).getTimezoneOffset() * 60000 * -1
            );
          }

          let meetingTime = new Date(localStartTime).getTime();
          if (purpose === 1) {
            //!  return all meetings
            return true;
            // return meetingTime + 30 * 60 * 1000 > Date.now();
          } else if (purpose === 2) {
            return new Date(localStartTime).getDate() == new Date().getDate();
          }

          return false;
        })
        .map((meeting) => {
          return {
            ...meeting,
            localId: getHashCode(
              meeting.agenda + new Date(meeting.startTime).getTime()
            ),
          };
        });
      meetings = makeArrayUniqueByProperties(meetings, ["localId"]);
    }
    resolve({ err: null, data: meetings });
  });
}

function loadMeetingsForNotes() {
  return new Promise(async (resolve, reject) => {
    try {
      ({ err, data: meetings } = await getMeetings(false));
      ({ err, data: validatedMeetings } = await validateMeetings(meetings, 2));
      return resolve({ err: null, data: validatedMeetings });
    } catch (e) {
      return resolve({ err: e, data: null });
    }
  });
}

function canRefreshV2() {
  return new Promise(async (resolve, reject) => {
    try {
      const { err, data } = await get("zoomiesThrottleControl");
      if (err) {
        return resolve({ err: null, data: false });
      }

      const coeff = 1000 * 60 * 1;
      const date = new Date();
      const rounded = new Date(
        Math.round(date.getTime() / coeff) * coeff
      ).getTime();

      const zoomiesThrottleControlCounter =
        (data.zoomiesThrottleControl || {})[rounded] || 0;
      if (zoomiesThrottleControlCounter > 3) {
        return resolve({ err: null, data: false });
      }

      const payloadToSave = {};
      payloadToSave[rounded] = zoomiesThrottleControlCounter + 1;
      await set({ zoomiesThrottleControl: payloadToSave });
    } catch (e) {
      return resolve({ err: null, data: false });
    }

    return resolve({ err: null, data: true });
  });
}

function canRefresh() {
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.get(
      ["lastRemoteMeetingsRefreshAuto", "lastRemoteMeetingsRefreshManual"],
      function (result) {
        const {
          lastRemoteMeetingsRefreshAuto,
          lastRemoteMeetingsRefreshManual,
        } = result;

        let response = {
          auto: false,
          manual: false,
          lastRemoteMeetingsRefreshAuto,
          lastRemoteMeetingsRefreshManual,
        };

        if (!lastRemoteMeetingsRefreshAuto) {
          response.auto = true;
        } else {
          response.auto =
            Date.now() - lastRemoteMeetingsRefreshAuto >= 10 * 1000;
        }

        if (!lastRemoteMeetingsRefreshManual) {
          response.manual = true;
        } else {
          response.manual =
            Date.now() - lastRemoteMeetingsRefreshManual >= 10 * 1000;
        }

        resolve({ err: null, data: response });
      }
    );
  });
}

// NOTE This method is actually responsible for fetching meeting from the backend and sorting them based on their time also removing the time representation difference between different providers (Microsoft return in UTC format) and it set the meeting in the local storage of chrome browser.
function getRemoteMeetings(validatedMeetings, manualRefresh) {
  // console.log("getting remote meetings");
  return new Promise(async (resolve, reject) => {
    try {
      const { err, data: zoomiesAccounts } = await getAllAccounts();
      if (!(zoomiesAccounts && Object.keys(zoomiesAccounts).length > 0)) {
        return resolve({ err: "No accounts connected.", data: [] });
      }

      for (let accountId in zoomiesAccounts) {
        const account = zoomiesAccounts[accountId];
        if (
          !(
            account.auth &&
            account.auth.refreshToken &&
            account.auth.accessToken
          )
        ) {
          return resolve({
            err: {
              customErrorCode: "ERR001",
              details: { email: account.email, accountId },
            },
            data: [],
          });
        }
      }

      const response = await fetch(
        `${chrome.runtime.getManifest().domain_url}/api/meetings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: Object.values(zoomiesAccounts) }),
        }
      );

      let data = await response.json();
      // console.log("Meetings Data check", [...data?.meetings])
      if (data && data.accounts && data.meetingsFetchedSuccess) {
        const { accounts: updatedZoomiesAccounts, meetings } = data;

        const { hasMultipleAccounts, hasMicrosoftAccount } =
          await userAccountsParameters();

        if (hasMicrosoftAccount) {
          meetings.map((meeting) => {
            if (meeting.provider === "microsoft") {
              meeting.startTime = new Date(
                new Date(meeting.startTime).getTime() +
                  new Date(meeting.startTime).getTimezoneOffset() * 60000 * -1
              ).toISOString();
            }
            return meeting;
          });
        }

        if (hasMultipleAccounts) {
          meetings.sort(function (a, b) {
            return new Date(a.startTime) - new Date(b.startTime);
          });
        }

        // console.log("Sorted Meetings", meetings)

        let storage = {
          zoomiesMeetings: meetings,
        };

        if (manualRefresh) {
          storage["lastRemoteMeetingsRefreshManual"] = Date.now();
        } else {
          storage["lastRemoteMeetingsRefreshAuto"] = Date.now();
        }

        if (updatedZoomiesAccounts) {
          storage.zoomiesAccounts = updatedZoomiesAccounts;
        }

        // await updateBranding(Object.values(updatedZoomiesAccounts));

        chrome.storage.local.set(storage, function () {
          return resolve({ err: null, data });
        });
      } else {
        // Failed to fetch meetings.
        return resolve({ err: null, data: validatedMeetings });
      }
    } catch (e) {
      // Failed to fetch meetings.
      return resolve({ err: null, data: validatedMeetings });
    }
  });
}

const clearDataCb = async (cb) => {
  cb(await clearExtensionData());
};

const clearExtensionData = () => {
  return new Promise((resolve, reject) => {
    // chrome.storage.local.remove([
    //   "zoomiesAccounts",
    //   "zoomiesMeetings",
    //   "lastRemoteMeetingsRefreshManual",
    //   "lastRemoteMeetingsRefreshAuto",
    // ]);
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
    chrome.storage.sync.clear();
    chrome.action.setBadgeText({ text: "" });
    chrome.alarms.clearAll((wasCleared) => null);
    resolve({ err: null, data: "Extension Data Cleared!" });
  });
};

function userAccountsParameters() {
  return new Promise(async (resolve, reject) => {
    try {
      const { err, data: zoomiesAccounts } = await getAllAccounts();
      if (err) {
        return resolve({
          hasMultipleAccounts: false,
          hasMicrosoftAccount: false,
        });
      }

      let numberOfAccounts = 0;
      let hasMicrosoftAccount = false;

      for (let accountId in zoomiesAccounts) {
        numberOfAccounts++;
        let account = zoomiesAccounts[accountId];
        if (account.provider === "microsoft") {
          hasMicrosoftAccount = true;
        }
      }

      const hasMultipleAccounts = numberOfAccounts > 1;
      resolve({
        hasMultipleAccounts,
        hasMicrosoftAccount,
      });
    } catch (e) {
      resolve({
        hasMultipleAccounts: false,
        hasMicrosoftAccount: false,
      });
    }
  });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
  // console.log("chrome.alarms.onAlarm.addListener");
  if (alarm.name.indexOf("meetingAlarm-") !== -1) {
    var currentTime = Date.now();
    var alarmTimePlus = alarm.scheduledTime + 20000;
    if (alarmTimePlus > currentTime) {
      const alarmName = alarm.name;
      const alarmNameWithoutAlarmTime = alarmName.substr(
        0,
        alarmName.lastIndexOf("@")
      );
      const alarmInfo = alarmNameWithoutAlarmTime.split("-");
      const title =
        alarmInfo.length > 1
          ? alarmNameWithoutAlarmTime.replace("meetingAlarm-", "")
          : "You have a meeting!";
      showNotification(title);
      addCountdownInBadge();
    }
  }
});

function setAlarmsForCapturedMeetings(meetings) {
  // console.log("setAlarmsForCapturedMeetings");
  if (!meetings) {
    return;
  }

  chrome.alarms.clearAll();
  for (let i = 0; i < meetings.length; i++) {
    if (new Date(meetings[i].startTime).getTime() >= new Date().getTime()) {
      let alarmTime = new Date(meetings[i].startTime).getTime() - 60 * 1000; // Adding it to alarm name to avoid alarm name conflicts for repeating events.
      chrome.alarms.create(`meetingAlarm-${meetings[i].agenda}@${alarmTime}`, {
        when: alarmTime,
      });
    }
  }
}

function showNotification(title) {
  chrome.notifications.create(
    `zoomies-notification-${Date.now()}`,
    {
      type: "basic",
      iconUrl: "../icons/new_logo_high.png",
      title: title,
      message: "Starts in 1 minute. Open Portd to speed dial to this meeting.",
    },
    (notificationId) => {
      chrome.notifications.onClicked.addListener(function (notificationId) {
        // this was for old extension
        // window.open(
        //   "src/browser_action/popup.html",
        //   "extension_popup",
        //   "width=400,height=600,status=no,scrollbars=yes,resizable=no"
        // );
      });
    }
  );

  audioNotification();
}

async function audioNotification() {
  const badgetText = await getBadgetText();
  if (badgetText) {
    return;
  }

  playSound(chrome.runtime.getURL("/src/audio/string.mp3"), 1);

  // This does not work on manifest v3
  // var notificationSound = new Audio("../audio/string.mp3");
  // notificationSound.play();
}

const addBadgeText = async (text) => {
  chrome.action.setBadgeText({ text: text.toString() });
};

const addCountdownInBadge = async () => {
  // const badgetText = await getBadgetText();
  // if (badgetText) {
  //   return;
  // }

  let countdown = 59;
  const timer = setInterval(async () => {
    let text = "00:" + ("00" + countdown).slice(-2);
    chrome.action.setBadgeText({ text });
    if (countdown === 0) {
      chrome.action.setBadgeText({ text: "" });
      clearInterval(timer);
    }
    countdown -= 1;
  }, 1000);
};

const getBadgetText = () => {
  return new Promise((resolve, reject) => {
    chrome.action.getBadgeText({}, function (result) {
      return resolve(result);
    });
  });
};

async function playSound(source = "default.wav", volume = 1) {
  await createOffscreen();
  await chrome.runtime.sendMessage({ play: { source, volume } });
  // console.log("sound played");
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: chrome.runtime.getURL("/src/html/audio.html"),
    reasons: ["AUDIO_PLAYBACK"],
    justification: "To play an audio alarm when the meeting time is close", // details for using the API
  });
}

function setMeetingsCountOnBadge(text) {
  chrome.action.setBadgeText({ text: text.toString() });
}
