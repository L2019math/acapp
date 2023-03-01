// 存放所有对象(物体，即包括小球和技能火球)的数组
let AC_GAME_OBJECTS = []


// 实现一个简易的游戏引擎
// 一个渲染的基类
class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false; // 是否执行过 start 函数
        this.timedelta = 0 ; // 当前帧距离上一帧的时间间隔，单位：ms
        this.uuid = this.create_uuid();
    }

    // 对于地图中的每个物体需要创建唯一编号便于多人对战的同步
    create_uuid() {
        let res = "";
        for(let i=0;i<8;i++) {
            let x = Math.floor(Math.random() * 10);
            res += x;
        }
        return res;
    }
    start() {  // 只会在第一帧执行

    }

    update() { // 每一帧均会执行

    }

    late_update() { //每一帧均会执行一次，且在所有 update 执行完后才执行

    }

    on_destroy() { // 在被销毁前执行一次

    }
    destroy() { // 删除该物体
        this.on_destroy();
        for (let i =0;i<AC_GAME_OBJECTS.length;i++){
            if(AC_GAME_OBJECTS[i] === this ){
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
        }
    }

}

let last_timestamp;

// 每秒渲染 60 次
// 递归结构，确保每一帧都调用一次函数，后续无限渲染下去

let GAME_AMINATION = function (timestamp) {
    for (let i =0;i<AC_GAME_OBJECTS.length;i++) {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }

    }

    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();
    }

    last_timestamp = timestamp;
    requestAnimationFrame(GAME_AMINATION);
}

requestAnimationFrame(GAME_AMINATION);

