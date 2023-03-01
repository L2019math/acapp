class AcGameRank {
    constructor(root) {
        this.root = root;
        this.$rank = $(`
        <div class="ac-game-rank">
            <!-- <div class="ac-game-rank-return ac-game-return">返回</div> -->
            <div class="back back_mode"></div> 

            <!-- 表格div -->
            <div class="ac-game-rank-table">
                <table class="table table-bordered table-hover ac-game-rank-table-score">
                    <thead class="ac-game-rank-table-score-thead rank_title-font">
                        <tr>
                            <th  colspan="3">大乱斗战绩榜</th>
                        </tr>
                        <tr>
                            <th>排名</th>
                            <th>游戏ID</th>
                            <th>积分</th>
                        </tr>
                    </thead>
                    <tbody class="ac-game-rank-table-score-tbody rank_font"></tbody>
                </table>
            </div>
        </div>
        `);
        this.hide();
        this.root.$ac_game.append(this.$rank);
        // this.$return = this.$rank.find('.ac-game-rank-return');
        this.$return = this.$rank.find('.back_mode');

        this.$score_btn = this.$rank.find('.ac-game-rank-table-button-score');
        this.$score_table = this.$rank.find('.ac-game-rank-table-score');
        this.$score_table_content = this.$rank.find('.ac-game-rank-table-score-tbody');

        this.start();

    }
    start() {
        this.getinfo_rank_score();          // 获取后台数据
        this.add_listening_events();        // 添加监听事件
    }

    add_listening_events() {
        let outer = this;
        this.$return.click(function () {
            outer.hide();
            outer.root.menu.show();
        });
    }

    show() {
        this.$rank.show();
        this.$score_table.show();       // 直接展示分数界面
    }

    hide() {
        this.$rank.hide();
    }

    // 从后台获取数据
    getinfo_rank_score() {
        let outer = this;
        $.ajax({
            // 别人的，先测试效果。。。。。
            url: "https://app4504.acapp.acwing.com.cn/menu/getplayers",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    let players = resp.players;
                    for (let i = 0; i < players.length; i++) {
                        let player = players[i];
                        // let obj = "<tr><td>" + (i+1) + "</td><td>" + player.username + "</td><td>" + player.score + "</td></tr>";
                        let obj = "<tr><td id=\"serial\">" + (i + 1)  + "</td><td><img src=" + player.photo + " alt=\"photo\"  width=\"33px\" height=\"33px\" style=\"border-radius:100%; margin-left:6%\"> " + player.name + "</td><td id=\"score\">" + player.score + "</td></tr>";
                        outer.$score_table_content.append(obj);
                        // if (i === 0) console.log(player.score);
                    }
                }
            },
        });
    }
}
class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="game-menu">
                <div class="game-menu-field">
                    <div class="game-menu-field-item game-menu-field-item-single-mode">
                        Single Mode
                    </div>
                    <br>
                    <div class="game-menu-field-item game-menu-field-item-multi-mode">
                        Multi Mode
                    </div>
                    <br>
                    <div class="game-menu-field-item ac-game-menu-field-item-rank">
                        Rank List
                    </div>
                    <br>
                    <div class="game-menu-field-item game-menu-field-item-settings-mode">
                        Quit
                    </div>
                </div>
                <!--            notice                       -->
                <div class="ac-game-menu-notice">
                    <div class="ac-game-menu-notice-item1">
                        小球大乱斗游戏须知
                    </div>
                    <div class="ac-game-menu-notice-item2">
                        移动：鼠标右键点击地图进行移动<br>
                        攻击：按Q键后，点击鼠标左键进行攻击<br>
                        闪现：按F键后，点击鼠标左键进行闪现<br>
                        聊天：按ENTER键打开对话框，按ESC键关闭对话框
                    </div>
                    <div class="ac-game-menu-notice-item3">
                        聊天仅限多人模式<br>
                        多人模式下，三人即可开始游戏<br>
                        对局结束后，点击屏幕返回菜单页面
                    </div>
                </div>
            </div>


        `);

        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.game-menu-field-item-single-mode')
        this.$multi = this.$menu.find('.game-menu-field-item-multi-mode')
        this.$rank = this.$menu.find(".ac-game-menu-field-item-rank");
        this.$settings = this.$menu.find('.game-menu-field-item-settings-mode')

        this.start();
    }
    start() {
        this.add_listening_events();
    }

    // 监听函数
    add_listening_events() {
        let outer = this;
        this.$single.click(function (){
            console.log("click single mode");
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi.click(function (){
            console.log("click multi mode");
            outer.hide();
            outer.root.playground.show("multi mode");
        });
        this.$rank.click(function(){
            console.log("click rank list");
            outer.hide();
            outer.root.rank.show();
        });
        this.$settings.click(function (){
            console.log("click settings mode");
            outer.root.settings.logout_on_remote();
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}
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

class ChartField {
    constructor(playground) {
        this.playground = playground;
        this.$history = $('<div class="game-chat-field-history">history</div>');
        this.$input = $('<input type="text" class="game-chat-field-input"></input>');

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_event();
    }

    add_listening_event() {
        let outer = this;
        this.$input.keydown(function (e) {
           if(e.which === 27) { // ESC 键
               outer.hide_input(); // 关掉聊天框
               return false; // esc事件不向下传递了
           }
           else if (e.which === 13) // enter 键
           {
               let username = outer.playground.root.settings.username;
               let text = outer.$input.val();
               if(text) {
                   outer.$input.val("");
                   outer.add_message(username,text);
                   outer.playground.mps.send_message(username,text);
               }
               return false;
           }
        });
    }
    render_message(message) {
        return $(`<div>${message}</div>`);
    }
    add_message(username, text) {
        this.show_history();
        let message = `[${username}]${text}`;

        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }
    show_history() {
        let outer = this;
        this.$history.fadeIn();

        if(this.func_id) clearTimeout(this.func_id);
        // 定时
        this.func_id = setTimeout(function () {
            outer.$history.fadeOut();
            outer.func_id = null;
        },3000);
    }


    show_input() {
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}// 网格系统
class Grid extends AcGameObject{
    constructor(playground, x, y, r){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.r = r;
    }
    start(){

    }

    update(){
        this.render();
    }


    render(){
        // 渲染网格系统
        let grid_width = this.playground.virtual_width / 32;
        let grid_height = this.playground.virtual_height / 18;
        let r = 18, c = 32;     // 18行，32列
        for(let i = 0;i < r ; i++){
            for(let j=0; j<c; j++){
                let cx = j * grid_width, cy = i * grid_height;
                let color = "rgba(55,55,55,0.5)";
                this.ctx.fillStyle = color;
                this.ctx.fillRect((cx - this.playground.cx) * this.playground.scale, (cy - this.playground.cy) * this.playground.scale, grid_width * this.playground.scale, grid_height *this.playground.scale);
                this.ctx.strokeStyle = "rgba(55, 55, 55, 0.5)";
                this.ctx.lineWidth = 0.005 * this.playground.scale;
                // ctx渲染矩形
                this.ctx.strokeRect((cx - this.playground.cx) * this.playground.scale, (cy - this.playground.cy) * this.playground.scale, grid_width * this.playground.scale, grid_height * this.playground.scale);

            }
        }
    }
}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`); //创建一个canvas的jQuery对象，就是我们要实现的画布
        this.ctx = this.$canvas[0].getContext('2d'); //jQuery对象是一个数组，第一个索引是html对象
        //设置画布的宽高
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        console.log("canvas:" + this.ctx.canvas.width + "," + this.ctx.canvas.height);
        this.playground.$playground.append(this.$canvas);

    }

    start() {
        this.$canvas.focus();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
    update() {
        this.render();
    }

    render() {  // 渲染
        this.ctx.fillStyle = "rgba(0,0,0,0.2)"; // 0.2 实现小尾巴幻影效果
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }

    start() {

    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}class Particle extends AcGameObject {
    constructor(playground,x,y,radius,vx,vy,color,speed,move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps ||this.speed < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;

        this.render();

    }

    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale,this.y * scale,this.radius * scale,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends AcGameObject {
    constructor(playground,x,y,radius,color,speed,character,username,photo) {
        // console.log(character,username,photo,color);
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;

        // 速度
        this.vx = 0; // x
        this.vy = 0;
        this.move_length = 0;

        // 击退效果
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01 // 误差
        this.friction = 0.9;
        this.spent_time = 0;

        // 子弹
        this.fireballs = [];

        this.cur_skill = null;

        if(this.character !== "robot") {
            this.img = new Image();
            this.img.src = this.photo;
        }

        if(this.character === "me") {
            this.fireball_coldtime = 3; // 单位：秒
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            // 闪现
            this.blink_coldtime = 5;
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
        }
    }

    start() {
        this.playground.player_count =  this.playground.player_count + 1;
        this.playground.notice_board.write("已就绪：" + this.playground.player_count + "人");

        if(this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");

        }
        if(this.character === "me") {
            this.add_listening_events();
        } else if (this.character === "robot" ){
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        // 关闭鼠标右键菜单功能
        this.playground.game_map.$canvas.on("contextmenu",function () {
            return false;
        });

        // 鼠标输入事件
        this.playground.game_map.$canvas.mousedown(function (e) {
            if(outer.playground.state !== "fighting")
                return true;

            const rect = outer.ctx.canvas.getBoundingClientRect();
            // 左键:1 中键:2 右键:3
            if(e.which === 3) { // 鼠标右键
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                outer.move_to(tx,ty);

                if(outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            } else if (e.which === 1) {  // 鼠标左键

                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY-rect.top) / outer.playground.scale;
                if(outer.cur_skill === "fireball") {

                    if(outer.fireball_coldtime > outer.eps)
                        return false;

                    let fireball = outer.shoot_fireball(tx,ty);

                    if(outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(tx, ty,fireball.uuid);
                    }
                }
                else if (outer.cur_skill === "blink") {
                    if(outer.blink_coldtime > outer.eps)
                        return false;

                    outer.blink(tx,ty);
                    if(outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_blink(tx, ty);
                    }
                }
                // 技能清空
                outer.cur_skill = null;
            }
        });

        // 键盘输入事件
        this.playground.game_map.$canvas.keydown(function (e) {
            if(e.which === 13) { // 键盘 回车键 , 打开聊天框
                if(outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.show_input();
                    return false
                }
            } else if (e.which === 27) {
                if(outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.hide_input();
                }
            }

            // 不处于战斗状态
            if(outer.playground.state !== "fighting")
                return true;


            if(e.which === 81) {  // 键盘 Q 键
                // 技能冷却
                if(outer.fireball_coldtime > outer.eps)
                    return true;
                outer.cur_skill = "fireball";
                return false;
            }
            else if (e.which === 70){ // 键盘 F 键
                // 技能冷却
                if(outer.blink_coldtime > outer.eps)
                    return true;
                outer.cur_skill = "blink";
                return false;
            }
        });
    }

    shoot_fireball(tx,ty) {
        let x = this.x;
        let y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty-this.y,tx-this.x);
        let vx = Math.cos(angle),vy = Math.sin(angle);
        let color = "orange";
        let speed = 0.5;
        let move_length = 1;
        let damage = 0.01;
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length,damage);
        this.fireballs.push(fireball);
        // cd
        this.fireball_coldtime = 0.1;
        return fireball;
    }

    destroy_fireball(uuid)
    {
        for(let i = 0 ;i < this.fireballs.length; i++ )
        {
            let fireball = this.fireballs[i];
            if(fireball.uuid === uuid) {
                fireball.destroy();;
                break;
            }
        }
    }

    blink(tx,ty) {
        let d = this.get_dist(this.x,this.y,tx,ty);
        d = Math.min(d,0.8);
        let angle = Math.atan2(ty - this.y,tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.blink_coldtime = 5;
        this.move_length = 0; // 闪现完停下来
    }
    get_dist(x1,y1,x2,y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx*dx+dy*dy);
    }
    move_to(tx,ty) {
        // 计算移动距离
        this.move_length = this.get_dist(this.x,this.y,tx,ty);
        // 计算移动角度，api接口：atan2(dy, dx)
        let angle = Math.atan2(ty-this.y,tx - this.x);
        // 位移 1 个单位长度（向着矢量方向移动到单位圆上）
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle,damage,attacker) {
        // 粒子小球效果

        for (let i = 0; i < 20+Math.random() * 10; i++) {
            let x = this.x ,y =this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = 2 * Math.PI * Math.random();
            let vx = Math.cos(angle) , vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground,x,y,radius,vx,vy,color,speed,move_length);
        }

        this.radius -= damage; // 受伤，半径减小
        if(this.radius < this.eps ) { // 当半径小于 eps 像素时，代表死亡
            this.destroy();

            return false;
        }

        // 击退效果
        this.damage_vx = Math.cos(angle);
        this.damage_vy = Math.sin(angle);
        this.damage_speed = damage * 100;

        this.speed *= 0.8;
    }

    receive_attack(x,y,angle, damage, ball_uuid, attacker) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle,damage,attacker);

    }
    update_move() { // 更新玩家移动
        if (this.character === "robot" && this.spent_time > 4 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(tx, ty);
        }

        if(this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_vx * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_vy * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }else {
            if(this.move_length < this.eps) {
                this.move_length = 0 ;
                this.vx = this.vy = 0;
                if (this.character === "robot") {   //如果是人机，停下来时再随机一个方向前进
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height/ this.playground.scale;
                    this.move_to(tx, ty);
                }
            } else {
                // 计算单位帧里的移动距离
                let moved = Math.min(this.move_length,this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                // 还要减掉移动的距离
                this.move_length -= moved;
            }
        }
    }
    update_coldtime() {
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(this.fireball_coldtime,0);

        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(this.blink_coldtime , 0);
    }
    update_win() {
        // 竞赛状态，且只有一名玩家，且改名玩家就是我，则胜利
        if (this.playground.state === "fighting" && this.character === "me" && this.playground.players.length === 1) {
            this.playground.state = "over";
            this.playground.score_board.win();
        }
    }

    update() {
        this.spent_time += this.timedelta / 1000;
        if(this.character === "me" && this.playground.state === "fighting"){
            this.update_coldtime();
        }

        this.update_move();
        this.update_win();
        this.render();
    }
    render() {
        let scale = this.playground.scale;

        if(this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        }
        else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale,this.y * scale,this.radius * scale,0,Math.PI * 2 ,false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

        if(this.character === "me" && this.playground.state === "fighting")
            this.render_skill_coldtime();
    }

    render_skill_coldtime() {
        let x = 1.5, y=0.9, r=0.04;
        let scale = this.playground.scale;
        // 火球技能
        // 渲染图片
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        // 画圆，蒙版 --》冷却cd
        if(this.fireball_coldtime > 0 ){
            this.ctx.beginPath();
            // 当前冷却占 3 的多少，就画多少圆
            this.ctx.moveTo(x * scale,y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0,0,255,0.6)";
            this.ctx.fill();
        }

        // 闪现技能
        x = 1.62, y=0.9, r=0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        // 画圆，蒙版 --》冷却cd
        if(this.blink_coldtime > 0 ){
            this.ctx.beginPath();
            // 当前冷却占 3 的多少，就画多少圆
            this.ctx.moveTo(x * scale,y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.blink_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0,0,255,0.6)";
            this.ctx.fill();
        }
}
    on_destroy() {
        // 我死亡，且游戏处于竞赛状态，则失败
        if (this.character === "me" && this.playground.state === "fighting") {
            this.playground.state = "over"
            this.playground.score_board.lose();
        }

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                // console.log(this.username + "玩家死亡。");
                break;
            }
        }
        if(this.playground.players.length === 1){
            // console.log(this.playground.players[0].username + "玩家胜出！！！");
        }

    }

}

