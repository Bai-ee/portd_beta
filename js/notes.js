// console.log("LOADED");
var html; // Define html variable

// This is global state variable for current date
var currentDateGlobalVarible = new Date();
var linkedAccountCount = 0;
var count = 0;
var quillDefault = null;
var quillScreen = null;
var allNotesInJSON = {};
var loadMeetingsInterval = null;
var modalSlidingUp = false;
var meetingsGlobalVar = [];
var collapsibleMode = "full";
var collapsibleHeaders = document.querySelectorAll(".collapsible-header");

// Making sure that every header is click able and have same opacity (visibility)
const expand50UnLocalUI = () => {
  collapsibleHeaders.forEach((header) => {
    header.style.pointerEvents = "all";
    const contentCloseIcon =
      header.getElementsByClassName("meetings_nav_icon")[0];
    const content = header.nextElementSibling;
    const headerParent = header.parentNode;

    if (header.id !== "meetings-collapsible-header") {
      header.style.opacity = 1;
      contentCloseIcon.src =
        "../assets/expand_all_FILL0_wght400_GRAD0_opsz48.png";
      content.style.display = "flex"; // No need For hidding content as we are doing flex-0
      content.classList.remove("open");
      content.classList.remove("closed");
      content.classList.add("half-open");

      if (contentCloseIcon.classList.contains("rotate-180"))
        contentCloseIcon.classList.remove("rotate-180");
      contentCloseIcon.classList.add("rotate-0");

      headerParent.classList.remove("flex-0");
      headerParent.classList.add("flex-1");
    } else {
      contentCloseIcon.style.opacity = 1;
      content.style.display = "flex";
      content.classList.remove("open");
      content.classList.remove("closed");
      content.classList.add("half-open");
      contentCloseIcon.src =
        "../assets/expand_all_FILL0_wght400_GRAD0_opsz48.png";
      if (contentCloseIcon.classList.contains("rotate-180"))
        contentCloseIcon.classList.remove("rotate-0");
      contentCloseIcon.classList.add("rotate-0");
      headerParent.classList.remove("flex-0");
      headerParent.classList.add("flex-1");
    }
  });

  // Notes expand icon to register click
  document.getElementById("expand-notes").style.pointerEvents = "all";
};

const revertCreateMeetingButtonUI = () => {
  console.log("revert");
  const video_call_button = document.getElementById("video_call");
  video_call_button.classList.remove("active");

  const video_call_text = document.getElementById("meeting-btn-text");
  video_call_text.classList.remove("active");

  const calendar_add_on = document.getElementById("calendar_add_on");
  calendar_add_on.classList.add("active");
  calendar_add_on.style.display="block";

  const calendar_add_off = document.getElementById("calendar_add_off");
  calendar_add_off.style.display="none";
  

  const children = Array.from(video_call_button?.children);
  if (children?.length)
    children?.forEach((child) => {
      if (child.tagName === "DIV") {
        child.style.backgroundColor = "#34387C";

        child.style.color = "#fff";
      } else if (child.tagName === "IMG") {
        child.src = "../assets/calendar_add_on_FILL0_wght400_GRAD0_opsz24.svg";
      } else if (child.tagName === "P") {
        child.innerHTML = "meetings";
      }
    });
};

const showMeetingsUI = () => {
  if (linkedAccountCount == 0) return showLoginUI();

  expand50UnLocalUI();

  revertCreateMeetingButtonUI();

  document.getElementById("section_vert_meetings").style.display = "flex";
  document.getElementById("section_vert_login").style.display = "none";
  document.getElementById("section_vert_create_events").style.display = "none";

  document.getElementById("welcomeScreen").style.display = "none";

  document.getElementById("video_call").style.display = "flex";
  document.getElementById("video_call").style.opacity = 1;
  document.getElementById("video_call").style.pointerEvents = "all";

  const notes_button = document.getElementById("add_notes");
  notes_button.style.display = "flex";
  notes_button.style.opacity = 1;
  notes_button.style.pointerEvents = "all";
  const spanElement = document.querySelector('#add_notes span');

  if (spanElement) {
    spanElement.style.setProperty('pointer-events', 'all');
  }

  document.getElementById("settings").style.display = "flex";
  document.getElementById("settings").style.opacity = 1;
  document.getElementById("settings").style.pointerEvents = "all";
 
};

const activateCreateMeetingUI = () => {
  const video_call_button = document.getElementById("video_call");
  video_call_button.classList.add("active");

  const video_call_text = document.getElementById("meeting-btn-text");
  video_call_text.classList.add("active");

  const calendar_add_on = document.getElementById("calendar_add_on");
  calendar_add_on.classList.add("active");
  calendar_add_on.style.display="none";

  const calendar_add_off = document.getElementById("calendar_add_off");
  calendar_add_off.style.display="block";

  document.getElementById("video_call").classList.remove("nav_button_active")
  document.getElementById("add_notes").classList.remove("nav_button_active")

  const children = Array.from(video_call_button?.children);
  if (children?.length)
    children?.forEach((child) => {
      if (child.tagName === "DIV") {
        child.style.backgroundColor = "#fbfafa";
        child.style.color = "#333673";
      } else if (child.tagName === "IMG") {
        child.src = "../assets/calendar_meetings2.svg";
      } else if (child.tagName === "P") {
        child.innerHTML = "go back";
      }
    });
};

const showCreateEventsUI = () => {
  if (linkedAccountCount == 0) return showLoginUI();

  // Scrolling back to top
  const container = document.getElementsByClassName(
    "calendar-white-paper-container"
  )[0];
  if (container) {
    container.scrollTop = 0;
  }

  activateCreateMeetingUI();

  const reportProblem = () => {
    // browserApi.tabs.create({ url: "mailto:support@portd.io" });
    window.close();
  };


  document.getElementById("section_vert_create_events").style.display = "flex";
  document.getElementById("section_vert_meetings").style.display = "none";
  document.getElementById("section_vert_login").style.display = "none";

  const notes_button = document.getElementById("add_notes");
  notes_button.style.opacity = .5;
  notes_button.style.pointerEvents = "none";
  const spanElement = document.querySelector('#add_notes span');

  if (spanElement) {
    spanElement.style.setProperty('pointer-events', 'none', 'important');
  }


  document.getElementById("settings").style.opacity = 1;
  document.getElementById("settings").style.pointerEvents = "auto";

  collapsibleHeaders.forEach((header) => {
    header.style.pointerEvents = "none";
    if (header.id !== "meetings-collapsible-header") header.style.opacity = 0.5;
  });
  document.getElementById("expand-notes").style.pointerEvents = "none";

  openMeetingsCollapsible();
  showAllLinkedAccounts();
};

const showSettingsUI = () => {
  if (linkedAccountCount == 0) return showLoginUI();
  document.getElementById("section_vert_settings").style.display = "flex";
  slideUp("#settings_box");
};

// This method will remove notes and clear notes section
const clearNotesData = async () => {
  try {
    await popupToBackground("clear-data");
    await loadPreviousNotes();
    setNoteTitle("note-typing-title-0", "");
    setNoteDescription("default", "");
    removeDefaultNotePadAttributes();

    setNoteTitle("note-typing-title-1", "");
    setNoteDescription("screen", "");

    let badgeElement = document.getElementById("meetings-count");
    badgeElement.innerHTML = "0";
    linkedAccountCount = 0;
    // console.log("SIGNOUT-COMPLETE");
  } catch (error) {
    // console.log("Failed to Sign out: ", ex);
  }
};

// Making sure that the meetings section stay open when no account is linked and reducing opacity of other header and buttons
const expandMeetingsLockUI = () => {
  collapsibleHeaders.forEach((header) => {
    header.style.pointerEvents = "none";
    const contentCloseIcon =
      header.getElementsByClassName("meetings_nav_icon")[0];
    const content = header.nextElementSibling;
    const headerParent = header.parentNode;

    if (header.id !== "meetings-collapsible-header") {
      header.style.opacity = 0.15;
      contentCloseIcon.src =
        "../assets/expand_more_FILL0_wght400_GRAD0_opsz48.png";
      content.style.display = "none"; // No need For hidding content as we are doing flex-0
      content.classList.remove("open");
      content.classList.remove("half-open");
      content.classList.add("closed");

      if (contentCloseIcon.classList.contains("rotate-180"))
        contentCloseIcon.classList.remove("rotate-180");

      contentCloseIcon.classList.add("rotate-0");
      headerParent.classList.remove("flex-1");
      headerParent.classList.add("flex-0");
    } else {
      contentCloseIcon.style.opacity = 0.15;
      content.style.display = "flex";
      content.classList.add("open");
      content.classList.remove("half-open");
      contentCloseIcon.src =
        "../assets/expand_more_FILL0_wght400_GRAD0_opsz48.png";
      if (contentCloseIcon.classList.contains("rotate-0"))
        contentCloseIcon.classList.remove("rotate-0");

      contentCloseIcon.classList.add("rotate-180");
      headerParent.classList.remove("flex-0");
      headerParent.classList.add("flex-1");
    }
  });

  document.getElementById("expand-notes").style.pointerEvents = "none";
};

