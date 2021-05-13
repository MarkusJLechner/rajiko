console.log('mobile start')

const _waitForElement = (selector, delay = 300, tries = 250) => {
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

document.addEventListener('DOMContentLoaded', function (event) {
    console.log('DOMContentLoaded mobile')
    let meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=' + screen.width
    document.head.appendChild(meta)
    document.body.style.display = 'unset'

  try {
    ;(async () => {
      const el = await _waitForElement(`#pause`)
      if (el) {
        console.log('set pause el')
        document.getElementById('pause').addEventListener('click', function (evnet) {
          if (document.getElementById('play').children[0].children[0].classList.contains('on')) {
            document.getElementById('pause').children[0].children[0].style.opacity = '0.5'
          }
        })
      }
      log('pause', el);
    })();
    ;(async () => {
      const el = await _waitForElement(`#play`)
      if (el) {
        console.log('set play el')
        document.getElementById('play').addEventListener('click', function (evnet) {
          if (document.getElementById('pause').children[0].children[0].style.opacity === '0.5') {
            setTimeout(function () {
              document.getElementById('pause').children[0].children[0].style.opacity = '1'
            }, 600)
          }
        })
      }
      log('pause', el);
    })();
  } catch (e) {
    console.log(e)
  }
})
