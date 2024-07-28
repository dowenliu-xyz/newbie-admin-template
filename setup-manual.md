搭建记录 - 作为超新手
---
当前手册记录了搭建最少“魔法”的 vue admin 项目的步骤。最终项目结构可能不是最佳生产实践，但它应该非常适合新手起步：使用的技术易于理解、阅读，可安全的进行按需修改调整。

为了方便在之后复现，我尽可能固定安装的组件的版本。

> 个人吐槽：按网上的文章学习前端总是难以复现文章内容，组件更新太泥马快了。这些年里，我尝试过好多次自学前端，几乎没见过有固定版本号意识的作者。。。。

## 搭建项目之前

### Node.js

我使用 `nvm` 来管理 node 版本。`nvm` 的安装这里不详述，参考 [GitHub](https://github.com/nvm-sh/nvm)。
我当前使用的 node 版本为 `v20.15.1`.

```shell
$ nvm install --lts=iron
$ nvm alias default lts/iron
$ nvm current
# v20.16.0
```

### Package manager

我选择使用 `pnpm` 作为包管理器。我不想总结我不选择使用默认的 `npm` 的理由，起码它在我的环境里很慢。

> 我作为新手，搭建本项目时我的学习、参考文章大多都使用 `pnpm` ，所以我也直接使用它。我不想不断搜索解决工具相关问题。

使用 `corepack` 启用 `pnpm`。

```shell
$ corepack enable pnpm
```

> 注意，我这里之前尝试全局安装过 `pnpm` ，之后这导致我 `corepack` 启用 `pnpm` 失败，直到我删除了全局安装。
> 我选择 `corepack` 启用 `pnpm` 是因为我想之后通过 `corepack use pnpm@latest` 命令把包管理器类型版本固定在 `package.json` 里。这对统一团队开发环境一致性有益。

## 创建工程

通过以下命令创建工程：

```shell
$ pnpm create vite@5 newbie-admin-template --template vue-ts
```

> 注意到 `vite@5` 中了 `@5` 了吗？我期望在命令中固定版本（起码是大版本，no breaking change in future），我期望之后这样可以让任何人可以重现操作结果。
> 当前 `vite` 最新版本为 `5.x`。

之后切换到工程目录：

```shell
$ cd newbie-admin-template
```

> git commit: `build: Initialized project`

固定 `package.json` 中包管理器为 `pnpm@latest` ：

```shell
$ corepack use pnpm@latest
```

> git commit: `build: fix packageManager to pnpm@latest`

## 配置 "@" 路径别名

将 `src` 目录别名配置为 `@` 似乎是非常常见的做法。

> 为了减少后面代码中与我的参考文章中内容的差异，我也这样做。另外，我觉得这点配置不太“魔法”。

首先需要安装 `@types/node` 开发依赖：

```shell
$ pnpm add --save-dev @types/node@^20
$ pnpm update
```

> 需要同时配置 `vite.config.ts` 和 `tsconfig.*.json` 文件。

在 `vite.config.ts` 中配置：

```shell
$ cat <<EOF | patch vite.config.ts
@@ -1,7 +1,17 @@
-import { defineConfig } from 'vite'
+import { defineConfig, UserConfig } from "vite";
 import vue from '@vitejs/plugin-vue'
+import { resolve } from 'path'
+
+const pathSrc = resolve(__dirname, 'src')
 
 // https://vitejs.dev/config/
-export default defineConfig({
-  plugins: [vue()],
-})
+export default defineConfig((): UserConfig => {
+  return {
+    resolve: {
+      alias: {
+        '@': pathSrc,
+      },
+    },
+    plugins: [vue()],
+  };
+});
EOF
```

在 `tsconfig.app.json` 中配置：

```shell
$ cat <<EOF | patch tsconfig.app.json
@@ -1,5 +1,10 @@
 {
   "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+      "@/*": ["src/*"]
+    },
+
     "composite": true,
     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
     "target": "ES2020",
EOF
```

在 `tsconfig.node.json` 中配置：

```shell
$ cat <<EOF | patch tsconfig.node.json
@@ -1,5 +1,10 @@
 {
   "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+      "@/*": ["src/*"]
+    },
+
     "composite": true,
     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
     "skipLibCheck": true,
EOF
```

> git commit: `build: add '@' path alias`

## 使用 `.editorconfig` 统一编辑器配置

```shell
$ cat <<EOF > .editorconfig
# https://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
EOF
$ git add .editorconfig
```

> git commit: `chore: add .editorconfig`

## 配置 `eslint` 、 `stylelint` 和 `prettier`

### `eslint`

当前最新 `eslint` 版本为 `9.x`，这个版本的配置格式与之前版本有比较大的变化，且有此组件还有没很好的适配这个版本。

> 我找到的参考资料也几乎没有使用 `9.x` 版本配置格式的。

这里选择使用 `8.x` 版本，避坑。

安装依赖

```shell
$ pnpm add --save-dev eslint@^8 @typescript-eslint/eslint-plugin@^7 eslint-plugin-vue@^9
$ pnpm update
```

不要使用官网 `8.x` 版本文档提供的初始化方式。其使用 `@eslint/config` 总是会安装 `9.x` 版本及该版本格式配置。

手工书写配置文件：

> `eslint` 不支持 ESM 格式语法，只能使用 CommonJS 格式。

```shell
$ cat <<EOF > .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  extends: [
    // https://eslint.vuejs.org/user-guide/#usage
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // https://juejin.cn/post/7189536752062136357
    parser: {
      "ts": "@typescript-eslint/parser",
      "<template>": "espree",
    },
    project: "./tsconfig.*?.json",
    createDefaultProgram: false,
    extraFileExtensions: [".vue"],
  },
  plugins: ["vue", "@typescript-eslint"],
  // eslint不能对html文件生效
  overrides: [
    {
      files: ["*.html"],
      processor: "vue/.vue",
    },
  ],
  // https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
  globals: {
    OptionType: "readonly",
  },
};
EOF
$ git add .eslintrc.cjs
```

> 如果以上命令输出的文件中 URL 被转译了，可能需要禁用 shell 的转译功能。
> https://ilayk.com/2021/07/23/fix-oh-my-zsh-&-iterm-copy-paste-backslashes

配置 `.eslintignore` 文件：

```shell
$ cat <<EOF > .eslintignore
dist
node_modules
.husky
.vscode
.idea
*.sh
*.md

src/assets
EOF
$ git add .eslintignore
```

添加 `lint:eslint` 脚本：

```shell
$ cat <<EOF | patch package.json
@@ -6,6 +6,7 @@
   "scripts": {
     "dev": "vite",
     "build": "vue-tsc -b && vite build",
-    "preview": "vite preview"
+    "preview": "vite preview",
+    "lint:eslint": "eslint --fix --ext .ts,.js,.vue ./src"
   },
   "dependencies": {
EOF
```

> git commit: `build: setup and run eslint`