// This will show the login ui and hide others
const showLoginUI = async () => {
  // SHOW 50/50 WELCOME SCREEN

  slideDown("#settings_box");
  revertCreateMeetingButtonUI();
  document.getElementById("section_vert_login").style.display = "flex";
  document.getElementById("section_vert_settings").style.display = "none";
  document.getElementById("section_vert_meetings").style.display = "none";
  document.getElementById("section_vert_create_events").style.display = "none";
  document.getElementById("welcomeScreen").style.display = "block";
  document.getElementById("video_call").style.display = "none";
  document.getElementById("video_call").style.pointerEvents = "none";
  document.getElementById("add_notes").style.display = "none";
  document.getElementById("add_notes").style.pointerEvents = "none";
  document.getElementById("settings").style.display = "none";
  document.getElementById("settings").style.pointerEvents = "none";

  collapsibleHeaders.forEach((header) => {
    const headerParent = header.parentNode;
    if (headerParent.classList.contains(
      "flex-0"
    )) {
      header.click()
    }
  })

  // SHOW THE FULL SCREEN WELCOME SCREEN commented out to show the above instead
  // slideDown("#settings_box");
  // revertCreateMeetingButtonUI();
  // expandMeetingsLockUI();
  // document.getElementById("section_vert_login").style.display = "flex";
  // document.getElementById("section_vert_settings").style.display = "none";
  // document.getElementById("section_vert_meetings").style.display = "none";
  // document.getElementById("section_vert_create_events").style.display = "none";
  // document.getElementById("video_call").style.opacity = 0.5;
  // document.getElementById("video_call").style.pointerEvents = "none";
  // document.getElementById("add_notes").style.opacity = 0.5;
  // document.getElementById("add_notes").style.pointerEvents = "none";
  // document.getElementById("settings").style.opacity = 0.5;
  // document.getElementById("settings").style.pointerEvents = "none";
};

// Fetch the HTML content from file.html
const dealBrowserEvents = async () => {
  // console.log("dealBrowserEvents");
  try {
    // Fetching calendar html and js
    let response = await fetch("../html/calendar.html");
    response = await response.text();
    let html = response;

    insertHTMLIntoTargetSection("section_vert_meetings", html);

    // Fetching create-event html and js
    response = await fetch("../html/create-event.html");
    response = await response.text();
    html = response;
    insertHTMLIntoTargetSection("section_vert_create_events", html);

    response = await fetch("../html/settings.html");
    response = await response.text();
    html = response;
    insertHTMLIntoTargetSection("section_vert_settings", html);

    response = await fetch("../html/login.html");
    response = await response.text();
    html = response;
    insertHTMLIntoTargetSection("section_vert_login", html);

    response = await fetch("../html/audio.html");
    response = await response.text();
    html = response;

    // If there are accounts fetch and inject all files
    injectScripts("tooltip-js", chrome.runtime.getURL("/src/js/tooltip.js"));
    injectScripts("calendar-js", chrome.runtime.getURL("/src/js/calendar.js"));
    injectScripts(
      "create-event-js",
      chrome.runtime.getURL("/src/js/create-event.js")
    );
    injectScripts("settings-js", chrome.runtime.getURL("/src/js/settings.js"));
    injectScripts("login-js", chrome.runtime.getURL("/src/js/login.js"));
    injectScripts("audio-js", chrome.runtime.getURL("/src/js/audio.js"));
    // add click event to add tags with id video_call
    let videoButton = document.querySelectorAll('[id="video_call"]');
    videoButton.forEach((item) => {
      // console.log(item);
      item.addEventListener("click", () => {
        const section_vert_create_events = document.getElementById(
          "section_vert_create_events"
        ).style.display;
        if (section_vert_create_events == "flex") showMeetingsUI();
        else showCreateEventsUI();
      });
    });

    // Listner for new meeting button inside meetings container
    let newMeetingButton = document.getElementById(
      "video_call_new_meetings_card"
    );
    newMeetingButton.addEventListener("click", () => {
      showCreateEventsUI();
      // window.open("https://zoom.us/meeting/schedule");
    });

    // add click event to add tags with id settings
    const settingsCloseButton = document.querySelectorAll('[id="settings"]');
    settingsCloseButton.forEach((item) => {
      let closeButton = document.getElementById("close_settings");

      closeButton.addEventListener("click", () => {
        slideDown("#settings_box");
      });
      item.addEventListener("click", async () => {
        await loadSettingsUI();
        showSettingsUI();
      });

      document.getElementById("create_connection_collapsible").scrollIntoView();
    });

    const closeNotesButton = document.getElementById("close_notes");
    closeNotesButton.addEventListener("click", async () => {
      slideDown("#notes_box");
    });

    // const loginGoBackButton = document.getElementById("go-back-button");
    // loginGoBackButton.addEventListener("click", async () => {
    //   showMeetingsUI();
    // });

    const addNotesButton = document.querySelectorAll('[id="add_notes"]');
    addNotesButton.forEach((item) => {
      // console.log(item);
      item.addEventListener("click", () => {
        // setNoteTitle("note-typing-title-1", "");
        // setNoteDescription("screen", "");

        setNoteTitle("note-typing-title-0", "");
        setNoteDescription("default", "");
        removeDefaultNotePadAttributes();

        // const dropdownList = document.getElementById("meetings-list");
        // if (dropdownList.value != -1) dropdownList.value = -1;

        const notes_header = document.getElementById(
          "notes-collapsible-header"
        );
        // if (!notes_header.nextElementSibling.classList.contains("open"))
          notes_header.click();

        const noteTitle = document.getElementById("note-typing-title-0");
        noteTitle.focus();

        // slideUp("#notes_box");
      });
    });

    // add click event to add tags with id go_to_settings
    const goToSettings = document.querySelectorAll('[id="go_to_settings"]');
    goToSettings.forEach((item) => {
      // console.log(item);
      item.addEventListener("click", async () => {
        await loadSettingsUI();
        showSettingsUI();
      });
    });

    // add click event to add tags with id create_event_link
    const goToCreateEvent = document.querySelectorAll(
      '[id="create_event_link"]'
    );
    goToCreateEvent.forEach((item) => {
      // console.log(item);
      item.addEventListener("click", () => {
        showCreateEventsUI();
      });
    });

    // add click event to add tags with id go_to_login
    const goToLogin = document.querySelectorAll('[id="go_to_login"]');
    goToLogin.forEach((item) => {
      // console.log(item);
      item.addEventListener("click", () => {
        showLoginUI();
        slideDown("#settings_box");
      });
    });

        // // add click event to add tags with id go_to_login
        // const goToLogin = document.querySelectorAll('[id="go_to_login"]');
        // goToLogin.forEach((item) => {
        //   // console.log(item);
        //   item.addEventListener("click", () => {
        //     showLoginUI();
        //     slideDown("#settings_box");
        //   });
        // });

    const zoomiesAccounts = await popupToBackground("get-accounts");

    // here cheecking if there are any account linked if there are show calender html else login
    if (zoomiesAccounts) {
      linkedAccountCount = Object.values(zoomiesAccounts)?.length;
      showMeetingsUI();
    } else {
      linkedAccountCount = 0;
      showLoginUI();
    }

    const refershButton = document.getElementById("sync_text");
    const refershIcon = document.getElementById("refresh-data");
    

    refershButton.addEventListener("click", async () => {
      refershIcon.classList.add("refresh-icon-rotate");

      slideDown("#settings_box");
      slideDown("#notes_box");
      // Perform behind the scene actions
      currentDateGlobalVarible = new Date();

      // setSearchBarText("");

      // 50-50 collapsible
      // if any is closed or opened it will reset both
      const meetings_collapsible_header = document.getElementById(
        "meetings-collapsible-header"
      );
      const isOpen =
        meetings_collapsible_header.nextElementSibling.classList.contains(
          "open"
        );
      const isClosed =
        meetings_collapsible_header.nextElementSibling.classList.contains(
          "closed"
        );
      if (isOpen || isClosed) meetings_collapsible_header.click();

      // This will clear the notes editor
      defaultTextBoxOnLoad();

      // This is on refresh click get meetings again for the current date and setBadge
      meetingsGlobalVar = await getMeetingsFromBackgroundWorker(
        currentDateGlobalVarible,
        true
      );

      // Load UIs as there is no need to check if use has linkend accounts or not
      await loadSettingsUI();
      await loadPreviousNotes();

      // Making sure no state stay active
      document.getElementById("video_call").classList.remove("nav_button_active")
      document.getElementById("add_notes").classList.remove("nav_button_active")

      const zoomiesAccounts = await popupToBackground("get-accounts");
      // here cheecking if there are any account linked if there are show calender html else login
      if (zoomiesAccounts) {
        linkedAccountCount = Object.values(zoomiesAccounts)?.length;
        // clear all the states and hard reload
        // console.log("linked accounts: ", linkedAccountCount);

        // if there are accounts then load the meetings of accounts
        await loadCalendarUI();
      } else {
        // console.log("no accounts are linked");
        linkedAccountCount = 0;
        showLoginUI();
        document.getElementById('go-back-admin-permission-request-note').click()

      }

      showCurrentDateDayYear();

      // Save any unsaved notes on refresh
      setTimeout(() => {
        refershIcon.classList.remove("refresh-icon-rotate");
        // quillDefault.focus();
        const noteTitle = document.getElementById("note-typing-title-0");
        noteTitle.focus();
      }, 1000);
    });

    const resetDateButon = document.getElementById("reset-date");
    resetDateButon.addEventListener("click", async () => {
      // Perform behind the scene actions
      currentDateGlobalVarible = new Date();

      showCurrentDateDayYear();
      // setSearchBarText("");

      // This will clear the notes editor
      defaultTextBoxOnLoad();

      // Load UIs as there is no need to check if use has linkend accounts or not
      await loadSettingsUI();
      await loadPreviousNotes();

      const zoomiesAccounts = await popupToBackground("get-accounts");
      // here cheecking if there are any account linked if there are show calender html else login
      if (zoomiesAccounts) {
        linkedAccountCount = Object.values(zoomiesAccounts)?.length;
        // clear all the states and hard reload
        // console.log("linked accounts: ", linkedAccountCount);

        // if there are accounts then load the meetings of accounts
        await loadCalendarUI();
      } else {
        // console.log("no accounts are linked");
        linkedAccountCount = 0;
        showLoginUI();
      }
    });
  } catch (e) {
    // console.log("error: ", e.message);
  }
};

