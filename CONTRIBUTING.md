# 贡献指南

感谢你对 Trending Hub 的兴趣！本文档将指导你如何为项目做出贡献。

## 行为准则

我们承诺为所有贡献者提供一个开放、友好和尊重的社区环境。请遵守以下准则：

- 尊重不同的观点和经验
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同情

## 如何贡献

### 报告 Bug

在报告 Bug 前，请先检查 [Issue 列表](https://github.com/ChengKeJ/trendingHub/issues) 确保没有重复。

提交 Bug 报告时，请包含：

1. **清晰的标题和描述** - 简洁地说明问题
2. **重现步骤** - 详细的步骤来重现问题
3. **预期行为** - 应该发生什么
4. **实际行为** - 实际发生了什么
5. **环境信息**:
   - 操作系统和版本
   - Node.js 版本
   - 浏览器和版本
   - 任何相关的配置信息

6. **日志和错误消息** - 粘贴相关的错误信息或日志

### 建议功能

功能建议总是受欢迎的！请提交 Issue 并包含：

1. **清晰的描述** - 功能是什么，为什么需要它
2. **用例** - 这个功能将如何被使用
3. **可能的实现** - 如果你有想法的话

### 提交 Pull Request

1. **Fork 项目**

```bash
git clone https://github.com/your-username/trendingHub.git
cd trendingHub
```

2. **创建特性分支**

```bash
git checkout -b feature/your-feature-name
```

3. **进行更改**

- 遵循项目的代码风格
- 为新功能添加测试
- 更新相关文档

4. **提交更改**

```bash
git add .
git commit -m "feat: Add your feature description"
```

使用以下 commit 消息格式：
- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更改
- `style:` - 代码风格更改
- `refactor:` - 代码重构
- `perf:` - 性能改进
- `test:` - 添加或更新测试
- `chore:` - 其他更改

5. **推送到你的 Fork**

```bash
git push origin feature/your-feature-name
```

6. **提交 Pull Request**

在 GitHub 上打开 Pull Request，并提供：
- 清晰的描述你做了什么
- 为什么做这个更改
- 相关的 Issue 号（如果有）
- 测试结果

## 开发设置

### 安装依赖

```bash
pnpm install
```

### 运行开发服务器

```bash
pnpm dev
```

### 运行测试

```bash
pnpm test
```

### 运行类型检查

```bash
pnpm type-check
```

### 构建项目

```bash
pnpm build
```

## 代码风格

### TypeScript

- 使用 TypeScript 编写所有代码
- 避免使用 `any` 类型
- 为函数参数和返回值添加类型注解

### React

- 使用函数组件和 Hooks
- 使用 `useCallback` 优化性能
- 避免在 render 中创建新对象

### 样式

- 使用 Tailwind CSS 类
- 避免内联样式
- 使用 shadcn/ui 组件

### 命名约定

- 组件: PascalCase (`HomePage.tsx`)
- 函数: camelCase (`getUserData()`)
- 常量: UPPER_SNAKE_CASE (`MAX_ITEMS = 10`)
- 文件: kebab-case (`user-profile.tsx`)

## 文档

- 为新功能添加文档
- 更新 README 中的相关部分
- 为复杂的代码添加注释

## 审查流程

1. 至少一个维护者会审查你的 PR
2. 可能会要求进行更改
3. 一旦批准，PR 将被合并

## 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

## 问题？

有任何问题？请：

1. 查看 [FAQ](./README.md#常见问题)
2. 查看 [文档](./README.md#文档)
3. 提交 Issue
4. 联系维护者

---

感谢你的贡献！