class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  // win-胜利；lose-失败

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png";
    }
    start() {
    }

    add_listening_events() {    //点击后，返回主页面
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on('click', function() {
            outer.playground.hide();
            outer.playground.root.menu.show();
        });
    }

    win() {
        this.state = "win";
        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);   //1秒后监听点击事件
    }

    lose() {
        this.state = "lose";
        let outer = this;
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);   //1秒后监听点击事件
    }

    late_update() {
        this.render();  //渲染在图层最上方
    }
    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
class FireBall extends AcGameObject {
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length,damage) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.player = player;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.01;
    }

    start() {

    }

    update() {
        if(this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        this.update_move();

        if(this.player.character !== "enemy") {
            this.update_attack();
        }


        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        // 碰撞检测
        let username_attack=0,username_is_attack=0;
        for (let i = 0; i < this.playground.players.length; i++) {
            if(this.playground.players[i] === this.player)
                username_attack = this.player.username;
        }

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)) {
                username_attack = this.player.username;
                username_is_attack = player.username;
                // console.log(username_attack + "玩家攻击了" + username_is_attack + "玩家,快来攻击他" );
                this.attack(player); //火球命中，目标玩家执行击退效果
                break;
            }
        }
    }
    get_dist(x1,y1,x2,y2){
        let dx = x1-x2;
        let dy = y1-y2;
        return Math.sqrt(dx*dx + dy*dy);
    }

    is_collision(player) { // 检测两个圆的中心距离是否小于两个圆的半径
        let distance = this.get_dist(this.x,this.y,player.x,player.y);
        if(distance < (this.radius + player.radius))
            return true;
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y , player.x - this.x);
        player.is_attacked(angle,this.damage,player);

        if(this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(player.uuid,player.x ,player.y ,angle, this.damage , this.uuid);
        }
        this.destroy();
    }
    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale,this.y * scale,this.radius * scale,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }

    on_destroy() {
        let fireballs = this.player.fireballs ;
        for (let i = 0; i < fireballs.length; i ++ ) {
            if(fireballs[i] === this) {
                fireballs.splice(i,1);
                break;
            }
        }
    }
}

