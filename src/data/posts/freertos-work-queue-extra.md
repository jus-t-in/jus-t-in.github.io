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
![alt text](images/freertos-work-queue-extra/image.png)

## 2.变灯开关实现
### 1、新建工程
#### 1）设置Debug模式和时间基准
![alt text](images/freertos-work-queue-extra/image-1.png)

#### 2）RCC设置
设置外部时钟为晶振，时钟设置里把主频设置为72MHz。
![alt text](images/freertos-work-queue-extra/image-2.png)
![alt text](images/freertos-work-queue-extra/image-3.png)

#### 3）串口设置
打开USART1，设置中断enable。
![alt text](images/freertos-work-queue-extra/image-4.png)
根据原理图设置LED的GPIO为推挽输出。
![alt text](images/freertos-work-queue-extra/image-5.png)
![alt text](images/freertos-work-queue-extra/image-6.png)

按键设置为输入模式PE4(k1)和PE3(k2)
![alt text](images/freertos-work-queue-extra/image-7.png)
![alt text](images/freertos-work-queue-extra/image-8.png)

#### 4)开启freertos
Allocation（as external）:只在文件中声明函数，不做具体函数定义。需要自己在其他函数代码中实现函数定义。  
Allocation（as weak）:在文件中生成函数定义，但有weak修饰。可以在其他代码中用代码覆盖。
![alt text](images/freertos-work-queue-extra/image-9.png)![alt text](images/freertos-work-queue-extra/image-10.png)

#### 5)项目设置
![alt text](images/freertos-work-queue-extra/image-11.png)
为每个外设生成单独.c/.h文件
![alt text](images/freertos-work-queue-extra/image-12.png)
然后生成代码，打开Clion。
![alt text](images/freertos-work-queue-extra/image-13.png)
由于之前freertos的设置，freertos.c中的函数有了变化
![alt text](images/freertos-work-queue-extra/image-14.png)![alt text](images/freertos-work-queue-extra/image-15.png)

### 2、写代码
#### 1)新建目录
App放应用层代码，下面加一个Tasks放任务代码。
![alt text](images/freertos-work-queue-extra/image-16.png)

#### 2)初始框架
复制KeyTask声明，写个无限循环
![alt text](images/freertos-work-queue-extra/image-17.png)
LEDTask同上
![alt text](images/freertos-work-queue-extra/image-18.png)
此外clion中创建的.c文件，会被自动写到CMakeLists文件中。但最好移动到target_sources下
![alt text](images/freertos-work-queue-extra/image-19.png)
![alt text](images/freertos-work-queue-extra/image-20.png)

#### 3)按键任务
用队列时还需要在CubeMX中设置。
![alt text](images/freertos-work-queue-extra/image-21.png)
传什么数据，就天什么格式。但结构体一般比较大，所以传指针。本例中就两个枚举，加起来就16位，可以直接传LEDMessaged。
![alt text](images/freertos-work-queue-extra/image-22.png)
由于LEDMessage定义在KryTask.c中，这里拿不到。要在重建个Types。
![alt text](images/freertos-work-queue-extra/image-23.png)
不用勾选添加到目标，参与编译。  
  
把定义复制到LEDType.h头文件内

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

为了让其他文件能找到此头文件，修改CMakeLists文件。在target_include_directories里设置寻找头文件目录。  
顺手刷新下CMake
![alt text](images/freertos-work-queue-extra/image-24.png)
然后到KeyTaks.c和freertos.c中包含

    #include "Types/LEDType.h"

然后就不报错了
![alt text](images/freertos-work-queue-extra/image-25.png)
此外LEDQueueHandle只在freertos.c中定义了，KeyTaks.c也拿不到。所以要将这些放到main.h中进行extern导出。并include cmsis_os2.h。
![alt text](images/freertos-work-queue-extra/image-26.png)
麻了
KeyTask.c如下：

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


#### 4)LED任务
用osMessageQueueGet读msg中的变量，再控制小灯亮灭。  
用了动态内存要记得释放。  

    vPortFree(msg);
    // 因为此任务是由LEDQueue接收到数据驱动
    // 没任务就不会调用CPU，所以这个osDelay(10)没必要
    // osDelay(10);


### 3、配置下载工具
![alt text](images/freertos-work-queue-extra/image-27.png)
![alt text](images/freertos-work-queue-extra/image-28.png)
按一次按钮，绿灯变一次状态。

## 3.接受指令控灯
通过串口，接收上位机指令，来控制小灯状态。
![alt text](images/freertos-work-queue-extra/image-29.png)
指令协议
![alt text](images/freertos-work-queue-extra/image-30.png)

### 1、创建任务
#### 1）ioc修改
新建用于一个串口解析的任务
![alt text](images/freertos-work-queue-extra/image-31.png)

新建一个用于用于串口中断向command task发送接收到的串口数据  
![alt text](images/freertos-work-queue-extra/image-32.png)
然后生成代码

#### 2）复制句柄定义到main.h
![alt text](images/freertos-work-queue-extra/image-33.png)

#### 3) 写代码
然后到usart.c中实现串口中断接收的逻辑
    
    uint8_t rxData;

    void UART1_Receive_Start() {
    HAL_UART_Receive_IT(&huart1,&rxData,1);
    }

    // 重定义串口接收回调函数
    // 找HAL_UART_RxCplt定义，复制过来避免写错
    void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart) {
    if (huart->Instance == USART1) {
        // 等待时间只能为0，因为中断不能阻塞
        osMessageQueuePut(CommandTaskHandle, &rxData, 0, 0);
        HAL_UART_Receive_IT(&huart1,&rxData,1);
    }
    }