// This function will show the current date in the dates section
const showCurrentDateDayYear = async () => {
  let currentDayMonthYear = document.getElementById("current_day_month_year");
  let durationText = document.getElementById("current_duration");
  let currentDateInHtml = document.getElementById("current_date_number");

  durationText.innerText = getDateDescription(currentDateGlobalVarible);
  currentDayMonthYear.innerText = moment(currentDateGlobalVarible).format(
    "dddd, MMMM YYYY"
  );
  currentDateInHtml.innerText = moment(currentDateGlobalVarible).format("Do");
  count = 0;

  let backArrow = document.getElementById("arrow_back_ios");
  backArrow.style.opacity = 0.1;

  let forwardArrow = document.getElementById("arrow_forward_ios");
  forwardArrow.style.opacity = 1;

  let resetDate = document.getElementById("reset-date");
  resetDate.style.display = "none";

  document.getElementById("meetings-count").style.visibility = "visible";

  await filterMeetingsToCurrentDate();
};

// This function will increment and show the date in the dates section
const incrementDate = () => {
  let durationText = document.getElementById("current_duration");
  let currentDateInHtml = document.getElementById("current_date_number");
  let currentDayMonthYear = document.getElementById("current_day_month_year");

  currentDateInHtml.innerText = moment(currentDateGlobalVarible)
    .add(1, "days")
    .format("Do");
  currentDateGlobalVarible = moment(currentDateGlobalVarible)
    .add(1, "days")
    .format();
  durationText.innerText = getDateDescription(currentDateGlobalVarible);
  currentDayMonthYear.innerText = moment(currentDateGlobalVarible).format(
    "dddd, MMMM YYYY"
  );
};

// This function will decrement and show the date in the dates section
const decrementDate = () => {
  let durationText = document.getElementById("current_duration");
  let currentDateInHtml = document.getElementById("current_date_number");
  let currentDayMonthYear = document.getElementById("current_day_month_year");

  currentDateInHtml.innerText = moment(currentDateGlobalVarible)
    .add(-1, "days")
    .format("Do");
  currentDateGlobalVarible = moment(currentDateGlobalVarible)
    .add(-1, "days")
    .format();
  durationText.innerText = getDateDescription(currentDateGlobalVarible);
  currentDayMonthYear.innerText = moment(currentDateGlobalVarible).format(
    "dddd, MMMM YYYY"
  );
};

// This function will add onClick event on left/right icons in notes.html
const addDateIncrementDecrementListeners = () => {
  let incrementButton = document.getElementById("dateIncrementR");
  let decrementButton = document.getElementById("dateIncrementL");

  incrementButton.addEventListener("click", async () => {
    if (count >= 5) return;
    count++;
    let backArrow = document.getElementById("arrow_back_ios");
    backArrow.style.opacity = 1;
    let badgeElement = document.getElementById("meetings-count");
    badgeElement.style.visibility = "hidden";
    // setSearchBarText("");
    incrementDate();
    showLoadingView();
    await filterMeetingsToCurrentDate();
    showMeetingsUI();
    document.getElementById("reset-date").style.display = "flex";
    if (count > 4) {
      let forwardArrow = document.getElementById("arrow_forward_ios");
      forwardArrow.style.opacity = 0.6;
    }
    // Open meetings collapsible
    // let meetings_collapsible_header = document.getElementById(
    //   "meetings-collapsible-header"
    // );
    // const isOpen =
    //   !meetings_collapsible_header.nextElementSibling.classList.contains(
    //     "open"
    //   );
    // if (isOpen) meetings_collapsible_header.click();
  });

  decrementButton.addEventListener("click", async () => {
    // console.log(count);
    if (count >= 1) {
      if (count >= 5) {
        let forwardArrow = document.getElementById("arrow_forward_ios");
        forwardArrow.style.opacity = 1;
      }
      count--;
      // setSearchBarText("");
      decrementDate();
      showLoadingView();
      await filterMeetingsToCurrentDate();
      showMeetingsUI();
      document.getElementById("reset-date").style.display = "flex";

      // // Open meetings collapsible
      // let meetings_collapsible_header = document.getElementById(
      //   "meetings-collapsible-header"
      // );
      // const isOpen =
      //   !meetings_collapsible_header.nextElementSibling.classList.contains(
      //     "open"
      //   );
      // if (isOpen) meetings_collapsible_header.click();
    }

    if (count < 1) {
      let backArrow = document.getElementById("arrow_back_ios");
      backArrow.style.opacity = 0.6;
      document.getElementById("reset-date").style.display = "none";
      document.getElementById("meetings-count").style.visibility = "visible";
    }
  });
};

// This function will filter the meetings to current date
const filterMeetingsToCurrentDate = async () => {
  try {
    // This opens the meeting if if is not opened
    // let meetings_collapsible_header = document.getElementById(
    //   "meetings-collapsible-header"
    // );
    // const isOpen =
    //   !meetings_collapsible_header.nextElementSibling.classList.contains(
    //     "open"
    //   );
    // if (isOpen) meetings_collapsible_header.click();

    // empty the old meetings ui to avoid glitches
    injectMeetingsHtml("");

    // This is to filter meetings for the selected date by filter
    const meetings = await getMeetingsFromBackgroundWorker(
      currentDateGlobalVarible
    );

    if (meetings && meetings.length > 0) {
      const meetingsHtml = generateMeetingsHtml(meetings);

      // This function will inject the meeting cards in the html
      injectMeetingsHtml(meetingsHtml);

      // This function will added meeting and notes onclick actions on the meeting elements
      addEventListenerForMeetings(meetings);
      showMeetingsUI();
      await popupToBackground("set", {
        zoomiesCachedMeetingsHtml: meetingsHtml,
      });
    } else {
      showNoMeetingsView();
    }
  } catch (ex) {
    // console.log("Error->filterMeetingsToCurrentDate: ", ex);
  }
};

// This function will add all the notes to the dropdown list
const renderDropdownInScreenPad = () => {
  let dropdownList = `<option value="-1">select a meeting to create a note for</option>
                      <option value="0"or create new note</option>`;

  const notesArray = Object.values(allNotesInJSON);
  let listToRenderArray = [...notesArray];

  if (linkedAccountCount > 0) {
    const meetings = meetingsGlobalVar;
    if (meetings?.length) {
      const filteredMeetings = meetings.filter(
        (itemA) => !notesArray.some((itemB) => itemB.id === itemA.id)
      );
      listToRenderArray = [...filteredMeetings, ...notesArray];
    }
  }

  // console.log(listToRenderArray);
  // if account is linked

  for (let i = 0; i < listToRenderArray.length; i++) {
    const listItem = listToRenderArray[i];
    dropdownList += `<option 
                        id="${listItem?.localId}-meeting-option"
                        accountId=${listItem?.accountId}
                        agenda=${listItem?.agenda?.replace(
                          new RegExp(" ", "g"),
                          "_"
                        )}
                        localId=${listItem?.localId}
                        startTime=${listItem?.startTime}
                        value="${listItem?.localId}">
                        ${listItem?.agenda}, ${formatTime(listItem?.startTime)}
                    </option>`;
  }

  setMeetingListOptions(dropdownList);
};

// This method will open meeting collapsible
const openMeetingsCollapsible = () => {
  collapsibleHeaders.forEach((header) => {
    const contentCloseIcon =
      header.getElementsByClassName("meetings_nav_icon")[0];
    const content = header.nextElementSibling;
    const headerParent = header.parentNode;
    contentCloseIcon.src =
      "../assets/expand_more_FILL0_wght400_GRAD0_opsz48.png";

    if (header.id !== "meetings-collapsible-header") {
      content.style.display = "none"; // No need For hidding content as we are doing flex-0
      content.classList.remove("open");
      content.classList.remove("half-open");
      content.classList.add("closed");

      if (contentCloseIcon.classList.contains("rotate-180"))
        contentCloseIcon.classList.remove("rotate-180");

      contentCloseIcon.classList.add("rotate-0");
      headerParent.classList.remove("flex-1");
      headerParent.classList.add("flex-0");
    } else {
      content.style.display = "flex";
      content.classList.add("open");
      content.classList.remove("half-open");
      if (contentCloseIcon.classList.contains("rotate-0"))
        contentCloseIcon.classList.remove("rotate-0");

      contentCloseIcon.classList.add("rotate-180");
      headerParent.classList.remove("flex-0");
      headerParent.classList.add("flex-1");
    }
  });
};

const setMeetingListOptions = (html) => {
  document.getElementById("meetings-list").innerHTML = html;
};

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: false,
    minute: "numeric",
  });
};

// This function will load and populate old notes
const loadPreviousNotes = async () => {
  try {
    const notesObj = (await popupToBackground("get", "zoomiesNotes")) || {};
    // console.log("load notes", notesObj);
    allNotesInJSON = notesObj;

    const notes = Object.values(notesObj) || [];

    if (!notes.length) {
      return showNoNotesBox();
    }

    const sortedNotes = sortNotesByDate(notes);
    populateNotes(sortedNotes, notesObj);
    // console.log(allNotesInJSON);
  } catch (ex) {
    // console.log("Error->loadPreviousNotes: ", ex);
  }
};

// This function will sort notes by date
const sortNotesByDate = (notes) => {
  return notes.sort(function (a, b) {
    return new Date(b.startTime) - new Date(a.startTime);
  });
};

