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

### `stylelint`

安装依赖：

```shell
$ pnpm add --save-dev \
  postcss@^8 \
  postcss-html@^1 \
  postcss-scss@^4 \
  stylelint@^16 \
  stylelint-config-html@^1 \
  stylelint-config-recess-order@^5 \
  stylelint-config-recommended-scss@^14 \
  stylelint-config-recommended-vue@^1 \
  stylelint-config-standard@^36
$ pnpm update
```

配置 `.stylelintrc.mjs` 文件：

```shell
$ cat <<EOF > .stylelintrc.mjs
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-recommended-vue/scss",
    "stylelint-config-html/vue",
    "stylelint-config-recess-order",
  ],
  overrides: [
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html",
    },
    {
      files: ["**/*.{css,scss}"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "import-notation": "string", // ("string"|"url")
    "selector-class-pattern": null,
    "custom-property-pattern": null,
    "keyframes-name-pattern": null,
    "no-descending-specificity": null,
    "no-empty-source": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "export", "deep"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: [],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["apply", "use"],
      },
    ],
  },
};
EOF
$ git add .stylelintrc.mjs
```

配置 `.stylelintignore` 文件：

```shell
$ cat <<EOF > .stylelintignore
dist
node_modules
.husky
.vscode
.idea
*.sh
*.md

src/assets
EOF
$ git add .stylelintignore
```

添加 `lint:stylelint` 脚本：

```shell
$ cat <<EOF | patch package.json
@@ -7,6 +7,7 @@
     "dev": "vite",
     "build": "vue-tsc -b && vite build",
     "preview": "vite preview",
-    "lint:eslint": "eslint --fix --ext .ts,.js,.vue ./src"
+    "lint:eslint": "eslint --fix --ext .ts,.js,.vue ./src",
+    "lint:stylelint": "stylelint  \"**/*.{css,scss,vue}\" --fix"
   },
   "dependencies": {
EOF
```

> git commit: `build: setup and run stylelint`

### `prettier`

安装依赖：

```shell
$ pnpm add --save-dev prettier@^3 eslint-config-prettier@^9 eslint-plugin-prettier@^5
$ pnpm update
```

配置 `.prettierrc.mjs` 文件：

```shell
$ cat <<EOF > .prettierrc.mjs
export default {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
  printWidth: 120,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  vueIndentScriptAndStyle: false,
  endOfLine: "lf",
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "html",
      },
    },
  ],
};
EOF
$ git add .prettierrc.mjs
```

配置 `.prettierignore` 文件：

```shell
$ cat <<EOF > .prettierignore
dist
node_modules
.husky
.vscode
.idea
*.sh
*.md

src/assets
EOF
$ git add .prettierignore
```

修改 `eslint` 配置文件 `.eslintrc.cjs`：

```shell
$ cat <<EOF | patch .eslintrc.cjs
@@ -10,6 +10,8 @@
     // https://eslint.vuejs.org/user-guide/#usage
     "plugin:vue/vue3-recommended",
     "plugin:@typescript-eslint/recommended",
+    "prettier",
+    "plugin:prettier/recommended",
   ],
   parserOptions: {
     ecmaVersion: "latest",
@@ -24,6 +26,14 @@
     extraFileExtensions: [".vue"],
   },
   plugins: ["vue", "@typescript-eslint"],
+  rules: {
+    "prettier/prettier": [
+      "error",
+      {
+        useTabs: false, // 不使用制表符
+      },
+    ],
+  },
   // eslint不能对html文件生效
   overrides: [
     {
EOF
```

添加 `lint:prettier` 脚本：

```shell
$ cat <<EOF | patch package.json
@@ -8,6 +8,7 @@
     "build": "vue-tsc -b && vite build",
     "preview": "vite preview",
     "lint:eslint": "eslint --fix --ext .ts,.js,.vue ./src",
+    "lint:prettier": "prettier --write \"**/*.{js,cjs,ts,json,tsx,css,less,scss,vue,html,md}\"",
     "lint:stylelint": "stylelint  \"**/*.{css,scss,vue}\" --fix"
   },
   "dependencies": {
EOF
```

> git commit: `build: setup and run prettier`

## 配置 git 提交 hook 和 lints

### `husky`

安装依赖：

```shell
$ pnpm add --save-dev husky@9
$ pnpm update
$ pnpm exec husky init
# 设置总是成功的无用指令，以便提交
$ echo "pnpm -v" > .husky/pre-commit
```

> git commit: `chore: setup husky`

### `lint-staged`

安装依赖：

```shell
$ pnpm add --save-dev lint-staged@^15
$ pnpm update
```

配置 `lint-staged`：

```shell
$ cat <<EOF > .lintstagedrc.json
{
  "*.{js,ts}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{cjs,json}": [
    "prettier --write"
  ],
  "*.{vue,html}": [
    "eslint --fix",
    "prettier --write",
    "stylelint --fix"
  ],
  "*.{scss,css}": [
    "stylelint --fix",
    "prettier --write"
  ],
  "*.md": [
    "prettier --write"
  ]
}
EOF
$ git add .lintstagedrc.json
```

添加 `lint:lint-staged` 脚本：

```shell
$ cat <<EOF | patch package.json
@@ -10,6 +10,7 @@
     "lint:eslint": "eslint --fix --ext .ts,.js,.vue ./src",
     "lint:prettier": "prettier --write \"**/*.{js,cjs,ts,json,tsx,css,less,scss,vue,html,md}\"",
     "lint:stylelint": "stylelint  \"**/*.{css,scss,vue}\" --fix",
+    "lint:lint-staged": "lint-staged",
     "prepare": "husky"
   },
   "dependencies": {
EOF
```

