const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;
// Listen for app to be ready

process.env.NODE_ENV = 'production';

app.on('ready', function(){
  // Create new mainWindow
  mainWindow = new BrowserWindow({});

  // Load HTML into window
  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname , 'mainwindow.html'),
      protocol: 'file:',
      slashes: true
  }));

  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  //Build menu from mainMenuTemplate
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert Menu
  Menu.setApplicationMenu(mainMenu);
});


// Handle create add window
function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 600,
    height: 300,
    title: 'Add todo'
  });

  // Load HTML into window
  addWindow.loadURL(url.format({
      pathname: path.join(__dirname , 'addWindow.html'),
      protocol: 'file:',
      slashes: true
  }));
  // Garbage collection Handle
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Catch todo:add

ipcMain.on('todo:add', function(e, todo){
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});


ipcMain.on("todo:window", function(e){
  createAddWindow();
});

// Create menu template

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Todo',
        accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Todos',
        accelerator: process.platform == 'darwin' ? 'Command+K' : 'Ctrl+K',
        click(){
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
]

// if mac, add empty object to Menu

if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add develoer tools item if not in production

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer tools',
    submenu: [
      {
        label: 'Toggle devtools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
