# HTML 规范

## 一般规则

- 命名规范
  - 所有代码( 包括HTML元素名称，属性，属性值，CSS选择器，特性，特性值 )仅使用小写字母
- 缩进规范
  - 使用4个空格长度的TAB制表符进行缩进

- 编码
  - 统一使用UTF-8编码。在HTML模板和文档中指定元属性`<meta chaeset="utf-8">`。
  - 不要在样式表中声明编码格式，它们默认为UTF-8；

- 注释
  - 尽可能根据需要进行注释，注释需包括：它涵盖了什么，它的目的是什么，为什么使用或优先使用该方案

## HTML样式规范

- 文件类型
  - 必须使用HTML5文档类型声明，在文档开头使用`<!DOCTYPE html>`。
- 多媒体的替代文本
  - 不能省略多媒体元素的`alt`属性，要使用有意义的替代文本
- 逻辑分离
  - 将结构，样式和行为分离开来，确保HTML文档和模板中只包含用于结构目的的代码，将所有表现形式移动到样式表中，将所有行为移动到js脚本中。
- 实体引用
  - 除了HTML中有特殊意义的字符(如`<`和`&`)以及控件或"不可见字符"等，尽量不要使用实体字符。
- 可选标签
  - 尽量省略可选标签
- `type`属性
  - 省略样式表和脚本中的`type`属性

## HTML标签和命名规范

- 使用语义化标签代替传统的div
  - `<header>`：页眉通常包括网站标志、主导航、全站链接以及搜索框。
  - `<nav>`：标记导航，仅对文档中重要的链接群使用。
  - `<main>`：页面主要内容，一个页面只能使用一次。如果是web应用，则包围其主要功能。
  - `<article>`：定义外部的内容，其中的内容独立于文档的其余部分
  - `<section>`：定义文档中的节（section、区段）。比如章节、页眉、页脚或文档中的其他部分。
  - `<aside>`：定义其所处内容之外的内容。如侧栏、文章的一组链接、广告、友情链接、相关产品列表等。
  - `<footer>`：页脚，只有当父级是body时，才是整个页面的页脚。
- 推荐使用下表中的命名，除下列列表中的缩写，其它单词都不应该缩写
  - 布局相关

  |  语义  |     命名      |     简写      |
  | :----: | :-----------: | :-----------: |
  | 盒容器 |     wrap      |     wrap      |
  |  盒子  |      box      |      box      |
  |  容器  |   container   |   container   |
  |  主栏  |     main      |     main      |
  |  侧栏  | sidebar/aside | sidebar/aside |
  |  文档  |      doc      |      doc      |
  |  头部  |     head      |     head      |
  |  主体  |     body      |     body      |
  |  底部  |     foot      |     foot      |
  - 模块相关

  |  语义  |    命名    |   简写   |
  | :----: | :--------: | :------: |
  |  导航  | navigation |   nav    |
  |  菜单  |    menu    |   menu   |
  | 选项卡 |    tab     |   tab    |
  |  标题  |   title    |  title   |
  |  内容  |  content   | content  |
  |  列表  |    list    |   list   |
  |  表格  |   table    |  table   |
  |  表单  |    form    |   form   |
  |  按钮  |   button   |   btn    |
  | 面包屑 |   crumb    |  crumb   |
  |  切换  |   slide    |  slide   |
  |  搜索  |   search   |  search  |
  |  提示  |    tips    |   tips   |
  |  下载  |  download  | dowload  |
  |  结果  |   result   |  result  |
  |  展开  |  collapse  | collapse |
  |  提示  |  tooltip   | tooltip  |
  |  下拉  |  dropdown  | dropdown |
  - 状态相关

  | 语义 |   命名   |   简写   |
  | :--: | :------: | :------: |
  | 选中 | selected | selected |
  | 当前 | current  | current  |
  | 激活 |  active  |  active  |
  | 显示 |   show   |   show   |
  | 隐藏 |  hidden  |   hide   |
  | 打开 |   open   |   open   |
  | 关闭 |  close   |  close   |
  | 出错 |  error   |  error   |
  | 禁用 | disabled | disabled |
  | 扩展 |  extend  |  extend  |

## HTML格式规则

- 一般格式
  - 为每个块，列表或表元素使用一个新行，并对他们进行缩进

- HTML引号
  - 引用属性值时，使用双引号。

- 标签闭合
  - 自闭合标签必须闭合，如`<br/>`,`<img/>`等
  - 可闭合标签必须闭合
- 标签属性书写顺序

  > class

  > id

  > data-\*

  > src,type,href,value

  > title,alt

- 布尔值属性
  - 元素的布尔值属性，如`disabled`、`checked`、`selected`等属性不用设置值。
