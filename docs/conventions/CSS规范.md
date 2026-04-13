# CSS 规范

## CSS样式规则

- ID和类命名
  - 使用有意义或通用的ID和类名
  - 应该首选具体且反映元素目的的名称
- ID和类命名样式
  - 尽可能使用简短的ID和类命名
- 类型选择器
  - 尽量避免使用类型选择器，除非必要，不能使用将元素名称与ID或类名结合的选择器
- 简写属性
  - 尽量使用简写属性，即使只显式设置一个值也应该使用合并属性
- 0和单位
  - 除非必要，否则在'0'值后省略单位规格
- 十六进制表示法
  - 尽可能使用3个字符的十六进制表示法
- ID和类名分隔符
  - 使用中横线`-`分隔ID和类名中的单词
- 伪元素和伪类
  - 使用CSS3标准，伪元素和伪类分开

## CSS格式规则

- 相关样式应该放在一起，且按下列顺序书写

> 1.布局定位属性：position display float left top right bottom overflow clear z-index

> 2.自身属性：width height padding border margin background

> 3.文字样式： font-family font-size font-style font-weight font-varient color

> 4.文本属性：text-align vertical-align text-wrap text-transform text-indent text-decoration letter-spacing word-spacing white-space text-overflow

> 5.其他属性（CSS3）：content box-shadow border-radius transform background:linear-gradient

- 缩进
  - 使用tab进行缩进，且缩进所有的块内容
- 声明块分离
  - 在最后一个选择器和声明块后直接使用空格，并在`{`后进行换行
- 选择器与声明分离
  - 使用新行分隔选择器和声明
- 结束声明
  - 每次声明后都使用分号结束声明
- 属性和值
  - 始终在属性和值之间使用单个空格（但在属性和冒号之间没有空格）。
- 规则分离
  - 始终在规则间放置一个空行
- CSS引号
  - 对属性选择器和属性值使用单引号`'`,不要在URL值(`url()`)中使用引号
