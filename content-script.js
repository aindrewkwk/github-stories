let tries = 0;

let stories;
let storyList = [];
let storyViewIntervalId = null;
let progressBarIntervalId = null;
let automaticSliderIntervalId = null;

const emojis = {
  added: '👋',
  made: '➕',
  starred: '⭐',
  'pushed to': '🚀',
  'started following': '🚶',
  forked: '🤓',
  deleted: '❌',
  'commented on': '💬',
  left: '💬',
  created: '🏁',
  closed: '🚫',
  opened: '✨',
  merged: '📦',
  released: '🏷',
  bot: '🤖'
};

let time = 200;
const AUTOMATIC_SCROLL_DELAY = 4200;
const PROGRESS_BAR_UPDATE_DELAY = 100;
const UPDATE_PROGRESS_BAR_VALUE =
  time / (AUTOMATIC_SCROLL_DELAY / PROGRESS_BAR_UPDATE_DELAY - 5);
let storyViewOpen = false;

function getActionFullText(element){
  let fullText = '';

  if(element.getElementsByClassName('repo-description')[0] != null){
    fullText += ' ' + element.getElementsByClassName('repo-description')[0].innerText;
  }

  if(element.getElementsByClassName('rpt-1')[0] != null){
    fullText += ' ' + element.getElementsByClassName('pt-1')[0].innerText;
  }

  console.log(element);

  return fullText;
}

const handle = setInterval(() => {
  let dashboardCards;
  try {
    dashboardCards = document
      .getElementById('dashboard')
      .querySelector(
        'div[data-repository-hovercards-enabled]:not(.js-recent-activity-container)',
      ).children;
  } catch (error) {
    if (tries++ === 20) {
      clearInterval(handle);
      return;
    }
    return;
  }

  clearInterval(handle);
  stories = Array.prototype.slice
    .call(dashboardCards)
    .filter((element) => element.nodeName === 'DIV')
    .map((element) => {
      const [userName, action, repoOrUserName] = element.textContent
        .split('\n')
        .map((str) => str.trim())
        .filter((str) => str !== '');

      const themeID = Math.floor(Math.random() * 18); // 0 - 17

      let userImageUrl = 'https://image.flaticon.com/icons/png/512/25/25231.png';
      if(element.querySelector('.avatar.avatar-user')!=null){
        userImageUrl = element.querySelector('.avatar.avatar-user').src;
      }

      let actionFull = getActionFullText(element);

      return {
        userImageURL: userImageUrl,
        userName,
        action,
        actionFull,
        repoOrUserName,
        repoOrUserURL: getGithubURL(repoOrUserName),
        themeID,
      };
    })
    .filter(
      (story) =>
        story.action !== 'created a' &&
        !story.action.includes('and') &&
        !story.repoOrUserName.includes('repositories'),
    );

  const batchStories = [];
  stories.forEach((story) => {
    let index = 0;
    const belongsToBatch = batchStories.some((batchStory, idx) => {
      if (batchStory[0].userName === story.userName) {
        index = idx;
        return true;
      }
    });
    if (belongsToBatch) {
      batchStories[index].push(story);
    } else {
      batchStories.push([story]);
    }
  });

  storyList = [...batchStories];

  const storyListView = getStoryListView({ stories: storyList });
  document.querySelector('.news').prepend(getStoryViewer());
  document.querySelector('.news').prepend(storyListView);
}, 1000);

function onClickStoryBtn(event) {
  const path = event.path;
  const buttonElem = path.find((element) => element.className === 'user-story');
  const storyID = buttonElem.getAttribute('story-id');

  const batchStory = storyList[storyID];
  updateSingleStoryView(batchStory[0], storyID, 0);
}

function getStoryListView({ stories }) {
  const storyListWrapperElem = document.createElement('div');
  storyListWrapperElem.classList.add('stories-list-wrapper');

  const storyListElement = document.createElement('div');
  storyListElement.classList.add('stories-list');

  stories.forEach((singleStoryBatch, index) => {
    let story = singleStoryBatch[0];

    const userStoryElem = document.createElement('div');
    userStoryElem.classList.add('user-story');
    userStoryElem.setAttribute('story-id', index);

    {
      const btnElem = document.createElement('button');
      btnElem.innerHTML = `<div class="img-wrapper">
  <img class="user-story-img" src="${story.userImageURL}" alt="${story.userName}" />
</div>
<div class="user-story-name f6">${story.userName}</div>`;
      btnElem.addEventListener('click', onClickStoryBtn);
      userStoryElem.appendChild(btnElem);
    }

    storyListElement.appendChild(userStoryElem);
  });

  storyListWrapperElem.appendChild(storyListElement);

  return storyListWrapperElem;
}