// This function will populate Notes in the notes section
const populateNotes = (notes, notesObj) => {
  // console.log(notesObj);
  let htmlForNotesSection = "";

  for (let i = 0; i < notes.length; i++) {
    const noteDetails = notes[i];
    const { accountId, agenda, localId, noteStr, startTime } = noteDetails;
    const isNewMeetingNote = accountId ? false : true;

    htmlForNotesSection += `
          <div class="note" id="edit-button" accountId="${accountId}" localId="${localId}" cardId="${localId}">
              <h4 class="note-title">${agenda}</h4>
              <h5 class="note-subtitle">${moment(new Date(startTime)).format(
                "L"
              )}</h5>  

              <div class="card-edit_note" id="edit-button" localId="${localId}">
                <span class="material-symbols-outlined" style="font-size:20px">
                    edit_note
                </span>  
              </div>

              <div class="card-delete" id="delete-button" localId="${localId}">
                <span class="material-symbols-outlined" style="font-size:18px">
                    delete 
                </span>  
              </div>
          </div>
    `;
  }

  if (htmlForNotesSection) {
    htmlForNotesSection += `
    <div class="note justify-center align-center cursor-pointer user-none" id="add_notes_card">
        <span class="material-symbols-outlined add_symbol" >
            add
        </span>
    </div>
    `;

    document.getElementById("previous-notes").innerHTML = htmlForNotesSection;
    addNewNoteCardClick();
    // console.log(notesObj);
  }

  screenNotePadEditButtonEventListener(
    document.querySelectorAll('[id^="edit-button"]'),
    notesObj
  );

  noteCardsDeleteButtonsEventListener(
    document.querySelectorAll('[id^="delete-button"]')
  );
};

// This function will add ... on a note if it is too long
const truncateNoteInCard = (note) => {
  return note && note.length >= 120 ? `${note.substring(0, 120)} ...` : note;
};

