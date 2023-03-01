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
}