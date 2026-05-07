---
title: 'FreeRTOS优先级'
category: 'Softwares'
date: '2026/05/7 19:09'
modifiedDate: '2026/05/7 19:09'
---

# FreeRTOS优先级
https://www.bilibili.com/video/BV1Np1WBREu3


## 1.优先级与抢占式调度
就绪态中的任务，存在优先级，并且存在多组队列。
当高优先级任务从bloccked/suspended切换到ready，会抢占正在运行的低优先级任务的执行。

## 2.实操
### 1、修改任务优先级
在cubMX中打开ioc文件，修改见图
![alt text](images/freertos-work-priorities/image.png)

### 2、代码中优先级
ctrl+点击 第三个参数
![alt text](images/freertos-work-priorities/image-1.png)
可以看到在cubeMX中设置的任务优先级
![alt text](images/freertos-work-priorities/image-2.png)
再转到优先级的定义，可以看到优先级的定义就是数字，数字越大优先级越高
![alt text](images/freertos-work-priorities/image-3.png)
最多56个优先级
![alt text](images/freertos-work-priorities/image-4.png)
其他设置参数可以在cubeMX中修改，可在以下网址查看说明。
https://docs.baud-dance.com/docs/stm32/freertos/cubeConfig

