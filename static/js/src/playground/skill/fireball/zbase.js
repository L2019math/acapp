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

