// 网格系统
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