// This will return a formated date string MM/DD/YYYY h:m:s
const formatDate = (date) => {
  return (
    [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join("/") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

// this function is to add onclick event on edit button of each note in the notes section
const screenNotePadEditButtonEventListener = (editBtns, notesObj) => {
  for (let i = 0; i < editBtns.length; i++) {
    const editBtn = editBtns[i];

    editBtn.onclick = async (event) => {
      const deleteBtn = document.getElementById("toolbar_icon_delete_1");
      const copyBtn = document.getElementById("toolbar_icon_copy_1");
      const localId = editBtn.getAttribute("localId");

      if (!notesObj[localId]) return;
      // console.log("Not with localId:" + localId + " not found");

      const noteDetails = notesObj[localId];
      const { accountId, startTime, agenda, note, noteStr } = noteDetails;

      // const optionValues = getOptionValuesInMeetingList();

      // if (optionValues.indexOf(localId) == -1) {
      //   renderDropdownInScreenPad();
      // }

      renderDropdownInScreenPad();

      deleteBtn.setAttribute("localId", localId);
      copyBtn.setAttribute("localId", localId);
      setMeetingOption(localId);
      setNoteTitle("note-typing-title-1", agenda);
      setNoteDescription("screen", noteStr);

      // Reset default notepad
      setNoteTitle("note-typing-title-0", "");
      setNoteDescription("default", "");
      removeDefaultNotePadAttributes();

      // It is here to re-filter the selection option

      slideUp("#notes_box");
    };
  }
};

// this function is to add onclick event on delete buttons of each note in the notes section
const noteCardsDeleteButtonsEventListener = (deleteBtns) => {
  for (let i = 0; i < deleteBtns.length; i++) {
    const deleteBtn = deleteBtns[i];

    deleteBtn.addEventListener("click", async (event) => {
      event.stopPropagation();
      try {
        let answer = window.confirm("Are you sure, you want to delete this?");

        if (answer) {
          const localId = deleteBtn.getAttribute("localId");

          if (!localId || localId == "") return; // console.log("There is not local ID!");

          let temp = allNotesInJSON;
          delete temp[localId];
          allNotesInJSON = temp;

          // This function only works here to save all notes
          await popupToBackground("set", { zoomiesNotes: temp });

          // removing the note from the UI
          let card = document.querySelector(`[cardId='${localId}']`);
          if (card) {
            card.remove();
          }

          // if deleted note is same as the one in default notepad
          // clear notepad
          const defaultNotePad = document.getElementById(
            "note-typing-container-default"
          );
          if (localId == defaultNotePad.getAttribute("localId")) {
            setNoteTitle("note-typing-title-0", "");
            setNoteDescription("default", "");
            removeDefaultNotePadAttributes();
          }

          // re-render dropdown again
          renderDropdownInScreenPad();

          const notes = Object.values(allNotesInJSON) || [];
          const sortedNotes = sortNotesByDate(notes);
          populateNotes(sortedNotes, allNotesInJSON);

          console.log(`${localId}-card deleted!`);
        } else {
          console.log("User canceled the delete click!");
        }
      } catch (ex) {
        console.log("noteCardsDeleteButtonsEventListener: ", ex.message);
      }
    });
  }
};

// This function will deal the add new note card click
const addNewNoteCardClick = () => {
  const addNotesButton = document.getElementById("add_notes_card");

  addNotesButton.addEventListener("click", () => {
    // alert("addNotesButton clicked");
    // slideUp("#notes_box");

    // setNoteTitle("note-typing-title-1", "");
    // setNoteDescription("screen", "");

    setNoteTitle("note-typing-title-0", "");
    setNoteDescription("default", "");
    removeDefaultNotePadAttributes();

    // const dropdownList = document.getElementById("meetings-list");
    // dropdownList.value = -1;

    const notes_header = document.getElementById("notes-collapsible-header");
    if (!notes_header.nextElementSibling.classList.contains("open"))
      notes_header.click();

    const noteTitle = document.getElementById("note-typing-title-0");
    noteTitle.focus();

    // console.log("addNewNoteCardClick dropdownList is -1");
  });
};

// This function will tell if there is any content in unsaved notes
const unsavedNoteHasContent = () => {
  if (!allNotesInJSON) {
    return false;
  }

  return Object.keys(allNotesInJSON).length > 0;
};

// this function will add the copy click event
const copyButtonEventListener = (notesObj) => {
  const defaultPadCopyBtn = document.getElementById("toolbar_icon_copy_0");
  const screenPadCopyBtn = document.getElementById("toolbar_icon_copy_1");

  // Copy Button For default notePad
  defaultPadCopyBtn.addEventListener("click", async () => {
    const noteTitle = document.getElementById("note-typing-title-0");
    const noteStr = quillDefault.getText();
    // console.log("copy clicked");
    if (noteTitle || noteStr) {
      try {
        navigator.clipboard.writeText(noteTitle.value + ": " + noteStr || "");
        alert("Copied");
      } catch (error) {
        alert("Copy failed! There is nothing to copy");
      }
    } else {
      alert("Copy failed! There is nothing to copy");
    }
  });

  // Copy Button For expanded notePad
  screenPadCopyBtn.addEventListener("click", async () => {
    const noteTitle = document.getElementById("note-typing-title-1");
    const noteStr = quillScreen.getText();
    // console.log("copy clicked");
    if (noteTitle || noteStr) {
      try {
        navigator.clipboard.writeText(noteTitle.value + ": " + noteStr || "");
        alert("Copied");
      } catch (error) {
        alert("Copy failed! There is nothing to copy");
      }
    } else {
      alert("Copy failed! There is nothing to copy");
    }
  });
};

// This function is to add functionlity on the delete button on top of notepad
const deleteButtonEventListener = () => {
  // Delete Button For default notePad
  const defaultPadDeleteButton = document.getElementById(
    "toolbar_icon_delete_0"
  );
  const defaultPadCopyButton = document.getElementById("toolbar_icon_copy_0");
  defaultPadDeleteButton.addEventListener("click", async () => {
    try {
      let answer = window.confirm("Are you sure, you want to delete this?");

      if (answer) {
        const localId = defaultPadDeleteButton.getAttribute("localId");

        if (!localId || localId == "") return;

        defaultPadDeleteButton.style.display = "none";

        let temp = allNotesInJSON;
        delete temp[localId];

        allNotesInJSON = temp;
        // console.log(allNotesInJSON);

        // This function only works here to save all notes
        await popupToBackground("set", { zoomiesNotes: temp });
        // await loadPreviousNotes();
        // removing the note from the UI
        let card = document.querySelector(`[cardId='${localId}']`);
        if (card) {
          card.remove();
        }

        // load meetings again
        renderDropdownInScreenPad();
        setNoteTitle("note-typing-title-0", "");
        setNoteDescription("default", "");
        removeDefaultNotePadAttributes();

        defaultPadDeleteButton.setAttribute("localId", "");
        defaultPadCopyButton.setAttribute("localId", "");
        defaultPadDeleteButton.style.display = "block";

        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
      }
    } catch (ex) {
      // console.log("deleteButtonEventListener: ", ex.message);
    }
  });

  // Delete Button For screen notePad
  const screenPadDeleteButton = document.getElementById(
    "toolbar_icon_delete_1"
  );
  const screenPadCopyButton = document.getElementById("toolbar_icon_copy_1");
  screenPadDeleteButton.addEventListener("click", async () => {
    try {
      const localId = screenPadDeleteButton.getAttribute("localId");
      if (!localId || localId == "") return;

      const answer = window.confirm("Are you sure, you want to delete this?");
      if (answer) {
        // console.log("Delete item id: ", localId);

        screenPadDeleteButton.style.display = "none";

        let temp = allNotesInJSON;
        delete temp[localId];

        allNotesInJSON = temp;
        // console.log(allNotesInJSON);

        // This function only works here to save all notes
        await popupToBackground("set", { zoomiesNotes: temp });
        // await loadPreviousNotes();
        let card = document.getElementById(`${localId}-card`);
        if (card) {
          card.remove();
        }

        // Set value of meeting to default
        document.getElementById("meetings-list").value = -1;
        // console.log("deleteButtonEventListener dropdownList is -1");

        // load meetings again
        renderDropdownInScreenPad();

        setNoteTitle("note-typing-title-1", "");
        setNoteDescription("screen", "");

        screenPadDeleteButton.setAttribute("localId", "");
        screenPadCopyButton.setAttribute("localId", "");
        screenPadDeleteButton.style.display = "block";

        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
      }
    } catch (ex) {
      // console.log("deleteButtonEventListener: ", ex.message);
    }
  });
};

// this function will set search bar text
const setSearchBarText = (text) => {
  document.getElementById("search-input").value = text;
};

// This function is to set notepad title
const setNoteTitle = (notePadId, text) => {
  document.getElementById(notePadId).value = text;
};

// This function is to set notepad description
const setNoteDescription = (id, text) => {
  if (id == "default") quillDefault.clipboard.dangerouslyPasteHTML(text);
  else if ((id = "screen")) quillScreen.clipboard.dangerouslyPasteHTML(text);
};

// This function is to set selection menu value
const setMeetingOption = (localId) => {
  document.querySelector("#meetings-list").value = localId;
  // console.log(
  //   "setMeetingOption: ",
  //   localId,
  //   " ",
  //   document.querySelector("#meetings-list").value
  // );
  // var selectElement = document.querySelector("#meetings-list");
  // var valueToSet = localId;

  // var optionToSelect = selectElement.querySelector(
  //   "option[value='" + localId + "']"
  // );
  // if (optionToSelect) {
  //   optionToSelect.selected = true;
  // }
};

// This function is to reset the notepad text
const defaultTextBoxOnLoad = () => {
  // console.log("setting notepad empty");
  setNoteTitle("note-typing-title-0", "");
  setNoteDescription("default", "");
  removeDefaultNotePadAttributes();
};

// This function is used to get the selected value in the selection
const getOptionValuesInMeetingList = () => {
  let values = [];
  const dropdownList = document.querySelectorAll("#meetings-list > option");
  if (!dropdownList) {
    return values;
  }

  for (let i = 0; i < dropdownList.length; i++) {
    const option = dropdownList[i];
    values.push(option.value);
  }

  return values;
};

// this function is used to add the + note ui if there is no notes to populate
const showNoNotesBox = () => {
  // console.log("showNoNotesBox");
  const html = `
    <div class="note justify-center align-center cursor-pointer user-none" id="add_notes_card">
      <span class="material-symbols-outlined add_symbol select-none addNote">
          add
      </span>
    </div>
  `;
  document.getElementById("previous-notes").innerHTML = html;
  addNewNoteCardClick();
};

// This function is used to add dropdown functionality
const dropDownJs = () => {
  const dropdownList = document.getElementById("meetings-list");
  const deleteBtn = document.getElementById("toolbar_icon_delete_1");
  const copyBtn = document.getElementById("toolbar_icon_copy_1");

  dropdownList.onchange = async (event) => {
    const selectedItemValue = dropdownList.value;

    if (selectedItemValue == -1) return;

    if (selectedItemValue == 0) {
      const now = new Date();
      const startTime = now.toISOString();
      const agenda = "Untitled";
      const localId = agenda.hashCode();

      const newOption = createUntitledMeetingOption(agenda, localId, startTime);
      dropdownList.appendChild(newOption);
      dropdownList.value = localId;
      setNoteTitle("note-typing-title-1", "");
      setNoteDescription("screen", "");
      deleteBtn.setAttribute("localId", "");
      copyBtn.setAttribute("localId", "");

      return;
    } else {
      const notes = allNotesInJSON;

      // console.log(selectedItemValue);
      // console.log("drop click", notes[selectedItemValue.toString()]);
      // if there is a note stored then add that data
      if (notes[selectedItemValue.toString()]) {
        // console.log("drop click", notes[selectedItemValue]);
        setNoteTitle("note-typing-title-1", notes[selectedItemValue].agenda);
        setNoteDescription("screen", notes[selectedItemValue].noteStr);
        deleteBtn.setAttribute("localId", notes[selectedItemValue].localId);
        copyBtn.setAttribute("localId", notes[selectedItemValue].localId);
      } else {
        // otherwise get the data of selected option and load it
        const selectedOption = dropdownList.options[dropdownList.selectedIndex];
        const agenda = selectedOption.getAttribute("agenda");
        const localId = selectedOption.getAttribute("localId");

        dropdownList.value = localId;
        deleteBtn.setAttribute("localId", localId);
        copyBtn.setAttribute("localId", localId);
        setNoteTitle("note-typing-title-1", agenda);
        setNoteDescription("screen", "");
      }
    }
  };
};

// This function is used to create a new option for select menu
const createUntitledMeetingOption = (agenda, localId, startTime) => {
  const option = document.createElement("option");
  option.setAttribute("agenda", agenda.replace(new RegExp(" ", "g"), "_"));
  option.setAttribute("localId", localId);
  option.setAttribute("startTime", startTime);
  option.setAttribute("isNewMeetingOption", "true");
  option.id = `${localId}-meeting-option`;
  option.value = localId;
  option.innerText = agenda;
  return option;
};

// This function will add the copied text in the quill textbox
const handlePastedText = (notepad, pastedText) => {
  if (pastedText)
    if (notepad == "default") {
      let range = quillDefault.getSelection(true);
      quillDefault.insertText(range.index, pastedText);
      range.index += pastedText.length + 1;
      setTimeout(() => quillScreen.setSelection(range, "user"), 1);
    } else if (notepad == "screen") {
      let range = quillScreen.getSelection(true);
      quillScreen.insertText(range.index, pastedText.toString());
      range.index += pastedText.length + 1;
      setTimeout(() => quillScreen.setSelection(range, "user"), 1);
    }
};

// This function will add the copied image in the quill textbox
const handlePastedImage = (file) => {
  var reader = new FileReader();
  reader.onload = function (event) {
    var imageDataUrl = event.target.result;
    insertImage(imageDataUrl);
  };
  reader.readAsDataURL(file);
};

// This function will add the copied text in the quill textbox
const insertImage = (imageDataUrl) => {
  var range = quillDefault.getSelection(true);
  quillDefault.insertEmbed(range.index, "image", imageDataUrl);
};

const setDefaultNotePadAttributes = (data) => {
  const notePadContainer = document.getElementById(
    "note-typing-container-default"
  );

  const { localId, agenda, startTime, accountId } = data;
  notePadContainer.setAttribute("localId", localId);
  notePadContainer.setAttribute("agenda", agenda);
  notePadContainer.setAttribute("startTime", startTime);
  notePadContainer.setAttribute("accountId", accountId);
};

const getDefaultNotePadAttributes = () => {
  const notePadContainer = document.getElementById(
    "note-typing-container-default"
  );
  return {
    startTime: notePadContainer.getAttribute("startTime"),
    agenda: notePadContainer.getAttribute("agenda"),
    localId: notePadContainer.getAttribute("localId"),
  };
};

const removeDefaultNotePadAttributes = () => {
  const notePadContainer = document.getElementById(
    "note-typing-container-default"
  );
  const deleteBtn = document.getElementById("toolbar_icon_delete_0");
  const copyBtn = document.getElementById("toolbar_icon_copy_0");
  notePadContainer.removeAttribute("localId");
  notePadContainer.removeAttribute("agenda");
  notePadContainer.removeAttribute("startTime");
  notePadContainer.removeAttribute("accountId");
  deleteBtn.removeAttribute("localId");
  copyBtn.removeAttribute("localId");
};

const injectNotesDefaultToScreen = () => {
  if (modalSlidingUp) return;

  const noteHtml = quillDefault.root.innerHTML;
  const noteDetails = getDefaultNotePadAttributes();

  const editableDiv = document.querySelector(".ql-editor");
  const range = document.createRange();
  range.selectNodeContents(editableDiv);

  const dropdownList = document.getElementById("meetings-list");
  const screenNotePadDeleteBtn = document.getElementById(
    "toolbar_icon_delete_1"
  );
  const screenNotePadCopyBtn = document.getElementById(
    "toolbar_icon_copy_1"
  );

  // load previous meetings to add in dropdown
  renderDropdownInScreenPad();

  dropdownList.value = noteDetails.localId;
  screenNotePadDeleteBtn.setAttribute("localId", noteDetails.localId);
  screenNotePadCopyBtn.setAttribute("localId", noteDetails.localId);

  // update screen notepad data
  setNoteTitle(
    "note-typing-title-1",
    noteDetails.agenda == "" || noteDetails.agenda == "Untitled"
      ? ""
      : noteDetails.agenda
  );

  // Setting Notes Screen Description
  if (noteHtml == "<p><br></p>") {
    setNoteDescription("screen", "");
    // If both agenda and note body not exist set the value to -1 to create a new note as untitled
    if (dropdownList.value != -1 && !noteDetails.agenda) dropdownList.value = -1;
    const noteTitle = document.getElementById("note-typing-title-1");
    noteTitle.focus();
  }
  else {
    setNoteDescription("screen", noteHtml);
  }

  removeDefaultNotePadAttributes();

  // reset default notepad data
  setNoteTitle("note-typing-title-0", "");
  setNoteDescription("default", "");

  // show screen notepad
  return slideUp("#notes_box");
}

// This function is to add functionality in the notepad screen
const injectNotesDefaultJs = () => {
  const noteTitle = document.getElementById("note-typing-title-0");
  const deleteBtn = document.getElementById("toolbar_icon_delete_0");
  const copyBtn = document.getElementById("toolbar_icon_copy_0");
  const now = new Date();

  noteTitle.addEventListener("focus", async (event) => {
    event.preventDefault();
    const meetingDetails = getDefaultNotePadAttributes();
    const { localId } = meetingDetails;

    if (!localId) {
      renderDropdownInScreenPad();
      const startTime = now.toISOString();
      const agenda = "";
      const localId = agenda.hashCode();

      setNoteTitle("note-typing-title-0", agenda);
      setDefaultNotePadAttributes({
        localId,
        agenda,
        startTime,
        accountId: null,
      });

      deleteBtn.setAttribute("localId", localId);
      copyBtn.setAttribute("localId", localId);
    }
  });

  noteTitle.addEventListener(
    "input",
    async function () {
      const note = noteTitle.value;
      const noteLength = note.length;

      setNoteTitle("note-typing-title-0", note);

      const meetingDetails = getDefaultNotePadAttributes();
      const { localId, startTime } = meetingDetails;

      setDefaultNotePadAttributes({
        localId: localId,
        agenda: note,
        startTime: startTime,
        accountId: null,
      });

      if (!localId) {
        return;
      } else {
        // console.log(allNotesInJSON);
        allNotesInJSON[localId] = {
          ...meetingDetails,
          noteStr: quillDefault.root.innerHTML,
          agenda: note == "" ? "Untitled" : note,
        };

        // console.log(allNotesInJSON);
        await saveNotes(allNotesInJSON);
        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
      }
    },
    false
  );

  quillDefault.on("text-change", async function (delta, oldDelta, source) {
    if (modalSlidingUp) return;

    const text = quillDefault.getText();
    const noteHtml = quillDefault.root.innerHTML;
    const noteDetails = getDefaultNotePadAttributes();

    const editableDiv = document.querySelector(".ql-editor");
    const range = document.createRange();
    range.selectNodeContents(editableDiv);

    // Get the height of the first two lines of the content
    const firstTwoLinesHeight = range.getBoundingClientRect().height;
    // Get the height of the whole content
    const contentHeight = 68;

    // Here if box height exceeds 68 or text size exceeds 70 or there is an image
    // in these mutiple cases screen notepad will open
    const popupCondition =
      Math.ceil(firstTwoLinesHeight) >= contentHeight ||
      text.length >= 70 ||
      noteHtml.toString().includes("<img");

    if (noteHtml == "<p><br></p>") return;

    const { localId } = noteDetails;

    // if there is not localid then create new
    if (!localId) {
      // console.log("LocalId not exist")
      const startTime = now.toISOString();
      const agenda = "Untitled";
      const localId = agenda.hashCode();

      // Save new note data
      const newNoteDetails = {
        startTime: startTime,
        agenda: agenda,
        localId: localId,
      };

      // If there is no localId and and image is added in the note
      // shift to screen notepad
      if (popupCondition) {
        // console.log("Popup Condition met")
        const dropdownList = document.getElementById("meetings-list");
        const screenNotePadDeleteBtn = document.getElementById(
          "toolbar_icon_delete_1"
        );
        const screenNotePadCopyBtn = document.getElementById(
          "toolbar_icon_copy_1"
        );

        allNotesInJSON[localId] = {
          ...newNoteDetails,
          noteStr: noteHtml,
        };

        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
        await saveNotes(allNotesInJSON);

        // load previous meetings to add in dropdown
        renderDropdownInScreenPad();

        // add meetings to the dropdown
        renderDropdownInScreenPad();

        // set values to attributes
        dropdownList.value = localId;
        screenNotePadDeleteBtn.setAttribute("localId", localId);
        screenNotePadCopyBtn.setAttribute("localId", localId);

        // update screen notepad data
        setNoteTitle("note-typing-title-1", agenda);
        setNoteDescription("screen", noteHtml);

        // reset default notepad data
        setNoteTitle("note-typing-title-0", "");
        setNoteDescription("default", "");

        // show screen notepad
        return slideUp("#notes_box");
      } else {
        // console.log("Popup Condition not met")
        // set values to default notepad
        setDefaultNotePadAttributes({
          localId,
          agenda,
          startTime,
          accountId: null,
        });
        deleteBtn.setAttribute("localId", localId);
        copyBtn.setAttribute("localId", localId);
        setNoteTitle("note-typing-title-0", "");

        allNotesInJSON[localId] = {
          ...newNoteDetails,
          noteStr: noteHtml,
        };
        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
        await saveNotes(allNotesInJSON);
      }
    } else {
      // console.log("LocalId exist")
      // If there is localId and an image is added in the note or text len is 87
      // shift to screen notepad
      if (popupCondition) {
        // console.log("Popup Condition met")
        const dropdownList = document.getElementById("meetings-list");
        const screenNotePadDeleteBtn = document.getElementById(
          "toolbar_icon_delete_1"
        );
        const screenNotePadCopyBtn = document.getElementById(
          "toolbar_icon_copy_1"
        );

        // load previous meetings to add in dropdown
        renderDropdownInScreenPad();

        dropdownList.value = noteDetails.localId;
        screenNotePadDeleteBtn.setAttribute("localId", noteDetails.localId);
        screenNotePadCopyBtn.setAttribute("localId", noteDetails.localId);

        // update screen notepad data
        setNoteTitle(
          "note-typing-title-1",
          noteDetails.agenda == "" || noteDetails.agenda == "Untitled"
            ? ""
            : noteDetails.agenda
        );
        setNoteDescription("screen", noteHtml);
        removeDefaultNotePadAttributes();

        // reset default notepad data
        setNoteTitle("note-typing-title-0", "");
        setNoteDescription("default", "");

        // show screen notepad
        return slideUp("#notes_box");
      } else {
        // console.log("Popup Condition not met")
        // save the note attached to meeting
        allNotesInJSON[localId] = {
          ...noteDetails,
          agenda: noteDetails.agenda == "" ? "Untitled" : noteDetails.agenda,
          noteStr: noteHtml,
        };

        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
        await saveNotes(allNotesInJSON);
      }
    }
  });

  quillDefault.root.addEventListener("paste", async function (event) {
    let clipboardData = event.clipboardData || window.clipboardData;

    // Check if the clipboard data contains an image
    if (clipboardData && clipboardData.items) {
      let items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          let file = items[i].getAsFile();

          // Handle the pasted image file
          handlePastedImage(file);

          const notePadDetails = getDefaultNotePadAttributes();
          const { localId } = notePadDetails;

          const noteHtml = quillDefault.root.innerHTML;
          if (!localId) {
            return;
          } else {
            allNotesInJSON[localId] = {
              ...notePadDetails,
              noteStr: noteHtml,
            };
            await saveNotes(allNotesInJSON);
            const notes = Object.values(allNotesInJSON) || [];
            const sortedNotes = sortNotesByDate(notes);
            populateNotes(sortedNotes, allNotesInJSON);
          }
          event.preventDefault();
          return;
        }
      }
    }

    // Handle plain text paste
    let pastedText = clipboardData.getData("text/plain");
    handlePastedText("default", pastedText);
    event.preventDefault();
  });

  quillScreen.root.addEventListener("paste", async function (event) {
    let clipboardData = event.clipboardData || window.clipboardData;

    // Check if the clipboard data contains an image
    if (clipboardData && clipboardData.items) {
      let items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          let file = items[i].getAsFile();

          // Handle the pasted image file
          handlePastedImage(file);

          const dropdownList = document.getElementById("meetings-list");
          const selectedOption = dropdownList.value;

          const notePadDetails = getAttributesFromMeetingOption([
            dropdownList[selectedOption],
          ]);
          const { localId } = notePadDetails;

          const noteHtml = quillDefault.root.innerHTML;
          if (!localId) {
            return;
          } else {
            allNotesInJSON[localId] = {
              ...notePadDetails,
              noteStr: noteHtml,
            };
            await saveNotes(allNotesInJSON);
            const notes = Object.values(allNotesInJSON) || [];
            const sortedNotes = sortNotesByDate(notes);
            populateNotes(sortedNotes, allNotesInJSON);
          }
          event.preventDefault();
          return;
        }
      }
    }

    // Handle plain text paste
    let pastedText = clipboardData.getData("text/plain");
    handlePastedText("screen", pastedText);

    event.preventDefault();
  });
};

