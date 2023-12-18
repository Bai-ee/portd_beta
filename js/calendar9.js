const refreshingFooter = (show) => {
  if (show) {
    document.getElementById("refreshing-footer").style.display = "block";
  } else {
    document.getElementById("refreshing-footer").style.display = "none";
  }
};

const showLoadingView = () => {
  document.getElementById("loader-div").style.display = "flex";
  document.getElementById("no-meetings-div").style.display = "none";
  document.getElementById("meetings-div").style.display = "none";
};

const hideLoadingView = () => {
  document.getElementById("loader-div").style.display = "none";
};

const showMeetingCardsView = () => {
  document.getElementById("loader-div").style.display = "none";
  document.getElementById("meetings-div").style.display = "flex";
  document.getElementById("no-meetings-div").style.display = "none";
};

const showCreateMeetingView = () => {
  document.getElementById("loader-div").style.display = "none";
  document.getElementById("meetings-div").style.display = "none";
  document.getElementById("no-meetings-div").style.display = "flex";
};

// This function show the create event UI
const showNoMeetingsView = () => {
  showCreateMeetingView();
  let goToCreateEvent = document.getElementById("create_event_link");
  if (goToCreateEvent)
    goToCreateEvent.addEventListener("click", () => {
      // this function is on notes.js
      showCreateEventsUI();
    });

  let title = document.getElementById("meetings-collapsible-title");
  title.innerHTML = "No Meetings";
  showMeetingsUI();
};

// https://outlook.live.com/calendar/deeplink/read/AQMkADAwATMwMAItMWMwZi00ZWI4LTAwAi0wMAoARgAAA5I13vji71ZJuxZQK6J6Fn0HAHD4fog774BNu2CB5%2FrFZncAAAIBDQAAAHD4fog774BNu2CB5%2FrFZncABEhxcQB2AAAA?login_hint=haseebshah936b%40gmail.com
// https://www.google.com/calendar/u/haseebshah936@gmail.com/event?eid=NGlia21uaTBkNXZjbG41OWVwMnBhY2locjIgaGFzZWVic2hhaDkzNkBt

const generateMeetingsHtml = (meetings = []) => {
  let meetingsHtml = "";
  try {
    if (!(meetings && meetings.length)) {
      // console.log("no meetings to generate html");
      return null;
    }
    // meetings.map
    const reversedMeetings = [...meetings].reverse();
    reversedMeetings.map((meeting, index) => {
      meetingsHtml += `
                        <div class="meeting_card cursor-pointer ${
                          moment(meeting.startTime).isBefore(moment())
                            ? "meeting_card_disabled"
                            : ""
                        }" localId="${meeting.localId}" id="${
        meeting.localId
      }" accountId="${meeting.accountId}" dataLink="${
        meeting.eventHtmlLink || ""
      }">
                          <div class="display-flex flex-col ml-3">
                            <div id="" class="cont_vert">
                              <div class="cont_horiz">
                                <h4 id="meeting_title" class="text_date">${meeting.agenda
                                  .toString()
                                  .trim()}</h4>
                              </div>

                              <div class="display-flex flex-row justify-start align-center mt-2">
                                <span class="material-symbols-outlined clock_icon" id="clock_icon">
                                  schedule
                                </span>
                                <h3 id="meeting_time" class="meeting_time" style="margin-left: 5px">
                                  ${moment(meeting.startTime).format("LT")}
                                </h3>
                              </div>
                            </div>
                          </div>
      `;
      if (meeting.link?.length > 0) {
        meetingsHtml += `
              <div class="display-flex flex-row justify-center align-center mr-3">
                <div id="${
                  "meeting_video_clickout_" + meeting.localId
                }" class=" meeting_card_icon">
                <img src="../assets/video.png" style="height:15px !important; width:18px  !important;"/>
                <p style="font-size: 8px" class="mt-1">Meet</p>
                </div> 
                
                <div id="${
                  "meeting_note_clickout_" + meeting.localId
                }" class=" meeting_card_icon">
                    <img src="../assets/note_edit.png" style="height:15px !important; width:15px  !important;"/>
                    <p style="font-size: 8px" class="mt-1">Attach Note</p>
                    </div>
              </div>
            </div>
                      `;
      } else {
        meetingsHtml += `
                <div class="display-flex flex-row justify-center align-center mr-3">
                <div id="${
                  "meeting_note_clickout_" + meeting.localId
                }" class=" meeting_card_icon">
                  <img src="../assets/note_edit.png" style="height:15px  !important; width:15px  !important;  "/>
                  <p style="font-size: 8px" class="mt-1">Attach Note</p>
                </div>
              </div>
            </div>
            `;
      }
    });

    meetingsHtml =
      meetingsHtml +
      `<button id="video_call_new_meetings_card" class="new_meetings_card display-flex" style="width:97.5%">
      <img src="../assets/calendar.png" class="meetings_nav_icon" />
      <p class="mt-1">New Meeting</p>
    </button>`;

    for (i = 1; i <= 4 - meetings.length; i++) {
      meetingsHtml =
        meetingsHtml +
        `<img src="../assets/empty_div.png" class="empty_div" />`;
    }

    // console.log(meetingsHtml);
    return meetingsHtml;
  } catch (e) {
    return meetingsHtml;
  }
};

