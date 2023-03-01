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