// This function is to add functionality in the notepad screen
const injectNotesScreenJs = () => {
  const noteTitle = document.getElementById("note-typing-title-1");
  const dropdownList = document.getElementById("meetings-list");
  const deleteBtn = document.getElementById("toolbar_icon_delete_1");
  const copyBtn = document.getElementById("toolbar_icon_copy_1");
  const now = new Date();

  noteTitle.addEventListener("focus", async (event) => {
    event.preventDefault();
    // console.log("noteTitle focused");

    const selectedItemValue = dropdownList.value;
    if (selectedItemValue == -1) {
      renderDropdownInScreenPad();
      const startTime = now.toISOString();
      const agenda = "Untitled";
      const localId = agenda.hashCode();

      const newOption = createUntitledMeetingOption(agenda, localId, startTime);
      dropdownList.appendChild(newOption);
      dropdownList.value = localId;
      deleteBtn.setAttribute("localId", localId);
      copyBtn.setAttribute("localId", localId);
    }
  });

  noteTitle.addEventListener(
    "input",
    async function () {
      const note = noteTitle.value;
      const noteLength = note.length;
      const selectedOption = dropdownList.options[dropdownList.selectedIndex];
      const noteHtml = quillScreen.root.innerHTML;

      const meetingDetails = getAttributesFromMeetingOption(selectedOption);
      const { localId } = meetingDetails;

      setOptionTitle(localId, note == "" ? "Untitled" : note);
      setNoteTitle("note-typing-title-1", note);

      if (!localId) {
        return;
      } else {
        // console.log(allNotesInJSON);
        allNotesInJSON[localId] = {
          ...meetingDetails,
          noteStr: noteHtml,
          agenda: note == "" ? "Untitled" : note,
        };

        // console.log(allNotesInJSON);
        await saveNotes(allNotesInJSON);
        const notes = Object.values(allNotesInJSON) || [];
        const sortedNotes = sortNotesByDate(notes);
        populateNotes(sortedNotes, allNotesInJSON);
      }
    },
    false
  );

  quillScreen.on("text-change", async function (delta, oldDelta, source) {
    const dropdownList = document.getElementById("meetings-list");
    let selectedOption = dropdownList.options[dropdownList.selectedIndex];
    const selectedItemValue = dropdownList.value;
    // console.log("Drop Down: ", dropdownList)
    // console.log("Selected Item: ", selectedItemValue)
    const noteHtml = quillScreen.root.innerHTML;
    // console.log("Selected Option: ", selectedOption, selectedItemValue)
    if (selectedItemValue == -1 || !selectedOption) {
      // console.log("SelectedValue", selectedItemValue)
      const startTime = now.toISOString();
      const agenda = "Untitled";
      const localId = agenda.hashCode();
      const newOption = createUntitledMeetingOption(agenda, localId, startTime);
      renderDropdownInScreenPad();
      dropdownList.appendChild(newOption);
      dropdownList.value = localId;
      deleteBtn.setAttribute("localId", localId);
      copyBtn.setAttribute("localId", localId);
      setNoteTitle(
        "note-typing-title-1",
        agenda == "" || agenda == "Untitled" ? "" : agenda
      );
      // if (selectedItemValue == -1)
      // setNoteDescription("screen", "");
      selectedOption = dropdownList.options[dropdownList.selectedIndex];
    }

    // console.log("Selected Option2: ", selectedOption, selectedItemValue)
    if (noteHtml == "<p><br></p>") return;

    // if (!selectedOption) {
    //   selectedOption = dropdownList.options[dropdownList.selectedIndex];

    // }
    const meetingDetails = getAttributesFromMeetingOption(selectedOption);
    const { localId } = meetingDetails;

    if (!localId) {
      // console.log("LocalId not exist")
      return;
    } else {
      allNotesInJSON[localId] = {
        ...meetingDetails,
        noteStr: noteHtml,
      };
      const notes = Object.values(allNotesInJSON) || [];
      const sortedNotes = sortNotesByDate(notes);
      populateNotes(sortedNotes, allNotesInJSON);
      await saveNotes(allNotesInJSON);
    }
  });

  quillScreen.root.addEventListener("paste", async function (event) {
    const dropdownList = document.getElementById("meetings-list");
    const selectedOption = dropdownList.options[dropdownList.selectedIndex];

    var clipboardData = event.clipboardData || window.clipboardData;

    // Check if the clipboard data contains an image
    if (clipboardData && clipboardData.items) {
      var items = clipboardData.items;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          var file = items[i].getAsFile();

          // Handle the pasted image file
          handlePastedImage(file);
          const meetingDetails = getAttributesFromMeetingOption(selectedOption);
          const { localId } = meetingDetails;

          const noteHtml = quillDefault.root.innerHTML;
          if (!localId) {
            return;
          } else {
            allNotesInJSON[localId] = {
              ...meetingDetails,
              noteStr: noteHtml,
            };
            await saveNotes(allNotesInJSON);
            const notes = Object.values(allNotesInJSON) || [];
            const sortedNotes = sortNotesByDate(notes);
            populateNotes(sortedNotes, allNotesInJSON);
          }
          event.preventDefault();
          return;
        }
      }
    }

    // Handle plain text paste
    var pastedText = clipboardData.getData("text/plain");
    handlePastedText(pastedText);
    event.preventDefault();
  });
};

