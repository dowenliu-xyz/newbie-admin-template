# 新手起步 admin 模板

主要参考了 [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin) 项目创建的起步模板。

创建该模板项目而不是直接使用 `vue3-element-admin` 项目的原因是，`vue3-element-admin` 模板已经集成了太多组件、“魔法”。
对前端小白（比如作者我）来说，除了看展示效果外，想修改用于自己的后端业务时，很难“合适”的做减法。
我希望能有一个起步模板，然后针对确定的功能、 API，一步一步的做加法，进行业务搭建。这应该也是一个新手正常的学习过程。一口气吃下全部知识的结果通常是几乎全吐出来……

[setup-manual.md](./setup-manual.md) 中记录了该模板项目从零到 0.1 😜 的搭建过程。
记录尽量详细记录了每个组件使用的大版本号，以便复现搭建过程。几乎每步的执行结果都有对应的 git 提交可供参考。
> 我没有详尽的研究每个组件，只是按 SemVer 的通常策略认为，主版本号相同，应该是相互兼容的，配置应该可以通用（至少后续次版本升级应该不受影响）。

---
相对参考的 `vue3-element-admin` 项目，变化如下：

- 明确的变化
  - 不使用 `unplugin-vue-components` 、 `unplugin-auto-import` 和 `unplugin-icons` 插件。

    > 但使用了 `unplugin-element-plus` 以减少 element-plus 组件样式导入代码。

    主要理由在 `setup-manual.md` 中有说明。另外我觉得这些 `unplugin` 插件在配置上会导致新手更加困惑。

    > 代码简洁性是很难定量评价的。我个人的倾向，优先保证代码无歧义可读性，而不是追求代码**简短**、少写代码。

- 考虑的变化
  - `axios` or `fetch` ？  
    作为新手，二者我都不熟悉。`axios` 更加流行，特性更多（但没有覆盖 `fetch` 的特性，否则就不用选择了🤪）。  
    我是多年 Java 后端开发，Spring 拦截器、AOP 用的很多，所以 `axios` 的拦截器机制更加符合我的思维。  
    同时，作为曾经客户营销系统的开发者，用户行为反馈上报的场景也是我的考虑点，`fetch` 的 `keepalive` 机制是 `axios` 不具备的。  
    另外，我很喜欢“先契约、后代码”，喜欢 OAS、Swagger 这样的工具，从 API 定义生成代码。目前没有见到可以同时生成两种请求库代码的生成模板。
    为两种请求库分别生成一套代码，有违 DRY 原则。
