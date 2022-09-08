import 'regenerator-runtime/runtime';

const scriptInjection = document.createElement('script');
scriptInjection.src = chrome.extension.getURL('app/script/inject.js');
(document.head || document.documentElement).appendChild(scriptInjection);

scriptInjection.onload = () => {
  const extensionURL = chrome.runtime.getURL("popup.html");

  const event = new CustomEvent('onloadInject', { detail: { extensionURL } });
  document.dispatchEvent(event);
};

let port = chrome.runtime.connect({ name: 'ast.extension' });


port.onMessage.addListener(async (data) => {
  window.postMessage({
    ...data,
    target: 'ast.dapps',
  });
});
port.onDisconnect.addListener(() => {
  port = chrome.runtime.connect({ name: 'ast.extension' });
});

window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  const { data } = event;
  if (data.target && data.target === 'ast.content') {
    port.postMessage({
      ...data,
      target: 'ast.background',
    });
  }
}, false);