// This function will set the select option title in notepad screen
const setOptionTitle = (id, title) => {
  let option = document.getElementById(id + "-meeting-option");
  option.innerText = title;
  option.setAttribute("agenda", title);
};

// This function is to extract the note data from the active selection option
const getAttributesFromMeetingOption = (option) => {
  return {
    accountId: option?.getAttribute("accountId"),
    localId: option.getAttribute("localId"),
    agenda: option.getAttribute("agenda")?.replace(/_/g, " "),
    startTime: option.getAttribute("startTime"),
  };
};

const setHoverEffects = () => {
  const collapsibles = document.getElementsByClassName("collapsibleMeetings");
  const collapsibleHeader = document.getElementsByClassName("collapsibleMeetingsHeader");
  const collapsibleContent = document.getElementsByClassName("collapsible-content");

  for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener('mouseenter', () => {

      gsap.to([collapsibles, collapsibleHeader, collapsibleContent], {duration:0.2,backgroundColor:"black"});
      console.log("working");
    });

    collapsibles[i].addEventListener('mouseleave', () => {
      gsap.set([collapsibles, collapsibleHeader, collapsibleContent], {backgroundColor:""});
    });
  }
};

// setHoverEffects();



// This function is used to start a timer invterval to save notes every 5 seconds
const saveUnsavedNotesInIntervals = () => {
  setInterval(async () => {
    await saveNotes(allNotesInJSON);
  }, 5 * 1000);
};

// This function is used to save notes in the local storage
const saveNotes = async (notesOjb) => {
  try {
    const notesToSave = JSON.parse(JSON.stringify(notesOjb));

    for (let localId in notesToSave) {
      const noteDetails = notesToSave[localId];
      if (!noteDetails) {
        return;
      }

      // const { meetingDetails, note, noteStr } = noteDetails;
      await popupToBackground("upsert", {
        key: "zoomiesNotes",
        id: localId,
        data: {
          ...noteDetails,
        },
      });
    }
  } catch (e) {
    // .log("saveNotes:", e.message);
  }
};

// This function is used to save notes when the webpage loads
const saveNoteBeforePageRefresh = () => {
  window.onbeforeunload = function (event) {
    saveNotes(allNotesInJSON);
  };
};

const easeMaster = "back.out(.35)";
const easeDur = 0.45;

// this function starts the slideUp animation
const slideUp = (id) => {
  const box = document.querySelector(id);
  gsap.to(box, {
    ease: easeMaster,
    duration: easeDur,
    top: 0,
    onStart: () => {
      box.style.display = "flex";
      modalSlidingUp = true;
    },
    onComplete: () => {
      // console.log("complete", id);
      modalSlidingUp = false;

      // here if screen pad is opened then as animation completes autofocus the
      // pointer
      if (id == "#notes_box") {
        if (quillScreen.hasFocus()) {
          // console.log("editor is focuesd");
        } else {
          // console.log("editor is not focuesd");

          // This is to ensure that there is not text left behind in the old box
          setNoteTitle("note-typing-title-0", "");
          setNoteDescription("default", "");
          removeDefaultNotePadAttributes();

          // setting editor pointer to the end of text
          const totalLength = quillScreen.getLength();
          quillScreen.setSelection(totalLength);
          quillScreen.focus();
        }
      }
    },
  });
};

// this function starts the slideDown animation
const slideDown = (id) => {
  const box = document.querySelector(id);
  gsap.to(box, {
    ease: easeMaster,
    duration: easeDur,
    top: window.innerHeight,
    onComplete: () => {
      box.style.display = "none";
      if (id == "#notes_box") {
        setNoteTitle("note-typing-title-1", "");
        setNoteDescription("screen", "");
      }
    },
  });
};