function getGithubURL(resource) {
  return `https://github.com/${resource}`;
}

function pause() {
  //alert();
}

function getStoryViewer() {
  const storyViewWrapperElem = document.createElement('div');
  storyViewWrapperElem.classList.add('story-view-wrapper', 'hidden');
  storyViewWrapperElem.addEventListener("click", function(event) {
    pause();
  });
  storyViewWrapperElem.innerHTML = `<div class="story-view">
  <div class="story-view-user">
    <div class="story-view-user-detail">
      <a class="story-view-user-img-link">
        <img src="" class="story-view-user-img" alt="" />
      </a>
      <a class="story-view-user-name"></a>
    </div>
  </div>

  <div class="ex-progress-bar"></div>
  <div class="story-view-content">
    <div class="story-view-content-text">
      <div>@<a class="story-view-user-name-inside"></a> <span class="story-view-content-action">starred</span></div>
      <div>
        <span class="story-view-content-object">
          <a href="${getGithubURL('vuejs/docs-next')}">vuejs/docs-next</a></span>!
      </div>
      <div class="story-view-full-text"></div>
      <div class="story-view-content-emoji">⭐</div>
    </div>

    <button class="story-view-prev"><</button>
    <button class="story-view-next">></button>
    <button class="story-view-close-btn">
      <svg
        height="20px"
        viewBox="0 0 329.26933 329"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
        ></path>
      </svg>
    </button>
  </div>
</div>
`;

  const storyViewerCloseBtn = storyViewWrapperElem.querySelector(
    '.story-view-close-btn',
  );
  const storyViewPrevBtn = storyViewWrapperElem.querySelector(
    '.story-view-prev',
  );
  const storyViewNextBtn = storyViewWrapperElem.querySelector(
    '.story-view-next',
  );

  storyViewerCloseBtn.addEventListener('click', handleCloseStoryViewerBtnClick);
  storyViewPrevBtn.addEventListener('click', handleStoryViewPrevBtnClick);
  storyViewNextBtn.addEventListener('click', handleStoryViewNextBtnClick);

  document.addEventListener('keyup', onPressKey);
  window.addEventListener('resize', updateStoryViewWidth);

  return storyViewWrapperElem;
}

function updateStoryViewWidth() {
  const storyViewElem = document.querySelector('.story-view');

  const { height } = storyViewElem.getBoundingClientRect();
  storyViewElem.style.width = `${height / 1.77}px`;
}

function onPressKey(event) {
  if (storyViewOpen) {
    switch (event.key) {
      case 'Escape':
        closeStoryView();
        break;
      case 'ArrowLeft':
        handleStoryViewPrevBtnClick();
        break;
      case 'ArrowRight':
        handleStoryViewNextBtnClick();
        break;
    }
  }
}

function moveSlide(story, storyID, storyIndex) {
  updateSingleStoryView(story, storyID, storyIndex);
}

function moveToNextSlide(storyID, storyIndex) {
  if (storyIndex + 1 >= storyList[storyID].length) {
    storyID++;
    storyIndex = 0;
  } else storyIndex++;

  if (storyID >= storyList.length) return;

  moveSlide(storyList[storyID][storyIndex], storyID, storyIndex);
}
function moveToPrevSlide(storyID, storyIndex) {
  if (storyIndex - 1 < 0) {
    storyID--;
    storyIndex = 0;
  } else storyIndex--;
  if (storyID < 0) return;

  moveSlide(storyList[storyID][storyIndex], storyID, storyIndex);
}

function handleStoryViewNextBtnClick() {
  const storyViewer = document.querySelector('.story-view-wrapper');
  let storyID = parseInt(storyViewer.getAttribute('story-id'));
  let storyIndex = parseInt(storyViewer.getAttribute('story-index'));

  moveToNextSlide(storyID, storyIndex);
}

function handleStoryViewPrevBtnClick() {
  const storyViewer = document.querySelector('.story-view-wrapper');
  let storyID = storyViewer.getAttribute('story-id');
  let storyIndex = storyViewer.getAttribute('story-index');

  moveToPrevSlide(storyID, storyIndex);
}

