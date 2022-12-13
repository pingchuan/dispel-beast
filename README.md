# 使用方法
### 安装
下载代码后解压成文件夹，打开谷歌浏览器的扩展程序管理页面（chrome://extensions/），启动开发者模式，点击“加载已解压的扩展程序”，导入该扩展程序的文件夹

### 使用方法1
1、点击开启元素采集
2、将光标移动到需要屏蔽的元素上，出现浅蓝色选取后，鼠标右键点击后可隐藏该区块，同时扩展程序列表中会出现一项数据，并可以撤销

### 使用方法2
1、输入selector字符串，即 document.querySelector 选择的字符串如：#\31  > div > div:nth-child(1) > div:nth-child(3) > div > div.c-span9.c-span-last > span.content-right_8Zs40，可以使用元素查看器中的 Copy -> Copy selector 获取
2、输入元素属性字符串，即 需要修改的元素的属性如：styles.background
3、输入元素属性值，如：yellow
4、点击添加按钮，同时扩展程序列表中会出现一项数据，并可以撤销
