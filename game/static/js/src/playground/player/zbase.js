class Player extends AcGameObject {
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