class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app4504.acapp.acwing.com.cn/wss/multiplayer/?token=" + playground.root.access)
        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if(event === "create_player")
            {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            else if (event === "move_to")
            {
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
            else if (event === "shoot_fireball")
            {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            }
            else if (event === "attack")
            {
                outer.receive_attack(uuid, data.attackee_uuid, data.x,
                    data.y, data.angle, data.damage, data.ball_uuid);
            }
            else if (event === "blink")
            {
                outer.receive_blink(uuid,data.tx,data.ty);
            }
            else if (event === "message")
            {
                outer.receive_message(uuid,data.username,data.text);
            }

        };
    }
    send_create_player(username,photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }))
    }

    get_player(uuid) {
        let players = this.playground.players;

        for(let i = 0 ;i < players.length; i++) {
            let player = players[i];
            if(player.uuid === uuid)
                return player;
        }
        return null;
    }
    receive_create_player(uuid,username,photo) {
        let player = new Player(
            this.playground,
            this.playground.width/2/this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx,ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid,tx,ty) {
        let player = this.get_player(uuid);

        if(player) {
            player.move_to(tx,ty);
        }
    }

    send_shoot_fireball(tx,ty,ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid,tx,ty,ball_uuid) {
        let player = this.get_player(uuid);

        if(player) {
            let fireball = player.shoot_fireball(tx,ty);
            fireball.uuid = ball_uuid;
        }
    }

    // attackee_uuid 被攻击者的uuid，uuid 攻击者的uuid
    send_attack(attackee_uuid,x,y,angle,damage,ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle , damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let attakcee = this.get_player(attackee_uuid);
        if(attacker && attakcee) {
            attakcee.receive_attack(x,y,angle,damage,ball_uuid,attacker);
        }
    }

    send_blink(tx,ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid,tx,ty) {
        let player = this.get_player(uuid);
        if(player) {
            player.blink(tx,ty);
        }
    }

    send_message(username,text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(uuid,username,text) {
        this.playground.chat_field.add_message(username,text);
    }
}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="game-playground">
            
            </div>
        `);

        this.hide();

        /******** 虚拟地图 ************/
        this.cx = 0;
        this.cy = 0;
        /******** 虚拟地图 ***********/

        this.root.$ac_game.append(this.$playground);

        this.start();
    }
    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        return colors[Math.floor(Math.random() * 5)];
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i ++ ) {
            let x = parseInt(Math.floor(Math.random() * 10));   //[0, 10)
            res += x;
        }
        return res;
    }
    start() {
        let outer = this;
        let uuid = this.create_uuid();
        $(window).on(`resize.${uuid}`, function() {
            outer.resize();
        });

        if (this.root.AcWingOS) {
            outer.root.AcWingOS.api.window.on_close(function() {
                $(window).off(`resize.${uuid}`);
            });
        }
    }



    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();

        let unit = Math.min(this.width / 16,this.height/9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        /****************  虚拟地图  ***********************/
        // 新增虚拟地图--创建虚拟大地图, p相对于原地图缩放的比例，长宽都扩大为原来的三倍
        this.p = 3;
        this.virtual_width = this.width / this.scale * this.p;
        this.virtual_height = this.p;
        this.cx = this.virtual_width / 2 - this.width / 2 / this.scale;
        this.cy = this.virtual_height / 2 - this.height / 2 / this.scale;

        /****************  虚拟地图  *************************/

        if(this.game_map) this.game_map.resize();
    }

    get_color_name(color) {
        let name = color;
        for(let i = 0 ;i<2;i++) {
            name += Math.floor(Math.random() * 9)
        }
        return name;
    }
    show(mode) {
        let outer = this;
        this.$playground.show();

        // playground
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        // game_map
        this.game_map = new GameMap(this);
        // 创建网格系统
        this.grid = new Grid(this);

        // mode
        this.mode = mode;
        // 用户的状态机
        this.state = "waiting"; // waiting -> fighting ->over
        this.notice_board = new NoticeBoard(this);
        this.score_board = new ScoreBoard(this);
        // 用户人数
        this.player_count = 0;

        this.resize();
        // players
        this.players = [];
        this.players.push(new Player(this,this.width/2 / this.scale,0.5, 0.05,"white",
            0.15 ,"me",this.root.settings.username,this.root.settings.photo));

        if(mode === "single mode") {
            for(let i=0;i<5;i++){
                let color = this.get_random_color();
                this.players.push(new Player(this,this.width/2/ this.scale,0.5,
                        0.05,color,0.15 ,"robot",this.get_color_name(color)));
            }
        }
        else if (mode === "multi mode") {
            this.chat_field = new ChartField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            this.mps.ws.onopen = function () {
                outer.mps.send_create_player(outer.root.settings.username,outer.root.settings.photo);
            };
        }
    }

    hide() {
         //清空所有游戏元素
        while (this.players && this.players.length > 0) {
            this.players[0].destroy();
        }
        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }
        if (this.notice_board) {
            this.notice_board.destroy();
            this.notice_board = null;
        }
        if (this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }


        this.$playground.empty();   //清空所有html标签
        this.$playground.hide();

    }
}


class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
            <div class = "game-settings">
                <div class="game-settings-login">
                    <div class="game-settings-title">登录</div>
                     <div class="game-settings-username">
                        <div class="game-settings-item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class="game-settings-password">
                        <div class="game-settings-item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="game-settings-submit">
                        <div class="game-settings-item">
                            <button>登录</button>
                        </div>
                    </div>
                    <div class="game-settings-error-message">
                        
                    </div>
                    <div class="game-settings-option">
                        注册
                    </div>
                    <br>
                    <div class="game-settings-acwing">
                        <img width="30" src="https://app4504.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                   
                        <div>
                            一键登录
                        </div>                       
                    </div>
                </div>
                
                <div class="game-settings-register">
                
                    <div class="game-settings-title">注册</div>
                         <div class="game-settings-username">
                            <div class="game-settings-item">
                                <input type="text" placeholder="用户名">
                            </div>
                        </div>
                        <div class="game-settings-password game-settings-password-first">
                            <div class="game-settings-item">
                                <input type="password" placeholder="密码">
                            </div>
                        </div>
                        <div class="game-settings-password game-settings-password-second">
                            <div class="game-settings-item">
                                <input type="password" placeholder="确认密码">
                            </div>
                        </div>
                        <div class="game-settings-submit">
                            <div class="game-settings-item">
                                <button>注册</button>
                            </div>
                        </div>
                        <div class="game-settings-error-message">
                            
                        </div>
                        <div class="game-settings-option">
                            登录
                        </div>
                        <br>
                        <div class="game-settings-acwing">
                            <img width="30" src="https://app4504.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
                       
                            <div>
                                一键登录
                            </div>                       
                        </div>
                
                </div>
            </div>
        `);

        this.$login = this.$settings.find(".game-settings-login");
        this.$login_username = this.$login.find(".game-settings-username input");
        this.$login_password = this.$login.find(".game-settings-password input");
        this.$login_submmit = this.$login.find(".game-settings-submit button");
        this.$login_error_message = this.$login.find(".game-settings-error-message");
        this.$login_register = this.$login.find(".game-settings-option");
        this.$login.hide();

        this.$register = this.$settings.find(".game-settings-register");
        this.$register_username = this.$register.find(".game-settings-username input")
        this.$register_password = this.$register.find(".game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".game-settings-password-second input");
        this.$register_submit = this.$register.find(".game-settings-submit button");
        this.$register_error_message = this.$register.find(".game-settings-error-message");
        this.$register_login = this.$register.find(".game-settings-option");
        this.$register.hide();

        this.$acwing_login = this.$settings.find(".game-settings-acwing img")

        this.root.$ac_game.append(this.$settings);
        this.start();
    }

    start() {
        if(this.platform === "ACAPP") {
            this.getinfo_acapp();

        } else {
            if(this.root.access) {
                this.getinfo_web();
                this.refresh_jwt_token();
            } else {
                this.login();
            }
            this.add_listening_enents();
        }

    }

    refresh_jwt_token() {
        setInterval(() => {
            $.ajax({
                url: "https://app4504.acapp.acwing.com.cn/settings/token/refresh/",
                type: "post",
                data: {
                    refresh: this.root.refresh,
                },
                success: resp => {
                    this.root.access = resp.access;
                    console.log(resp);
                }
            });
        },4.5 * 60 * 1000);

        setTimeout(() => {
            $.ajax({
                url: "https://app4504.acapp.acwing.com.cn/settings/ranklist/",
                type: "get",
                headers: {
                    'Authorization': "Bearer " + this.root.access,
                },
                success: resp => {
                    console.log(resp);
                }
            });
        },5000);
    }
    add_listening_enents() {
        let outer = this;
        this.add_listening_enents_login();
        this.add_listening_enents_register();
        
        this.$acwing_login.click(function () {
            outer.acwing_login();
        })
    }

    add_listening_enents_login() {
        let outer = this;
        this.$login_register.click(function () {
            outer.register();
        });
        this.$login_submmit.click(function () {
           outer.login_on_remote();
        });
    }
    add_listening_enents_register() {
        let outer = this;
        this.$register_login.click(function () {
            outer.login();
        });
        this.$register_submit.click(function () {
            outer.register_on_remote();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app4504.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function (resp){
                if(resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        })
    }

    login_on_remote(username,password) { // 在远程服务器上登录
        username = username || this.$login_username.val();
        password = password || this.$login_password.val();
        this.$login_error_message.empty();

        $.ajax({
           url: "https://app4504.acapp.acwing.com.cn/settings/token/",
            type: "post",
            data: {
               username: username,
               password: password,
            },
            success: resp => {
               console.log(resp);
               this.root.access = resp.access;
               this.root.refresh = resp.refresh;
               this.refresh_jwt_token();
               this.getinfo_web();
            },
            error: () => {
                this.$login_error_message.html("用户名或密码错误");
            }
        });
    }

    register_on_remote() { // 在远程服务器上注册
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app4504.acapp.acwing.com.cn/settings/register/",
            type: "post",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: resp => {
                if(resp.result === "success") {
                    this.login_on_remote(username,password);
                } else {
                    this.$register_error_message.html(resp.result);
                }
            }
        })
    }

    logout_on_remote() { // 在远程服务器上退出
        if(this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
           this.root.access = "";
           this.root.refresh = "";
           location.href = "/";
        }


    }

    login() { // 打开登录页面
        this.$register.hide();
        this.$login.show();
    }

    register() { // 打开注册页面
        this.$login.hide();
        this.$register.show();
    }
    acapp_login(appid,redirect_uri,scope,state) {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function (resp) {

            console.log("called from acapp_login function");
            if(resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.sex = resp.sex;
                outer.hide();
                outer.root.menu.show();
                console.log(resp);
                outer.root.access = resp.access;
                outer.root.refresh = resp.refresh;
                outer.refresh_jwt_token();
            }
        });
    }
    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app4504.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function (resp) {
                if(resp.result === "success") {
                    outer.acapp_login(resp.appid,resp.redirect_uri,resp.scope,resp.state);
                }
            }
        });
    }
    getinfo_web() {
        let outer = this;
        $.ajax({
            url : "https://app4504.acapp.acwing.com.cn/settings/getinfo/",
            type: "get",
            data: {
                platform: outer.platform,
            },
            headers: {
              'Authorization': "Bearer " + this.root.access,
            },
            success: function (resp) {  // response 简写
                if(resp.result === "success") {
                    console.log(resp);
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.sex = resp.sex;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        })
    }

    hide() {
        this.$settings.hide();
    }
    show() {
        this.$settings.show();
    }
}export class AcGame{
    constructor(id,AcWingOS, access, refresh) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.access = access;
        this.refresh = refresh;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.rank = new AcGameRank(this);
        this.start();
    }

    start() {

    }
}