const addEventListenerForMeetings = (meetings) => {
  if (!(meetings && meetings.length)) {
    return;
  }

  meetings.map((meeting, index) => {
    if (meeting.link?.length > 0) {
      let videoCallElement = document.getElementById(
        "meeting_video_clickout_" + meeting.localId
      );
      videoCallElement.addEventListener("click", () => {
        window.open(meeting.link);
      });
    }

    let noteElement = document.getElementById(
      "meeting_note_clickout_" + meeting.localId
    );

    // console.log(noteElement);
    noteElement.addEventListener("click", () => {
      const localId = meeting.localId;
      const dropdownList = document.getElementById("meetings-list");
      // if (dropdownList.value == localId) {
      //   return slideUp("#notes_box");
      // }

      // console.log("addEventListenerForMeetings", allNotesInJSON);

      //  No note found in storage, so create a new note for that meeting
      if (!allNotesInJSON[localId]) {
        const deleteBtn1 = document.getElementById("toolbar_icon_delete_0");
        const noteTitle = document.getElementById("note-typing-title-0");
        const copyBtn1 = document.getElementById("toolbar_icon_copy_0");
        const notes_header = document.getElementById(
          "notes-collapsible-header"
        );

        setDefaultNotePadAttributes({
          localId: localId,
          agenda: meeting.agenda,
          startTime: meeting.startTime,
          accountId: meeting.accountId,
        });

        deleteBtn1.setAttribute("localId", localId);
        copyBtn1.setAttribute("localId", localId);

        setNoteTitle("note-typing-title-0", meeting.agenda);
        setNoteDescription("default", "");
        if (!notes_header.nextElementSibling.classList.contains("open"))
          notes_header.click();

        noteTitle.focus();

        return; // console.log("Not with localId:" + localId + " not found");
      } else {
        const deleteBtn1 = document.getElementById("toolbar_icon_delete_1");
        const copyBtn1 = document.getElementById("toolbar_icon_copy_1");

        const noteDetails = allNotesInJSON[localId];
        const { accountId, startTime, agenda, note, noteStr } = noteDetails;

        deleteBtn1.setAttribute("localId", localId);
        copyBtn1.setAttribute("localId", localId);
        dropdownList.value = localId;
        // setMeetingOption(localId);
        setNoteTitle("note-typing-title-1", agenda);
        setNoteDescription("screen", noteStr);
        slideUp("#notes_box");
      }
    });
  });
};

const addBindingsForDynamicHtmlElements = () => {
  if (document.getElementById("report-problem")) {
    document.getElementById("report-problem").onclick = reportProblem;
  }

  if (document.getElementsByClassName("join-btn")) {
    const joinButtons = document.querySelectorAll(".join-btn");
    for (let i = 0; i < joinButtons.length; i++) {
      joinButtons[i].onclick = (event) => {
        chrome.tabs.create({ url: event.target.getAttribute("href") });
      };
    }
  }

  if (document.getElementsByClassName("event-html-link")) {
    const eventHtmlLinks = document.querySelectorAll(".event-html-link");
    for (let i = 0; i < eventHtmlLinks.length; i++) {
      eventHtmlLinks[i].onclick = (event) => {
        chrome.tabs.create({ url: event.target.getAttribute("data-href") });
      };
    }
  }
};

const reportProblem = () => {
  chrome.tabs.create({ url: "mailto:support@portd.io" });
  window.close();
};