const bootNotes = async () => {
  try {
    // console.log("-------Booting Notes---------");

    if (count == 0) {
      let backArrow = document.getElementById("arrow_back_ios");
      backArrow.style.opacity = 0.1;
    }
    //  initialzie quill js
    quillDefault = new Quill("#note-typing-description-default", {
      modules: {
        imageResize: {
          displaySize: true, // default false
        },
        toolbar: [
          ["bold", "italic", "underline"],
          ["image"],
          [{ list: "bullet" }, { list: "ordered" }],
        ],
      },
      // placeholder: "Start here...",
      theme: "snow", // or 'bubble'
    });

    quillScreen = new Quill("#note-typing-description-screen", {
      modules: {
        imageResize: {
          displaySize: true, // default false
        },
        toolbar: [
          ["bold", "italic", "underline"],
          ["image"],
          [{ list: "bullet" }, { list: "ordered" }],
        ],
      },
      // placeholder: "Start here...",
      theme: "snow", // or 'bubble'
    });

    const quillToolbars = document.querySelectorAll(".ql-toolbar");
    quillToolbars.forEach((bar, index) => {
      const titleContainer = document.createElement("div");

      //fading in note title
      titleContainer.innerHTML = `<input
        type="text"
        class="note-typing-title"
        id="note-typing-title-${index}"
        value="untitled"
        edit-mode="no"
        placeholder="untitled"
        />`;

      // Create a new child element
      const newChild = document.createElement("span");
      newChild.innerHTML = `<div class="display-flex flex-row align-center ml-2">
  
                                <div id="toolbar_icon_copy_${index}" class="cursor-pointer select-none ml-2 ">
                                  <span class="material-symbols-outlined copy"> content_copy </span>
                                  </div>

                                  <div id="toolbar_icon_delete_${index}" class="cursor-pointer select-none">
                                  <span class="material-symbols-outlined trash"> delete </span>
                                  </div>
                            </div>
                            `;

      newChild.classList.add("ql-formats");

      // If notepad is default set ml
      if (index == 0) newChild.style.marginLeft = "68px";
      // If notepad is screen set ml
      else if (index == 1) newChild.style.marginLeft = "75px";

      newChild.style.marginRight = "0px";
      newChild.style.alignSelf = "flex-end";
      bar.appendChild(newChild);
      // Append the child element to the div
      let notesEditorContainer = bar.parentNode;
      notesEditorContainer.insertBefore(titleContainer, bar.nextSibling);
    });

    // Load meetings at boot time and save in global variable
    meetingsGlobalVar = await getMeetingsFromBackgroundWorker(
      currentDateGlobalVarible,
      true
    );
    // Then load data
    renderDropdownInScreenPad();
    await loadPreviousNotes();

    // Then add actions to ui
    dropDownJs();
    injectNotesDefaultJs();
    injectNotesScreenJs();

    copyButtonEventListener(allNotesInJSON);
    deleteButtonEventListener();

    // the deal the rest
    await dealBrowserEvents();

    await showCurrentDateDayYear();
    addDateIncrementDecrementListeners();

    // Create a master timeline
    const master = gsap.timeline();
    // Here we are animating the sidebar contents with GSAP

    master.pause();

    var dur = 0.6;

    //content on open
    // Register the "move" effect
    gsap.registerEffect({
      name: "move",
      effect: (targets, config) => {
        return gsap.fromTo(
          targets,
          { duration: dur, opacity: 0, y: 0 },
          { y: 0, opacity: 1, delay: 0 }
        );
      },
      defaults: { duration: 0.15 },
      extendTimeline: true,
    });

    // Register the "move" effect
    // gsap.registerEffect({
    //   name: "move_left",
    //   effect: (targets, config) => {
    //     return gsap.fromTo(
    //       targets,
    //       { duration: config.duration, opacity: 0, x: 100 },
    //       { x: 0, opacity: 1, delay: 0 },
    //       0.2
    //     );
    //   },
    //   defaults: { duration: 0.25 },
    //   extendTimeline: true,
    // });

    gsap.registerEffect({
      name: "moveBottomToTop",
      effect: (targets, config) => {
        return gsap.fromTo(
          targets,
          { duration: config.duration, opacity: 0, y: 20 },
          { y: 0, opacity: 1, delay: 0 }
        );
      },
      defaults: { duration: 0.15 },
      extendTimeline: true,
    });

    // Add elements to the master timeline
    master.add(gsap.effects.move(".section_horiz"), 0);
    master.add(gsap.effects.move(".section_vert"), 0); //header
    master.add(gsap.effects.move(".collapsible"), 0); //main content

    // Receiving PostMessage from sideBar.js
    window.addEventListener("message", function (event) {
      // Called when toggle

      if (event.data.type === "toggleSidebar" && event.data.toggleState) {
        // console.log("Received message from parent.", event.data);
        master
          .seek(0)
          .play()
          .eventCallback("onComplete", () => {
            const noteTitle = document.getElementById("note-typing-title-0");
            noteTitle.focus();
          });
      } else if (
        event.data.type === "toggleSidebar" &&
        !event.data.toggleState
      ) {
        master.reversed(!master.reversed());
        // console.log("Received message from parent.", event.data);
      }
    });

    const toggleCollapsible = (event) => {
      const clickedHeader = event.target;
      const clickHeaderId = clickedHeader.getAttribute("id");

      // If the expand button in notes is clicked do this
      if (
        clickedHeader.tagName == "IMG" &&
        clickedHeader.id == "expand-notes"
      ) {

        injectNotesDefaultToScreen()

        return;
      }

      const clickedContent = clickedHeader.nextElementSibling;
      clickedHeader.parentNode;

      const clickedParent = clickedHeader.parentNode;
      const closeIcon =
        clickedHeader.getElementsByClassName("meetings_nav_icon")[0];

      const isOpen = clickedContent.classList.contains("open");
      const isHalfOpen = clickedContent.classList.contains("half-open");
      const isClosed = clickedContent.classList.contains("closed");

      if (isHalfOpen) {
        // Close all other headers
        collapsibleHeaders.forEach((header) => {
          if (header !== clickedHeader) {
            const content = header.nextElementSibling;
            const headerParent = header.parentNode;
            const contentCloseIcon =
              header.getElementsByClassName("meetings_nav_icon")[0];
            contentCloseIcon.src =
              "../assets/expand_more_FILL0_wght400_GRAD0_opsz48.png";

            content.style.display = "none"; // No need For hidding content as we are doing flex-0
            content.classList.remove("open");
            content.classList.remove("half-open");
            content.classList.add("closed");

            if (contentCloseIcon.classList.contains("rotate-180"))
              contentCloseIcon.classList.remove("rotate-180");
            contentCloseIcon.classList.add("rotate-0");

            headerParent.classList.remove("flex-1");
            headerParent.classList.add("flex-0");
          }
        });

        // Open clicked

        // If the clicked header is notes one show the note, otherwise hide id
        if (clickHeaderId == "notes-collapsible-header") {
          document.getElementById("previous-notes").style.display = "flex";
          document.getElementById("add_notes").classList.add("nav_button_active")
        }
        else {
          document.getElementById("previous-notes").style.display = "none";
          document.getElementById("video_call").classList.add("nav_button_active")
        }

        clickedContent.style.display = "flex";
        // clickedContent.previousElementSibling.style.pointerEvents = "none";

        // // Here adjust gsap to update animation
        // // gsap.fromTo(
        // //   clickedContent,
        // //   { height: 0 },
        // //   { height: "100%", duration: 0 }
        // // );

        // gsap.fromTo(
        //   clickedContent,
        //   { opacity: 0, height: 100 },
        //   {
        //     duration: 0,
        //     opacity: 1,
        //     height: "100%",
        //     onComplete: () =>
        //     (clickedContent.previousElementSibling.style.pointerEvents =
        //       "all"),
        //   }
        // );

        clickedContent.classList.add("open");
        clickedContent.classList.remove("half-open");

        closeIcon.src = "../assets/expand_more_FILL0_wght400_GRAD0_opsz48.png";

        if (closeIcon.classList.contains("rotate-0"))
          closeIcon.classList.remove("rotate-0");
        closeIcon.classList.add("rotate-180");

        clickedParent.classList.remove("flex-0");
        clickedParent.classList.add("flex-1");
      } else if (isOpen) {
        // if clicked it already opened then revert back to 50-50 module
        // Open others
        collapsibleHeaders.forEach((header) => {
          if (header !== clickedHeader) {
            const content = header.nextElementSibling;
            const headerParent = header.parentNode;
            const contentHeader = header.previousSibling;

            content.style.display = "flex";
            content.classList.add("half-open");
            content.classList.remove("open");
            content.classList.remove("closed");
            // content.previousElementSibling.style.pointerEvents = "none";

            // // Here adjust gsap to update animation
            // gsap.fromTo(
            //   content,
            //   {
            //     height: 0,
            //   },
            //   {
            //     height: "100%",
            //     duration: 0,
            //   }
            // );

            // gsap.fromTo(
            //   content,
            //   {
            //     opacity: 0,
            //   },
            //   {
            //     duration: 0,
            //     opacity: 1,
            //     onComplete: () =>
            //       (content.previousElementSibling.style.pointerEvents = "all"),
            //   }
            // );

            const contentCloseIcon =
              header.getElementsByClassName("meetings_nav_icon")[0];
            contentCloseIcon.src =
              "../assets/expand_all_FILL0_wght400_GRAD0_opsz48.png";

            if (contentCloseIcon.classList.contains("rotate-0"))
              contentCloseIcon.classList.remove("rotate-0");
            contentCloseIcon.classList.add("rotate-180");

            headerParent.classList.remove("flex-0");
            headerParent.classList.add("flex-1");
          }
        });

        closeIcon.src = "../assets/expand_all_FILL0_wght400_GRAD0_opsz48.png";

        clickedContent.classList.add("half-open");
        clickedContent.classList.remove("open");
        clickedContent.classList.remove("closed");

        document.getElementById("video_call").classList.remove("nav_button_active")
        document.getElementById("add_notes").classList.remove("nav_button_active")
      } else if (isClosed) {
        // if clicked it already closed then revert back to 50-50 module

        // Ajust classes from others
        collapsibleHeaders.forEach((header) => {
          if (header !== clickedHeader) {
            const content = header.nextElementSibling;
            const headerParent = header.parentNode;
            const contentHeader = header.previousSibling;

            content.style.display = "flex";
            content.classList.add("half-open");
            content.classList.remove("open");
            content.classList.remove("closed");
            content.previousElementSibling.style.pointerEvents = "none";

            gsap.fromTo(
              content,
              {
                height: 0,
              },
              {
                height: "100%",
                duration: 0,
              }
            );

            gsap.fromTo(
              content,
              {
                opacity: 0,
              },
              {
                duration: 0,
                opacity: 1,
                onComplete: () =>
                  (content.previousElementSibling.style.pointerEvents = "all"),
              }
            );

            const contentCloseIcon =
              header.getElementsByClassName("meetings_nav_icon")[0];
            if (contentCloseIcon.classList.contains("rotate-0"))
              contentCloseIcon.classList.remove("rotate-0");
            contentCloseIcon.classList.add("rotate-180");

            contentCloseIcon.src =
              "../assets/expand_all_FILL0_wght400_GRAD0_opsz48.png";
            headerParent.classList.remove("flex-0");
            headerParent.classList.add("flex-1");
          }
        });

        closeIcon.src = "../assets/expand_all_FILL0_wght400_GRAD0_opsz48.png";

        // Open This one
        clickedContent.style.display = "flex";
        clickedContent.classList.add("half-open");
        clickedContent.classList.remove("open");
        clickedContent.classList.remove("closed");

        clickedParent.classList.remove("flex-0");
        clickedParent.classList.add("flex-1");

        document.getElementById("video_call").classList.remove("nav_button_active")
        document.getElementById("add_notes").classList.remove("nav_button_active")
      }
    };

    const toggle = (e) => {
      toggleCollapsible(e);
      // const noteTitle = document.getElementById("note-typing-title-0");
      // noteTitle.focus();
    };

    collapsibleHeaders.forEach((header) => {
      header.addEventListener("click", toggle);
      header.childNodes[1].addEventListener("click", () => {
        header.click();
      });
    });

    // Feedback Listener
    document.getElementById("refresh-data-feedback").addEventListener("click", () => {
      // window.alert("You are now closing the extension and hiding its open/close tab. To reopen it, click on the Portd icon located in the Extension Drop Down menu. ");\
   console.log();
      reportProblem();  

      browserApi.tabs.create({ url: "mailto:support@portd.io" });
        window.close();

    });

    // hide extension
    const hideButton = document.getElementById("hide_extension");
    const hideIcon = document.getElementById("report-problem");
    hideButton.addEventListener("click", async () => {
      // refershIcon.classList.add("refresh-icon-rotate");
      window.alert(
        
        "You are now closing the extension and hiding its open/close tab. To reopen it, click on the Portd icon located in the Extension Drop Down menu or refresh the page. ");
      window.parent.postMessage(
        { type: "hideExtension", extensionVisibleState: false },
        "*"
      );

    });




    //hover effects on modules







  } catch (ex) {
    // console.log("Error->bootNotes: ", ex);
  }

    // Hide Extension Listener
    // document.getElementById("hide_extension").addEventListener("click", () => {

      // window.alert("You are now closing the extension and hiding its open/close tab. To reopen it, click on the Portd icon located in the Extension Drop Down menu. ");
      // window.parent.postMessage(
      //   { type: "hideExtension", extensionVisibleState: false },
      //   "*"
      // );
    // });

};

bootNotes();
