const log = (...args) => {
  console.log('%crajiko', 'padding: 4px 6px; background: rgb(200,100,0); border-radius: 4px;', ...args)
}

function _waitForElement(selector, delay = 300, tries = 250) {
  const element = document.querySelector(selector);

  if (!window[`__${selector}`]) {
    window[`__${selector}`] = 0;
  }

  function _search() {
    return new Promise((resolve) => {
      window[`__${selector}`]++;
      //console.log(window[`__${selector}`]);
      setTimeout(resolve, delay);
    });
  }

  if (element === null) {
    if (window[`__${selector}`] >= tries) {
      window[`__${selector}`] = 0;
      return Promise.resolve(null);
    }

    return _search().then(() => _waitForElement(selector));
  } else {
    return Promise.resolve(element);
  }
}

const landingUrl = window.location.toString()
log('landing url', landingUrl)
localStorage.setItem('landingUrl', landingUrl)

log('common start')

document.addEventListener('DOMContentLoaded', () => {
  log('common DOM Content loaded')

  try {
    let waitForJQuery = setInterval(function () {
      if (typeof $ != 'undefined') {

        // $.cookie('default_area_id', 'JP34')

        // console.log('set default area id', 'JP34')

        clearInterval(waitForJQuery);
      }
    }, 10);
  } catch(e) {
    console.log('cant set cookie')
    console.log(e)
  }

  let inspect_script = document.createElement('script')
  inspect_script.src = chrome.runtime.getURL('ui/inspect_start.js')
  document.head.appendChild(inspect_script)

  let mobileStart = document.createElement('script')
  mobileStart.src = chrome.runtime.getURL('ui/mobile_start.js')
  document.head.appendChild(mobileStart)

  function loadStyle(src) {
    return new Promise(function (resolve, reject) {
      let link = document.createElement('link');
      link.href = src;
      link.rel = 'stylesheet';

      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error(`Style load error for ${src}`));

      document.head.append(link);
    });
  }

  loadStyle(chrome.runtime.getURL('ui/mobile.css'))

  const playButton = document.getElementById('play')
  const playTag = playButton ? playButton.getElementsByTagName('i') : null;
  let targetPlayButton = playTag ? playTag[0] : undefined;

  try {
    ;(async () => {
      const el = await _waitForElement(`.colorbox.policy`)
      if (el) {
        el.style.display = 'none'
      }
      log('policy', el);
    })();
    ;(async () => {
      const el = await _waitForElement(`#colorbox`)
      if (el) {
        el.style.display = 'none'
      }
      log('colorbox', el);
    })();
    ;(async () => {
      const el = await _waitForElement(`#cboxOverlay`)
      if (el) {
        el.style.display = 'none'
      }
      log('cboxOverlay', el);
    })();
  } catch (e) {
    console.log(e)
  }

  if (targetPlayButton) {
    let observer = new MutationObserver(function (list) {
      for (let mutation of list) {
        if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            !mutation.target.classList.contains('on')
        ) {
          chrome.runtime.sendMessage({'stop-recording': true}, function () {
          })
        }
      }
    })
    observer.observe(targetPlayButton, {attributes: true})
  }

})