#### 4）uart.h中添加声明
![alt text](images/freertos-work-queue-extra/image-34.png)

#### 5）创建文件
![alt text](images/freertos-work-queue-extra/image-35.png)
![alt text](images/freertos-work-queue-extra/image-36.png)

## 附件
### 1、CommandTask.c
    
    //
    // Created by q on 2026/5/13.
    //
    #include "cmsis_os2.h"
    #include "FreeRTOS.h"
    #include "usart.h"
    #include "main.h"
    #include "Types/LEDType.h"

    #define FRAME_HEAD 0xAA
    #define CMD_SET_LED 0xB1

    void StartCommandTask(void *argument) {
        UART1_Receive_Start();

        uint8_t receive;
        uint8_t command[30];
        uint8_t commandIndex = 0;
        uint8_t commandLength = 0;   // AA 后面的字节数

        for (;;) {
            osMessageQueueGet(CommandQueueHandle, &receive, 0, osWaitForever);

            if (commandIndex == 0) {
                if (receive == FRAME_HEAD) {
                    command[commandIndex++] = receive;
                }
                continue;
            }

            if (commandIndex == 1) {
                if (receive < 4 || receive > sizeof(command) - 1) {
                    commandIndex = 0;
                    commandLength = 0;
                    continue;
                }

                commandLength = receive;
                command[commandIndex++] = receive;
                continue;
            }

            command[commandIndex++] = receive;

            // commandLength 表示 AA 后面的字节数
            // 总帧长 = 1 个 AA + commandLength
            if (commandIndex == commandLength + 1) {
                uint8_t checksum = 0;

                // 最后 1 个字节是 checksum，所以只加到 commandIndex - 2
                for (uint8_t i = 0; i < commandIndex - 1; i++) {
                    checksum += command[i];
                }

                if (checksum == command[commandIndex - 1]) {
                    uint8_t led_id = command[2];
                    uint8_t led_state = command[3];
                    uint8_t cmd = command[4];

                    if (cmd == CMD_SET_LED) {
                        LEDMessage *message = pvPortMalloc(sizeof(LEDMessage));

                        if (message != NULL) {
                            if (led_id == 1) {
                                message->color = LEDColor_Green;
                            } else if (led_id == 2) {
                                message->color = LEDColor_Blue;
                            } else {
                                vPortFree(message);
                                message = NULL;
                            }

                            if (message != NULL) {
                                message->state = led_state ? LEDState_On : LEDState_Off;
                                osMessageQueuePut(LEDQueueHandle, &message, 0, osWaitForever);
                            }
                        }
                    }
                }

                commandIndex = 0;
                commandLength = 0;
            }

            // 防止异常数据导致越界
            if (commandIndex >= sizeof(command)) {
                commandIndex = 0;
                commandLength = 0;
            }
        }
    }

### 2、KeyTask.c

    //
    // Created by q on 2026/5/11.
    //

    #include <stdlib.h>

    #include "cmsis_os2.h"
    #include "main.h"
    // 用pvPortMalloc要：include "FreeRTOS.h"
    #include "FreeRTOS.h"
    // #include "Types/LEDType.h"
    #define IS_KEY_PRESSED() (HAL_GPIO_ReadPin(k1_GPIO_Port, k1_Pin) == GPIO_PIN_RESET)
    // 检测间隔
    #define KEY_CHECK_INTERVAL 10
    // 消抖时间
    #define KEY_DEBOUNCE_TIME 30
    // 消抖次数
    #define KEY_DEBOUNCE_COUNT (KEY_DEBOUNCE_TIME / KEY_CHECK_INTERVAL)

    uint8_t isKey1Clicked() {
        static uint8_t count = 0;
        static uint8_t pressed = 0;
        if (IS_KEY_PRESSED() && !pressed) {
            count++;
            if (count >= KEY_DEBOUNCE_COUNT && IS_KEY_PRESSED()) {
            pressed = 1;
            return 1;
            }
        }
        if (!IS_KEY_PRESSED()) {
            count = 0;
            pressed = 0;
            }
        return 0;
    }

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
                message->state = state;
                // 第二个参数传指针，所以取地址
                osMessageQueuePut(LEDQueueHandle, (&message), 0, osWaitForever);
            }
            osDelay(10);
        }
    }

### 3、LEDTask.c

    #include "cmsis_os2.h"
    #include "main.h"
    #include "FreeRTOS.h"
    #include "Types/LEDType.h"
    //
    // Created by q on 2026/5/11.
    //
    void StartLEDTask(void *argument) {
        for (;;) {
            LEDMessage *msg ;
            osMessageQueueGet(LEDQueueHandle, &msg, 0, osWaitForever);
            switch (msg->color) {
                case LEDColor_Blue:
                    // 原理图中我的灯接的是3.3v，所以要低电平亮灯。高电平SET不亮
                    HAL_GPIO_WritePin(blue_GPIO_Port, blue_Pin, msg->state ? GPIO_PIN_RESET : GPIO_PIN_SET);
                    break;
                case LEDColor_Green:
                    HAL_GPIO_WritePin(green_GPIO_Port, green_Pin, msg->state ? GPIO_PIN_RESET : GPIO_PIN_SET);
                    break;
            }
            // 用了动态内存要记得释放
            vPortFree(msg);
            // 因为此任务是由LEDQueue接收到数据驱动
            // 没任务就不会调用CPU，所以这个osDelay(10)没必要
            // osDelay(10);
        }
    }