function handleCloseStoryViewerBtnClick() {
  closeStoryView();
}

function closeStoryView() {
  document.querySelector('.story-view-wrapper').classList.add('hidden');
  clearInterval(storyViewIntervalId);
  clearInterval(progressBarIntervalId);
  storyViewOpen = false;
}

function automaticSlideScrolling() {
  if (storyViewIntervalId) clearInterval(storyViewIntervalId);
  if (progressBarIntervalId) clearInterval(progressBarIntervalId);
  handleStoryViewNextBtnClick();
}

function updateProgressBarProgress() {
  const progressBar = document.querySelector('.ex-progress-bar')
    .firstElementChild;
  const currValue = parseInt(progressBar.getAttribute('value'));
  progressBar.setAttribute(
    'value',
    String(currValue + UPDATE_PROGRESS_BAR_VALUE),
  );
}

function updateProgressBar() {
  let initialValue = 0;
  let progressBarContainer = document.querySelector('.ex-progress-bar');
  progressBarContainer.innerHTML = `<progress id="file" value="${initialValue}" max="`+time+`"> </progress>`;

  if (progressBarIntervalId) clearInterval(progressBarIntervalId);
  progressBarIntervalId = setInterval(
    updateProgressBarProgress,
    PROGRESS_BAR_UPDATE_DELAY,
  );
}

function updateSingleStoryView(story, storyId, storyIndex) {
  const storyViewer = document.querySelector('.story-view-wrapper');

  const imageLink = storyViewer.querySelector('.story-view-user-img-link');
  imageLink.href = getGithubURL(story.userName);

  const image = storyViewer.querySelector('.story-view-user-img');
  image.src = story.userImageURL;
  image.setAttribute('alt', story.userName);

  const name = storyViewer.querySelector('.story-view-user-name');
  name.href = getGithubURL(story.userName);
  name.innerText = story.userName;

  const nameOnStory = storyViewer.querySelector('.story-view-user-name-inside');
  nameOnStory.href = getGithubURL(story.userName);
  nameOnStory.innerText = story.userName;

  const content = storyViewer.querySelector('.story-view-content');
  content.setAttribute('theme', String(story.themeID));

  const contentAction = storyViewer.querySelector('.story-view-content-action');
  contentAction.innerHTML = story.action;

  const contentFullAction = storyViewer.querySelector('.story-view-full-text');
  contentFullAction.innerHTML = story.actionFull;

  const contentObject = storyViewer.querySelector('.story-view-content-object')
    .firstElementChild;
  contentObject.innerText = story.repoOrUserName;
  contentObject.href = story.repoOrUserURL;

  const contentEmoji = storyViewer.querySelector('.story-view-content-emoji');
  console.log('story action ->'+story.action+'<-');
  contentEmoji.innerText = emojis[story.action] || '';

  storyViewer.setAttribute('story-id', storyId);
  storyViewer.setAttribute('story-index', storyIndex);

  image.src = story.userImageURL;
  name.innerText = story.userName;
  name.href = getGithubURL(story.userName);

  if (storyViewIntervalId) clearInterval(storyViewIntervalId);

  updateProgressBar();
  storyViewIntervalId = setInterval(
    automaticSlideScrolling,
    AUTOMATIC_SCROLL_DELAY,
  );

  document.querySelector('.story-view-wrapper').classList.remove('hidden');
  storyViewOpen = true;

  updateStoryViewWidth();
}

