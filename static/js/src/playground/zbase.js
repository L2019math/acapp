class AcGamePlayground {
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


