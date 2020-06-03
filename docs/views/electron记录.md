## BrowserWindow

用于创建和控制浏览器窗口



## Menu API

```typescript
  class Menu {

    // Docs: http://electronjs.org/docs/api/menu

    /**
     * 在手动或通过menu.closePopup()关闭弹出窗口时触发。
     */
    on(event: 'menu-will-close', listener: (event: Event) => void): this;
    once(event: 'menu-will-close', listener: (event: Event) => void): this;
    addListener(event: 'menu-will-close', listener: (event: Event) => void): this;
    removeListener(event: 'menu-will-close', listener: (event: Event) => void): this;
    /**
     * 调用menu.popup()事件时触发该事件
     */
    on(event: 'menu-will-show', listener: (event: Event) => void): this;
    once(event: 'menu-will-show', listener: (event: Event) => void): this;
    addListener(event: 'menu-will-show', listener: (event: Event) => void): this;
    removeListener(event: 'menu-will-show', listener: (event: Event) => void): this;
    constructor();
    /**
     * Generally, the template is just an array of options for constructing a MenuItem.
     * 构造MenuItem
     */
    static buildFromTemplate(template: MenuItemConstructorOptions[]): Menu;
    /**
     * 返回应用程序菜单，返回的Menu实例不支持动态添加或删除子菜单项
     */
    static getApplicationMenu(): Menu | null;
    /**
     * 将 action 发送到应用程序的第一个响应方。 这用于模拟默认的 macOS 菜单行为。
     */
    static sendActionToFirstResponder(action: string): void;
    /**
     * 将菜单设置为macOS上的应用程序菜单。 在Windows和Linux上，菜单将设置为每个窗口的顶部菜单。
     * 传递null将删除Windows和Linux上的菜单栏，但对macOS无效。
     * 必须在应用模块的ready事件之后调用此API。
     */
    static setApplicationMenu(menu: Menu | null): void;
    /**
     * 把子菜单项添加到Menu中
     */
    append(menuItem: MenuItem): void;
    /**
     * 关闭 context menu
     */
    closePopup(browserWindow?: BrowserWindow): void;
    getMenuItemById(id: string): MenuItem;
    /**
     * 将menuItem插入Menu的pos位置
     */
    insert(pos: number, menuItem: MenuItem): void;
    /**
     * 打开 context menu
     */
    popup(options: PopupOptions): void;
    /**
     * 包含菜单项的  MenuItem []  数组。 
     */
    items: MenuItem[];
  }

  interface PopupOptions {
    /**
     * Default is the focused window.
     */
    window?: BrowserWindow;
    /**
     * Default is the current mouse cursor position. Must be declared if y is declared.
     */
    x?: number;
    /**
     * Default is the current mouse cursor position. Must be declared if x is declared.
     */
    y?: number;
    /**
     * The index of the menu item to be positioned under the mouse cursor at the
     * specified coordinates. Default is -1.
     * 在鼠标光标下方指定坐标处定位的菜单项的索引
     */
    positioningItem?: number;
    /**
     * Called when menu is closed.
     */
    callback?: () => void;
  }
```



### Menu.buildFromTemplate(template)

- template: `(MenuItemConstructorOptions | MenuItem)[]`
- return `Menu`

```typescript

  interface MenuItemConstructorOptions {
    /**
     * Will be called with click(menuItem, browserWindow, event) when the menu item is
     * clicked.
     */
    click?: (menuItem: MenuItem, browserWindow: BrowserWindow, event: Event) => void;
    /**
     * Define the action of the menu item, when specified the click property will be
     * ignored. See .
     */
    role?: string;
    /**
     * Can be normal, separator, submenu, checkbox or radio.
     */
    type?: ('normal' | 'separator' | 'submenu' | 'checkbox' | 'radio');
    label?: string;
    sublabel?: string;
    // 快捷键
    accelerator?: Accelerator;
    icon?: NativeImage | string;
    /**
     * If false, the menu item will be greyed out and unclickable.
     */
    enabled?: boolean;
    /**
     * If false, the menu item will be entirely hidden.
     */
    visible?: boolean;
    /**
     * Should only be specified for checkbox or radio type menu items.
     */
    checked?: boolean;
    /**
     * Should be specified for submenu type menu items. If submenu is specified, the
     * type: 'submenu' can be omitted. If the value is not a then it will be
     * automatically converted to one using Menu.buildFromTemplate.
     */
    submenu?: MenuItemConstructorOptions[] | Menu;
    /**
     * Unique within a single menu. If defined then it can be used as a reference to
     * this item by the position attribute.
     */
    id?: string;
    /**
     * This field allows fine-grained definition of the specific location within a
     * given menu.
     */
    position?: string;
  }
```