(function initGithubChatWidget() {
    if (window.top !== window || document.getElementById('github-stories-chat')) return;
    if (location.hostname !== 'github.com') return;

   const styles = document.createElement('style');
    styles.textContent = `
        #github-stories-chat { position: fixed; right: 20px; bottom: 20px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
            #github-stories-chat button { font: inherit; }
                .github-stories-chat-toggle { width: 56px; height: 56px; border-radius: 50%; border: 0; color: #fff; background: #0969da; box-shadow: 0 8px 24px rgba(31,35,40,.24); cursor: pointer; font-weight: 700; }
                    .github-stories-chat-panel { display: none; width: 340px; max-width: calc(100vw - 32px); height: 430px; max-height: calc(100vh - 120px); margin-bottom: 12px; overflow: hidden; border: 1px solid #d0d7de; border-radius: 12px; background: #fff; box-shadow: 0 16px 48px rgba(31,35,40,.24); color: #24292f; }
                        .github-stories-chat-panel.is-open { display: flex; flex-direction: column; }
                            .github-stories-chat-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; color: #fff; background: #24292f; }
                                .github-stories-chat-title { font-weight: 700; }
                                    .github-stories-chat-subtitle { font-size: 12px; opacity: .78; }
                                        .github-stories-chat-close { border: 0; background: transparent; color: #fff; cursor: pointer; font-size: 20px; line-height: 1; }
                                            .github-stories-chat-messages { flex: 1; padding: 12px; overflow-y: auto; background: #f6f8fa; }
                                                .github-stories-chat-message { margin: 0 0 10px; padding: 10px 12px; border-radius: 10px; background: #fff; border: 1px solid #d8dee4; line-height: 1.35; }
                                                    .github-stories-chat-message.user { margin-left: 36px; background: #ddf4ff; border-color: #b6e3ff; }
                                                        .github-stories-chat-form { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #d8dee4; background: #fff; }
                                                            .github-stories-chat-input { flex: 1; min-width: 0; padding: 8px 10px; border: 1px solid #d0d7de; border-radius: 6px; }
                                                                .github-stories-chat-send { border: 0; border-radius: 6px; background: #2da44e; color: #fff; padding: 0 12px; cursor: pointer; font-weight: 600; }
                                                                    .github-stories-chat-owner { color: inherit; font-weight: 600; text-decoration: underline; }
                                                                      `;
    document.head.appendChild(styles);

   const owner = location.pathname.split('/').filter(Boolean)[0] || 'GitHub';
    const repo = location.pathname.split('/').filter(Boolean).slice(0, 2).join('/') || 'home';
    const storageKey = `github-stories-chat:${repo}`;

   const root = document.createElement('div');
    root.id = 'github-stories-chat';
    root.innerHTML = `
        <section class="github-stories-chat-panel" aria-label="GitHub chat">
              <div class="github-stories-chat-header">
                      <div>
                                <div class="github-stories-chat-title">Chat</div>
                                          <div class="github-stories-chat-subtitle">Conversation with <a class="github-stories-chat-owner" target="_blank" rel="noreferrer"></a></div>
                                                  </div>
                                                          <button class="github-stories-chat-close" type="button" aria-label="Close chat">x</button>
                                                                </div>
                                                                      <div class="github-stories-chat-messages"></div>
                                                                            <form class="github-stories-chat-form">
                                                                                    <input class="github-stories-chat-input" type="text" placeholder="Write a message..." autocomplete="off" />
                                                                                            <button class="github-stories-chat-send" type="submit">Send</button>
                                                                                                  </form>
                                                                                                      </section>
                                                                                                          <button class="github-stories-chat-toggle" type="button" aria-label="Open GitHub chat">Chat</button>
                                                                                                            `;
    document.body.appendChild(root);

   const panel = root.querySelector('.github-stories-chat-panel');
    const toggle = root.querySelector('.github-stories-chat-toggle');
    const close = root.querySelector('.github-stories-chat-close');
    const form = root.querySelector('.github-stories-chat-form');
    const input = root.querySelector('.github-stories-chat-input');
    const messages = root.querySelector('.github-stories-chat-messages');
    const ownerLink = root.querySelector('.github-stories-chat-owner');
    const savedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');

   ownerLink.textContent = `@${owner}`;
    ownerLink.href = `https://github.com/${owner}`;

   function renderMessages() {
         messages.innerHTML = '';

      const intro = document.createElement('p');
         intro.className = 'github-stories-chat-message';
         intro.textContent = 'Use this lightweight chat space while browsing GitHub. Messages are saved locally for this repository.';
         messages.appendChild(intro);

      savedMessages.forEach((message) => {
              const item = document.createElement('p');
              item.className = 'github-stories-chat-message user';
              item.textContent = message;
              messages.appendChild(item);
      });

      messages.scrollTop = messages.scrollHeight;
   }

   toggle.addEventListener('click', () => {
         panel.classList.toggle('is-open');
         if (panel.classList.contains('is-open')) input.focus();
   });

   close.addEventListener('click', () => panel.classList.remove('is-open'));

   form.addEventListener('submit', (event) => {
         event.preventDefault();
         const value = input.value.trim();
         if (!value) return;

                             savedMessages.push(value);
         localStorage.setItem(storageKey, JSON.stringify(savedMessages));
         input.value = '';
         renderMessages();
   });

   renderMessages();
})();
