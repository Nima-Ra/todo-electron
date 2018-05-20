const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');
const fs = require('fs');

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function add_todo_file(todo){

  fs.appendFile('Todo.txt',todo + " | ", function(err){
    if (err) {
      alert(err);
    }
  });
}

function add_todo_html(todo){
        var i = ul.children.length;

        if (document.getElementById(i) != null){
          i = i_make(i);
        }

        ul.className = 'collection';
        // li element
        const li = document.createElement('li');

        // Todo Text Span
        const todoText = document.createElement('span');
        todoText.innerHTML = todo;
        todoText.className = "text"+i;

        //checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = "filled-in";
        checkbox.setAttribute("checked", "checked");
        checkbox.setAttribute("onclick", "removeTodo("+String(i)+")");

        // label
        const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(todoText);

        li.appendChild(label);
        li.id = String(i);
        li.className = 'collection-item';
        ul.appendChild(li);
}


var todo_data = String(fs.readFileSync("Todo.txt")).split(" | ");
if (todo_data.length > 1){
  todo_data.remove('');
  for (var i = 0; i < todo_data.length ; i++) {
    let todo = todo_data[i];
    add_todo_html(todo);
  }
}


function i_make(i){
  i += 1
  if (document.getElementById(i) == null){
    return i;
  }
  else{
    i_make(i);
  }
}
// Catch add todo
ipcRenderer.on('todo:add', function(e, todo){
  add_todo_file(todo);
  add_todo_html(todo);
});

// Clear todos
ipcRenderer.on('todo:clear', function(e){
  ul.innerHTML = '';
  ul.className = '';
  fs.writeFileSync("Todo.txt", '');
});
function removeTodo(i){
  let data = fs.readFileSync('Todo.txt').toString().split(" | ");
  data.remove(data[i]);
  let out = '';
  for (var j = 0 ; j < data.length ; j++){
    if (j == 0){
      out += data[j]
    }
    else{
      out += " | " + data[j]
    }
  }

  // fs.writeFileSync("Todo.txt", out);
  fs.writeFile("Todo.txt", out, (err) => {
    if (err) console.log(err);
  });

  document.getElementById(i).remove();
  if (ul.children.length == 0){
    ul.className = '';
  }
}

function addWindow(){
  ipcRenderer.send('todo:window');
}
var button = document.createElement("a");
button.className = "btn-floating btn-large waves-effect waves-light red";
button.id = "add-todo-button";
button.addEventListener("click", addWindow);
var i = document.createElement('i');
i.className = "fa fa-plus";
button.appendChild(i);
button.style.bottom = "2%";
button.style.right = "2%";
button.style.position = 'absolute';
document.getElementById("body").appendChild(button);