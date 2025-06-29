# 如何给我们提供你的翻译

打开`src/assets/translatable`文件夹，所有的汉化文件都在`lang`文件夹下，文件名字请根据mc内的命名为主。然后将文件内的json里的每个键都提供对应语言的翻译即可。 最后打开`translatable.js`这个文件，将`language.enum`里添加对应的枚举。在`onlyLang`中添加你汉化的文件（该步骤也可以交给作者来解决，你只需要提供你的翻译即可）。

# 如何添加Wiki的MarkDown文件

你可以通过网站自带的markdown编辑器去生成md文件，网站会自动填充好你md的文件名的，将其添加到`public/md/模组名`的文件夹下，最后在`mod.js`中添加你模组的信息即可。

如果你一定要用自己的md文件的话，你需要确定的是
1. 你的markdown是否支持本项目的markdown显示
2. 你的文件名是否符合规范，规范为`${mc版本}_${mod加载器}_${mod版本}_${语言}.md`