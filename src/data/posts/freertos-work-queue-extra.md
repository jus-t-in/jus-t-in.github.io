---
title: 'FreeRTOS队列(补充)'
category: 'Softwares'
date: '2026/05/11 19:45'
modifiedDate: '2026/05/12 21:26'
---

# FreeRTOS队列(补充)
https://www.bilibili.com/video/BV1voqGBpENb

## 1.项目设计
控灯任务
![alt text](image.png)

## 2.变灯开关实现
### 1、新建工程
#### 1）设置Debug模式和时间基准
![alt text](image-1.png)

#### 2）RCC设置
设置外部时钟为晶振，时钟设置里把主频设置为72MHz。
![alt text](image-2.png)
![alt text](image-3.png)

#### 3）串口设置
打开USART1，设置中断enable。
![alt text](image-4.png)
根据原理图设置LED的GPIO为推挽输出。
![alt text](image-5.png)
![alt text](image-6.png)

按键设置为输入模式PE4(k1)和PE3(k2)
![alt text](image-7.png)
![alt text](image-8.png)

#### 4)开启freertos
Allocation（as external）:只在文件中声明函数，不做具体函数定义。需要自己在其他函数代码中实现函数定义。  
Allocation（as weak）:在文件中生成函数定义，但有weak修饰。可以在其他代码中用代码覆盖。
![alt text](image-9.png)![alt text](image-10.png)

#### 5)项目设置
![alt text](image-11.png)
为每个外设生成单独.c/.h文件
![alt text](image-12.png)
然后生成代码，打开Clion。
![alt text](image-13.png)
由于之前freertos的设置，freertos.c中的函数有了变化
![alt text](image-14.png)![alt text](image-15.png)

### 2、写代码
#### 1)新建目录
App放应用层代码，下面加一个Tasks放任务代码。
![alt text](image-16.png)

#### 2)初始框架
复制KeyTask声明，写个无限循环
![alt text](image-17.png)
LEDTask同上
![alt text](image-18.png)
此外clion中创建的.c文件，会被自动写到CMakeLists文件中。但最好移动到target_sources下
![alt text](image-19.png)
![alt text](image-20.png)

#### 3)按键任务
用队列时还需要在CubeMX中设置。
![alt text](image-21.png)
传什么数据，就天什么格式。但结构体一般比较大，所以传指针。本例中就两个枚举，加起来就16位，可以直接传LEDMessaged。
![alt text](image-22.png)
由于LEDMessage定义在KryTask.c中，这里拿不到。要在重建个Types。
![alt text](image-23.png)
不用勾选添加到目标，参与编译。  
  
把定义复制到LEDType.h头文件内
'''
typedef enum {
    LEDColor_Green = 0,
    LEDColor_Blue = 1,
} LEDColor;

typedef enum {
    LEDState_Off = 0,
    LEDState_On = 1,
} LEDState;

typedef struct {
    LEDColor color;
    LEDState state;
}LEDMessage;
'''
为了让其他文件能找到此头文件，修改CMakeLists文件。在target_include_directories里设置寻找头文件目录。  
顺手刷新下CMake
![alt text](image-24.png)
然后到KeyTaks.c和freertos.c中包含
'''
#include "Types/LEDType.h"
'''
然后就不报错了
![alt text](image-25.png)
此外LEDQueueHandle只在freertos.c中定义了，KeyTaks.c也拿不到。所以要将这些放到main.h中进行extern导出。并include cmsis_os2.h。
![alt text](image-26.png)
麻了
KeyTask.c如下：
'''
#include <stdlib.h>
#include "cmsis_os2.h"
#include "main.h"
// 用pvPortMalloc要：include "FreeRTOS.h"
#include "FreeRTOS.h"
// #include "Types/LEDType.h"  // 不知道为什么取消注释就报错
......(完整代码见附录)
void StartKeyTask(void *argument) {
    LEDState state = LEDState_Off;
    for (;;) {
        if (isKey1Clicked()) {
            // 自动开关
            state = !state;
            // message可能没被使用就被下一次循环修改了
            // 所以要，动态申请内存
            LEDMessage* message = pvPortMalloc(sizeof(LEDMessage));
            // malloc申请的内存在程序默认堆空间
            // pvPortMalloc申请的是FreeRTOS管理的专用堆空间
            message->color = LEDColor_Green;
            message->state = LEDState_On;
            // 第二个参数传指针，所以取地址
            osMessageQueuePut(LEDQueueHandle, (&message), 0, osWaitForever);
        }
        osDelay(10);
    }
}
'''

#### 4)LED任务
用osMessageQueueGet读msg中的变量，再控制小灯亮灭。  
用了动态内存要记得释放。  
'''
        vPortFree(msg);
        // 因为此任务是由LEDQueue接收到数据驱动
        // 没任务就不会调用CPU，所以这个osDelay(10)没必要
        // osDelay(10);
'''

### 3、配置下载工具
![alt text](image-27.png)
![alt text](image-28.png)
按一次按钮，绿灯变一次状态。

## 3.接受指令控灯
通过串口，接收上位机指令，来控制小灯状态。
![alt text](image-29.png)
指令协议
![alt text](image-30.png)