```typescript
  class MenuItem {
    // Docs: http://electronjs.org/docs/api/menu-item

    constructor(options: MenuItemConstructorOptions);
    checked: boolean;
    click: Function;
    enabled: boolean;
    label: string;
    visible: boolean;
  }
```



### menuItem.type

- normal: 正常的菜单子项
- separator: 分隔符
- checkbox: 复选框的形式
- redio: 单选框的形式

```javascript
  const menus = [
    {
      label: 'Menu1',
      click: () => { console.log('menu1 click') },
      submenu: [
        {
          label: 'normal',
          type: 'normal'
        },
        {
          label: 'separator',
          type: 'separator'
        },
        {
          label: 'checkbox',
          type: 'checkbox'
        },
        {
          label: 'radio',
          type: 'radio'
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(menus)
  Menu.setApplicationMenu(menu)
```

![1591176480198](C:\Users\24370\AppData\Roaming\Typora\typora-user-images\1591176480198.png)

### menuItem.role

```javascript
  const menus = [
    {
      label: 'menu role',
      submenu: [
        {
          label: 'undo',
          role: 'undo'
        },
        {
          label: 'redo',
          role: 'redo'
        },
        {
          label: 'cut',
          role: 'copy'
        },
        {
          label: 'copy',
          role: 'copy'
        },
        {
          label: 'paste',
          role: 'paste'
        },
        {
          label: 'pasteAndMatchStyle',
          role: 'pasteAndMatchStyle'
        },
        {
          label: 'selectAll',
          role: 'selectAll'
        },
        {
          label: 'delete',
          role: 'delete'
        },
        {
          lable: 'toggledevtools',
          role: 'toggledevtools'
        },
        {
          label: 'togglefullscreen',
          role: 'togglefullscreen'
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(menus)
  Menu.setApplicationMenu(menu)
```

![1591177189543](C:\Users\24370\AppData\Roaming\Typora\typora-user-images\1591177189543.png)



## context menu

```javascript

import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  ipcMain
} from 'electron'

const menu = new Menu()
menu.append(new MenuItem({ label: 'Hello' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

app.on('browser-window-created', (event, win) => {
  win.webContents.on('context-menu', (e, params) => {
    menu.popup(win, params.x, params.y)
  })
})

ipcMain.on('show-context-menu', e => {
  const win = BrowserWindow.fromWebContents(e.sender)
  menu.popup(win)
})
```

- 事件`browser-window-created`: 在创建新的browserWindow时触发，回调函数参数为`(event: Event, window: BrowserWindow)`

- webContents: BrowserWindow对象的一个属性，负责渲染和控制网页，是一个Event Emitter
- ipcMain: 是一个Event Emitter，处理从网页发送出来的异步和同步信息。



## webContents

### 实例事件

**did-finish-load**: 导航完成是触发，即选项卡的旋转器将停止旋转，并指派`onload`事件后。

**did-fail-load** 

**new-window**

**dom-ready**

**context-menu**

...

[查看更多webContent相关内容](<https://www.electronjs.org/docs/api/web-contents>)

## ipcMain

ipcMain模块是一个Event Emitter，用于从主进程到渲染器的异步通信。

ipcMain处理从渲染器进程发送出来的异步和同步信息。

**从渲染器进程发送的消息**将被发送到该模块。

```typescript
  interface IpcMain extends EventEmitter {

    // Docs: http://electronjs.org/docs/api/ipc-main

    on(channel: string, listener: Function): this;

    once(channel: string, listener: Function): this;

    removeAllListeners(channel: string): this;

    removeListener(channel: string, listener: Function): this;
  }
```

### 发送消息

回复消息时，需要设置`event.returnValue`

```javascript
const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})
```

要将异步消息发送回发送方，可以使用`event.reply()`，此辅助方法将自动处理来自非主框架(例如iframe)的消息，而`event.sender.send()`将始终发送至主框架。

```javascript
//在渲染器进程 (网页) 中。
const { ipcRenderer } = require('electron')

const reply = ipcRenderer.sendSync('synchronous-message', 'ping')
console.log(reply) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```





## shortcut

```javascript
const {app, dialog, globalShortcut} = require('electron')

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+Alt+K', () => {
    dialog.showMessageBox({
      type: 'info',
      message: 'Success!',
      detail: 'You pressed the registered global shortcut keybinding.',
      buttons: ['OK']
    })
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
```

