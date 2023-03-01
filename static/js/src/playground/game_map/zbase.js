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
}