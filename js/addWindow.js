const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e){
  e.preventDefault();
  const todo = document.querySelector('#todo').value;
  if (todo != ''){
    ipcRenderer.send('todo:add', todo);
  }else{
    alert('It is empty!');
  }
}
