console.log('hohoho -> dispel-beast')
const generateStr4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
const uuid = () => {
  return (generateStr4() + generateStr4() + "-" + generateStr4() + "-" + generateStr4() + "-" + generateStr4() + "-" + generateStr4() + generateStr4() + generateStr4());
}

const sendMessage = (msg) => {
  chrome.runtime.sendMessage(msg);
}

const getStorage = async () => {
  const key = window.location.origin;
  const storage = await chrome.storage.local.get(key);
  return storage[key] || {};
}

const getList = async () => {
  const { list = [] } = await getStorage()
  return list
}

const getStatus = () => {
  const statusStr = window.localStorage.getItem('status');
  return { "true": true, "false": false }[statusStr] ?? false;
}

const renderItem = (item, isDelete) => {
  const oldAttr = 'dispelbeastdefault';
  const { selector, attrValue, attrKey } = item;
  const element = document.querySelector(selector);
  if (element) {
    const attrArr = attrKey.split('.');
    const lastKey = attrArr.pop();
    let changeAbleAttr = null;
    if (attrArr.length) {
      const lastObj = attrArr.reduce((dom, attr) => dom[attr], element);
      changeAbleAttr = lastObj;
    } else {
      changeAbleAttr = element;
    }
    if (isDelete) {
      changeAbleAttr[lastKey] = element.dataset[oldAttr] || 'inherit';
    } else {
      element.dataset[oldAttr] = changeAbleAttr[lastKey];
      changeAbleAttr[lastKey] = attrValue;
    }
  }
}

const execList = async () => {
  const list = await getList();
  list.forEach(item => renderItem(item));
}

const setStorage = async (arg) => {
  const key = window.location.origin;
  const storage = await getStorage();
  chrome.storage.local.set({
    [key]: { ...storage, ...arg }
  });
}

const setList = async (arg) => {
  const item = { id: uuid(), ...arg };
  const list = await getList();
  await setStorage({
    list: [item, ...list]
  })
  renderItem(item)
}

const setStatus = (status) => {
  window.localStorage.setItem('status', status)
}

const deleteList = async (id) => {
  const list = await getList();
  await setStorage({ list: list.filter(item => item.id !== id) })
  const currentItem = list.find(item => item.id === id);
  if (currentItem) {
    renderItem(currentItem, true)
  }
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type) {
    switch (req.type) {
      case 'setList':
        if (req.value) {
          setList(req.value)
        }
        break;
      case 'getList':
        getList().then(list => {
          sendResponse(list)
        });
        return true;
      case 'setStatus':
        setStatus(req.value)
        break;
      case 'getStatus':
        sendResponse(getStatus())
        return true;
      case 'deleteList':
        if (req.value) {
          deleteList(req.value)
        }
        break;
      default:
        console.log(req)
    }
  }
})

const initStyle = () => {
  const css = ".hohoh-dispel-beast{background:#a0c5e8}";
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}

const getPath = (event) => {
  const calcId = (id) => {
    const idArr = id.split('');
    const idStart = idArr.shift();
    if (/^[0-9]$/.test(idStart)) {
      return '#\\3' + `${idStart} ${idArr.join('')}`
    } else {
      return `#${id}`
    }
  }

  event.stopPropagation();
  let e = event.target;
  let domPath = Array();
  while (e.nodeName.toLowerCase() !== "html") {
    if (e.id) {
      domPath.unshift(calcId(e.id))
      break;
    } else if (e.tagName.toLocaleLowerCase() == "body") {
      domPath.unshift(e.tagName.toLocaleLowerCase());
    } else {
      for (i = 0; i < e.parentNode.childElementCount; i++) {
        if (e.parentNode.children[i] == e) {
          domPath.unshift(e.tagName.toLocaleLowerCase() + ':nth-child(' + (i + 1) + ')');
        }
      }
    }
    e = e.parentNode;
  }
  domPath = domPath.toString().replaceAll(',', '>');
  return domPath
}

const init = () => {
  initStyle();

  document.addEventListener('mouseover', e => {
    if (getStatus()) {
      const path = getPath(e);
      if (path) {
        const element = document.querySelector(path);
        if (element) {
          element.classList.add('hohoh-dispel-beast');
        }
      }
    }
  })

  document.addEventListener('mouseout', e => {
    if (getStatus()) {
      const path = getPath(e);
      if (path) {
        const element = document.querySelector(path);
        if (element) {
          element.classList.remove('hohoh-dispel-beast');
        }
      }
    }
  })

  document.addEventListener('contextmenu', e => {
    if (getStatus()) {
      e.preventDefault();
      const path = getPath(e);
      if (path) {
        setList({
          selector: path,
          attrKey: 'style.display',
          attrValue: 'none',
        })
      }
      return false;
    }
  })
}
setTimeout(() => {
  execList();
  init();
}, 200)

