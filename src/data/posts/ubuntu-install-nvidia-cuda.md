---
title: 'Ubuntu 安装 NVIDIA 驱动和 CUDA (NVCC)'
category: 'Linux'
date: '2025/04/10 10:00'
modifiedDate: '2026/04/05 05:07'
---

## 列出 GPU 信息

```sh
lspci | egrep -i "vga|3d|display"
```

或者：

```sh
# sudo apt-get install lshw
sudo lshw -C display
```

## 【重要】确保 Secure Boot 关闭

```sh
sudo mokutil --sb-state
```

输出应为 `SecureBoot disabled`。如果是 `SecureBoot enabled`，需要进入 BIOS 关闭。

运行：

```sh
sudo systemctl reboot --firmware-setup
```

会自动进入启动菜单界面，选择 `EFI Setup`（通常在最下面）进入 BIOS 设置界面。
