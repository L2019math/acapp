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
