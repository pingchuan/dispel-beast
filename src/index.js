const sendMsg = async (msg) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return chrome.tabs.sendMessage(tab.id, msg);
}

document.querySelector('#create').onclick = async () => {
  const value = {
    selector: formValue.selector.value,
    attrKey: formValue.attrKey.value,
    attrValue: formValue.attrValue.value,
  }
  if (!Object.values(value).every(Boolean)) {
    document.querySelector('.require').classList.add('displayInitial');
  } else {
    await sendMsg({ type: 'setList', value })
    await generateTable();
  }
}

document.querySelector('#status').onclick = async (e) => {
  await sendMsg({ type: 'setStatus', value: e.target.dataset['dispelbeastdefault'] === 'false' ? true : false });
  await generateStatus();
}

const generateTable = async (filterId) => {
  const list = await sendMsg({ type: 'getList' });
  const table = document.querySelector('#table');
  table.innerHTML = '';
  list.filter(item => item.id !== filterId).forEach(item => {
    const deleteBt = document.createElement('div');
    deleteBt.className = "delete";
    deleteBt.innerHTML = "撤销";
    deleteBt.style.userSelect = 'none';
    deleteBt.onclick = async () => {
      await sendMsg({ type: 'deleteList', value: item.id });
      await generateTable(item.id)
    }

    const text = document.createElement('div');
    const valueText = `document.querySelector('${item['selector'].replace('\\', '\\\\')}').${item['attrKey']}='${item['attrValue']}'`
    text.innerHTML = valueText;
    text.title = valueText;
    text.className = "text";

    const textWrapper = document.createElement('div');
    textWrapper.className = "textWrapper";

    const li = document.createElement('div');
    li.className = "li";

    textWrapper.appendChild(text);
    li.appendChild(textWrapper);
    li.appendChild(deleteBt);
    table.appendChild(li);
  })
}

const generateStatus = async () => {
  const status = await sendMsg({ type: 'getStatus' });
  const element = document.querySelector('#status');
  element.querySelector('span').innerText = status ? '关闭' : '开启';
  element.dataset['dispelbeastdefault'] = status;
}

const init = () => {
  generateTable();
  generateStatus();
}

init();