设置为 `pre-commit` 钩子：

```shell
$ cat <<EOF > .husky/pre-commit
pnpm run lint:lint-staged
EOF
$ git add .husky/pre-commit
```

> git commit: `chore: setup lint-staged`

### `commitlint`

安装依赖：

```shell
$ pnpm add --save-dev \
  @commitlint/cli@^19 \
  @commitlint/config-conventional@^19 \
  @commitlint/types@^19
$ pnpm update
```

配置 `commitlint`：

> 注意，后面安装的 `cz-git` 与 `commitlint` 共享配置文件，但不支持 TS。这里使用 js 格式。

```shell
$ cat <<EOF > .commitlintrc.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"],
    ],
  },
};
EOF
$ git add .commitlintrc.js
```

配置为 `commit-msg` 钩子：

```shell
$ echo "pnpm dlx commitlint --edit \$1" > .husky/commit-msg
$ git add .husky/commit-msg
```

> git commit: `chore: setup commitlint`

### `commitizen` 和 `cz-git`

安装依赖：

```shell
$ pnpm add --save-dev commitizen@^4 cz-git@^1
$ pnpm update
```

配置 `commitizen`：

```shell
$ cat <<EOF | patch package.json
@@ -13,4 +13,9 @@
     "lint:lint-staged": "lint-staged",
     "prepare": "husky"
   },
+  "config": {
+    "commitizen": {
+      "path": "node_modules/cz-git"
+    }
+  },
   "dependencies": {
EOF
```

配置 `cz-git`：

```shell
$ cat <<EOF | patch .commitlintrc.js
@@ -8,4 +8,75 @@
       ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"],
     ],
   },
+  prompt: {
+    alias: { fd: "docs: fix typos" },
+    messages: {
+      type: "Select the type of change that you're committing:",
+      scope: "Denote the SCOPE of this change (optional):",
+      customScope: "Denote the SCOPE of this change:",
+      subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
+      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
+      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
+      footerPrefixesSelect: "Select the ISSUES type of changeList by this change (optional):",
+      customFooterPrefix: "Input ISSUES prefix:",
+      footer: "List any ISSUES by this change. E.g.: #31, #34:\n",
+      generatingByAI: "Generating your AI commit subject...",
+      generatedSelectByAI: "Select suitable subject by AI generated:",
+      confirmCommit: "Are you sure you want to proceed with the commit above?",
+    },
+    types: [
+      { value: "feat", name: "feat:     ✨  A new feature", emoji: ":sparkles:" },
+      { value: "fix", name: "fix:      🐛  A bug fix", emoji: ":bug:" },
+      { value: "docs", name: "docs:     📝  Documentation only changes", emoji: ":memo:" },
+      { value: "style", name: "style:    💄  Changes that do not affect the meaning of the code", emoji: ":lipstick:" },
+      {
+        value: "refactor",
+        name: "refactor: ♻️   A code change that neither fixes a bug nor adds a feature",
+        emoji: ":recycle:",
+      },
+      { value: "perf", name: "perf:     ⚡️  A code change that improves performance", emoji: ":zap:" },
+      {
+        value: "test",
+        name: "test:     ✅  Adding missing tests or correcting existing tests",
+        emoji: ":white_check_mark:",
+      },
+      {
+        value: "build",
+        name: "build:    📦️   Changes that affect the build system or external dependencies",
+        emoji: ":package:",
+      },
+      { value: "ci", name: "ci:       🎡  Changes to our CI configuration files and scripts", emoji: ":ferris_wheel:" },
+      { value: "chore", name: "chore:    🔨  Other changes that don't modify src or test files", emoji: ":hammer:" },
+      { value: "revert", name: "revert:   ⏪️  Reverts a previous commit", emoji: ":rewind:" },
+    ],
+    useEmoji: true,
+    emojiAlign: "center",
+    useAI: false,
+    aiNumber: 1,
+    themeColorCode: "",
+    scopes: [],
+    allowCustomScopes: true,
+    allowEmptyScopes: true,
+    customScopesAlign: "bottom",
+    customScopesAlias: "custom",
+    emptyScopesAlias: "empty",
+    upperCaseSubject: false,
+    markBreakingChangeMode: false,
+    allowBreakingChanges: ["feat", "fix"],
+    breaklineNumber: 100,
+    breaklineChar: "|",
+    skipQuestions: [],
+    issuePrefixes: [{ value: "closed", name: "closed:   ISSUES has been processed" }],
+    customIssuePrefixAlign: "top",
+    emptyIssuePrefixAlias: "skip",
+    customIssuePrefixAlias: "custom",
+    allowCustomIssuePrefix: true,
+    allowEmptyIssuePrefix: true,
+    confirmColorize: true,
+    scopeOverrides: undefined,
+    defaultBody: "",
+    defaultIssues: "",
+    defaultScope: "",
+    defaultSubject: "",
+  },
 };
EOF
```

添加 `commit` 脚本

```shell
$ cat <<EOF | patch package.json
@@ -11,7 +11,8 @@
     "lint:prettier": "prettier --write \"**/*.{js,cjs,ts,json,tsx,css,less,scss,vue,html,md}\"",
     "lint:stylelint": "stylelint  \"**/*.{css,scss,vue}\" --fix",
     "lint:lint-staged": "lint-staged",
-    "prepare": "husky"
+    "prepare": "husky",
+    "commit": "git-cz"
   },
   "config": {
     "commitizen": {
EOF
```

> git commit: `chore: :hammer: setup commitizen and cz-git`
