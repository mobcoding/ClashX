## v1.0.6

- Restore automatic group selection after latency testing and refresh the active node.

---

## v1.0.5

- Simplify page headings and align the subscription import bar with a consistent gap above the list.
- Isolate ClashX installation, profiles, background service and default ports from Clash Verge Rev.
- Standardize sidebar navigation with monochrome outline icons and consistent label spacing.
- Integrate window controls into page headings and show application uptime in the sidebar.
- Polish page alignment, node-list corners and subscription usage colors, and simplify settings labels.
- Group advanced settings into compact, independently stacked cards.
- Unify toggle switches across pages with the Settings switch style.
- Arrange subscription cards around status, traffic usage and update details.
- Rename application titles, installer branding and notifications to ClashX.
- Windows: Start with the custom title bar even when an older window state saved the system title bar.

---

## v1.0.4

- Replace application, installer and tray icons with the white-circle umbrella design.
- Simplify navigation, overview, nodes and settings with a consistent light and dark interface.

---

## v1.0.3

- Windows: Use the custom title bar by default while keeping the system title bar optional.

---

## v1.0.2

- Disable application and core logging by default while keeping log levels configurable.
- Bundle only the stable Mihomo core and migrate preview-core selections automatically.

- Limit application and installer languages to Simplified Chinese and English.
- Publish an update to validate upgrading from v1.0.1.

---

## v1.0.1

- Switch application updates to mobcoding/ClashX releases.

---

## v2.5.9

<details>
<summary><strong> 🐞 修复问题 </strong></summary>

- 修复通过 URL 导入订阅时，即使导入的订阅并非当前使用的订阅，也会重新加载当前配置的问题
- 修复「首页」网站测速失败后卡片一直显示测试中的问题

**🐧 Linux**

- Linux：修复 deb/rpm 安装包错误包含多余的 `frontend-contract` 可执行文件，导致下游重新打包失败的问题

</details>

<details>
<summary><strong> ✨ 新增功能 </strong></summary>


</details>

<details>
<summary><strong> 🚀 优化改进 </strong></summary>


**🖥️ Windows**

- Windows 系统代理默认绕过 `*.local` 域名，访问局域网设备的 `.local` 主机名时不再经过代理

</details>
