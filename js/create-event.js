const getCreateNewMeetingLinkForProvider = (provider, email) => {
  if (!provider) {
    return null;
  }
  provider = provider.toLowerCase();

  const dateString = getDateString(provider);

  switch (provider) {
    case "google":
      return `https://www.google.com/calendar/u/${email}/r/eventedit?sprop&sprop=name:${dateString}`;
    case "microsoft":
      return `https://outlook.live.com/calendar/action/compose?login_hint=${email}${dateString}`;
    case "calendly":
      return "https://calendly.com/event_types/user/me?create_new_meeting=instant";
    case "office365":
      return `https://outlook.office365.com/calendar/action/compose?login_hint=${email}`;
    default:
      return null;
  }
};

// ANCHOR This function returns date string based on provider and current selected date for creating meetings
const getDateString = (provider) => {
  const currentDate = moment();
  const selectedDate = moment(currentDateGlobalVarible).startOf("day");
  let dateString = "";
  // Checking if the date selected is current date or a future one
  if (!currentDate.isSame(selectedDate, "day")) {
    if (provider === "google") {
      const startTime = selectedDate.format("YYYYMMDDTHHmmss");
      const endTime = selectedDate.add(30, "minutes").format("YYYYMMDDTHHmmss");
      dateString = `&dates=${startTime}/${endTime}`;
    }
    if (provider === "microsoft") {
      const startTime = selectedDate.format("YYYY-MM-DD");
      dateString = `&startdt=${startTime}`;
    }
  }
  return dateString;
};

// This functions return a concated html list of accounts element
const listLinkedAccountsToCreateMeeting = (accounts) => {
  if (!accounts) {
    return "";
  }
  // console.log("accounts", accounts);
  let html = "";
  for (let id in accounts) {
    const details = accounts[id];
    if (details) {
      const { email, provider } = details;
      html += `
        <div class="display-flex flex-row w-100 align-center justify-center account create-meeting-account" provider=${provider} email=${email}>
          <img src="../icons/${provider}.png" alt="${provider}" height="20" width="20" class="btn-icon">
          <h4 class="account-email ml-2">${email}</h4>
        </div>
      `;
    }
  }
  return html;
};

const addCreateEventListener = () => {
  if (document.getElementsByClassName("create-meeting-account")) {
    const createNewMeetingDivs = document.querySelectorAll(
      ".create-meeting-account"
    );
    for (let i = 0; i < createNewMeetingDivs.length; i++) {
      const provider = createNewMeetingDivs[i].getAttribute("provider");
      const email = createNewMeetingDivs[i].getAttribute("email");
      createNewMeetingDivs[i].onclick = async () => {
        chrome.tabs.create({
          url: getCreateNewMeetingLinkForProvider(provider, email),
        });
        // this function is in calender.js
        // await loadCalendarUI();
        // showCurrentDateDayYear();
        // This fuction is in notes.js that will show the meetings ui
        showMeetingsUI();
      };
    }
  }
};

const showAllLinkedAccounts = async () => {
  // console.log("showAllLinkedAccounts");
  try {
    const zoomiesAccounts = await popupToBackground("get-accounts");
    // listLinkedAccounts is in utils.js
    const html = listLinkedAccountsToCreateMeeting(zoomiesAccounts);
    if (html) {
      document.getElementById("accounts-container").innerHTML = html;
      addCreateEventListener();
    }
  } catch (e) {
    // console.log(e);
    alert("Failed to fetch accounts.");
  }
};

// This will be called when the file injects
showAllLinkedAccounts();