const meetingItemHtml = (meeting, isRemoteOnly) => {
  if (!meeting) {
    return "";
  }

  const { eventHtmlLink, startTime, agenda, link } = meeting;

  let linkHtml = "";

  if (link) {
    linkHtml = `<td href="${link}"><span href="${link}" class="badge secondary join-btn-span"><a class="join-btn" href="${link}"><img href="${link}" src="../../icons/join_meeting.png" /></a></span></td>`;
  } else if (isRemoteOnly == "false") {
    linkHtml = "<td></td>";
  }

  const html = `<tr>
    <td>${startTime}</td>
    <td class="event-html-link" data-href="${eventHtmlLink}">${agenda}</td>
    ${linkHtml}
    </tr>`;

  if (link || isRemoteOnly == "false") {
    return html;
  } else {
    return "";
  }
};

const showRefreshTimer = (lastRefreshTime) => {
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

const updateRefreshTimer = (countdown) => {
  let padding = "";
  if (countdown < 10) {
    padding = "0";
  }
  document.getElementById("base-timer-label").innerHTML = padding + countdown;
};

const setRemoteOnlyFilter = (settings) => {
  let isRemoteOnly =
    settings && settings.meetingSwitcher
      ? settings.meetingSwitcher.remoteOnly
      : null;
  if (document.getElementById("meeting-swticher")) {
    checkbox = document.getElementById("meeting-swticher");
    if (isRemoteOnly == "true") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }

    checkbox.addEventListener("change", async (event) => {
      if (event.currentTarget.checked) {
        await popupToBackground("add-setting", {
          settingKey: "meetingSwitcher",
          itemKey: "remoteOnly",
          itemValue: "true",
        });
        location.reload();
      } else {
        await popupToBackground("add-setting", {
          settingKey: "meetingSwitcher",
          itemKey: "remoteOnly",
          itemValue: "false",
        });
        location.reload();
      }
    });
  }
};

const injectMeetingsHtml = (meetingsHtml) => {
  // console.log(meetingsHtml);
  if (meetingsHtml) {
    document.getElementById("meetings-collapsible-title").innerHTML =
      "meetings";
    document.getElementById("loader-div").style.display = "none";
    document.getElementById("no-meetings-div").style.display = "none";
    let meetingsDiv = document.getElementById("meetings-div");

    meetingsDiv.innerHTML = "";
    meetingsDiv.innerHTML = meetingsHtml;
    meetingsDiv.style.display = "flex";

    const meetingCards = document.querySelectorAll(".cont_vert");
    meetingCards.forEach((meetingCard) => {
      meetingCard.onclick = async () => {
        chrome.tabs.create({
          url: meetingCard.parentNode.parentNode.getAttribute("dataLink"),
        });
      };
    });

    const newMeetingButton = document.getElementById(
      "video_call_new_meetings_card"
    );
    newMeetingButton.addEventListener("click", () => {
      showCreateEventsUI();
      // window.open("https://zoom.us/meeting/schedule");
    });
  } else {
    showNoMeetingsView();
  }
};

const loadCalendarUI = async () => {
  // console.log("loadCalendarUI, calender.js");

  try {
    showLoadingView();
    // refreshingFooter(true);

    // const meetings = await getMeetingsFromBackgroundWorker(
    //   currentDateGlobalVarible,
    //   true
    // );

    const meetings = meetingsGlobalVar;
    if (meetings && meetings?.length) {
      // This variable will contain the generated html for the meetings
      let meetingsHtml = generateMeetingsHtml(meetings);

      // This function will inject the meeting cards in the html
      injectMeetingsHtml(meetingsHtml);

      // This function will added meeting and notes onclick actions on the meeting elements
      addEventListenerForMeetings(meetings);
      showMeetingsUI();
      showMeetingCardsView();

      // don't need this as we will be calculating the html
      // await popupToBackground("set", {
      //   zoomiesCachedMeetingsHtml: meetingsHtml,
      // });

      // console.log("Meetings Shown!");
      // refreshingFooter(false);
    } else {
      showNoMeetingsView();
      // refreshingFooter(false);
      // console.log("You have no meetings");
    }

    // showBranding(Object.keys(accounts), settings.zoomiesBranding);
  } catch (e) {
    // console.log(e.message);
    showNoMeetingsView();
    // refreshingFooter(false);
  }
};

loadCalendarUI();
