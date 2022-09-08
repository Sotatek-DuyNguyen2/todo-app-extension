/* eslint no-use-before-define: 0 */
import 'regenerator-runtime/runtime';

let contentPort = null;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: '/index.html#/home-page' });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.target === 'ast.background') {
    if (contentPort) {
      try {
        contentPort.postMessage({
          ...request,
          target: 'ast.content',
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
});

chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name !== 'ast.extension') {
    return;
  }
  contentPort = port;

  contentPort.onMessage.addListener(async (payload) => {
    const action = payload.action || '';

    switch (action) {
      case 'test_connect':
        checkConnect();
        break;
      default:
        break;
    }
  });
  contentPort.onDisconnect.addListener(() => {
    contentPort = null;
  });
});

const checkConnect = async () => {
  const lastFocused = await getLastFocusedWindow();
  
  const options = {
    url: `index.html#/test-connect`,
    type: 'popup',
    top: lastFocused.top,
    left: lastFocused.left + (lastFocused.width - 360),
    width: 368,
    height: 610,
  };

  chrome.windows.create(options);
}

const getLastFocusedWindow = async () =>
  new Promise((resolve, reject) => {
    chrome.windows.getLastFocused((windowObject) => resolve(windowObject));
  });

