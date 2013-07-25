var precedence = {
    running: false,
    times_run: 0,
    times_correct: 0,
    button: null,
    list: null,
    scoreboard: null,

    interaction: function(e) {
        if (this.running) {
            this.stopTest();
        } else {
            this.startTest();
        }
    },

    stopTest: function() {
        var failed = false;

        this.running = false;
        this.button.text('Start');

        this.list.children().each(function(idx, item) {
            var self = $(this);
            if (idx == parseInt(self.data('index'), 10) - 1) {
                self.css('background-color', '#afa');
            } else {
                self.css('background-color', '#faa');
                failed = true;
            }
        });

        if (!failed) {
            this.times_correct++;
        }

        this.updateScoreboard();
    },

    startTest: function() {
        var items;

        this.running = true;

        this.times_run++;
        this.button.text('Check');

        items = this.list.children().css('background-color', 'transparent').detach();
        items.sort(function(a, b) {
            return Math.random() > 0.5 ? 1 : 0;
        });

        this.list.append(items);
    },

    updateScoreboard: function() {
        this.scoreboard.text("Correct / tests: " + this.times_correct + ' / ' + this.times_run);
    },

    init: function(list_id, button_id, scoreboard_id) {
        var that = this;

        this.button     = $('#' + button_id);
        this.list       = $('#' + list_id);
        this.scoreboard = $('#' + scoreboard_id);

        this.list.sortable();
        this.button.click(function(e) {
            that.interaction(e);
        });

        this.updateScoreboard();
    }
};

$(function() {
    precedence.init('precedence-list', 'precedence', 'precedence-scores');
});
