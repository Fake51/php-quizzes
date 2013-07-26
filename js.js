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
    },
    precedence_ab = {
        test_a: null,
        test_b: null,
        scoreboard: null,
        showing_answer: false,
        base_height: 0,
        current_winner: 0,
        times_run: 0,
        times_correct: 0,
        operators: {
            0: "clone, new",
            1: "[",
            2: "++, --, ~, (bool), (int), (string), (float), (object), (array), (unset), @",
            3: "instanceof",
            4: "!",
            5: "*, /, %",
            6: "+, -, .",
            7: "&lt;&lt;, &gt;&gt;",
            8: "&lt;, &lt;=, &gt;=, &gt;",
            9: "==, ===, !=, !==, &lt;&gt;",
            10: "&amp;",
            11: "^",
            12: "|",
            13: "&amp;&amp;",
            14: "||",
            15: "? :",
            16: "=, +=, -=, *=, /=, %= &lt;&lt;=, &gt;&gt;=, .=, &amp;=, |=, ^=, =&gt;",
            17: "and",
            18: "xor",
            19: "or",
            20: ","
        },

        setupTest: function() {
            var a = Math.floor(Math.random() * 20),
                b,
                temp;

            do {
                b = Math.floor(Math.random() * 20);
            } while (a == b);

            temp = this.operators[a].split(/, /);
            temp = temp.length > 1 ? temp[Math.floor(Math.random() * temp.length)] : temp[0];

            this.test_a.html(temp)
                .attr('data-index', a);

            temp = this.operators[b].split(/, /);
            temp = temp.length > 1 ? temp[Math.floor(Math.random() * temp.length)] : temp[0];

            this.test_b.html(temp)
                .attr('data-index', b);

            this.current_winner = a < b ? a : b;
        },

        reset: function() {
            this.showing_answer = false;
            this.test_a.css('background-color', '#fff');
            this.test_b.css('background-color', '#fff');

            this.setupTest();
        },

        checkChoice: function(e) {
            var that    = this,
                element = $(e.target);

            if (this.showing_answer) {
                return;
            }

            this.showing_answer = true;

            window.setTimeout(function() {
                that.reset();
            }, 1500);

            if (parseInt(element.attr('data-index'), 10) == this.current_winner) {
                element.css('background-color', '#afa');
                this.times_correct++;
            } else {
                element.css('background-color', '#faa');

                if (element.prop('id') == 'test_a') {
                    this.test_b.css('background-color', '#afa');
                } else {
                    this.test_a.css('background-color', '#afa');
                }
            }

            this.times_run++;
            this.updateScoreboard();
        },

        updateScoreboard: function() {
            this.scoreboard.text("Correct / tests: " + this.times_correct + ' / ' + this.times_run);
        },

        init: function(test_a_id, test_b_id, scoreboard_id) {
            var that = this;

            this.test_a     = $('#' + test_a_id);
            this.test_b     = $('#' + test_b_id);
            this.scoreboard = $('#' + scoreboard_id);

            this.test_a.parent().on('click', '#' + test_a_id + ', #' + test_b_id, function(e) {
                that.checkChoice(e);
            });

            this.base_height = this.test_a.height();
            this.setupTest();
            this.updateScoreboard();
        }
    };

$(function() {
    precedence.init('precedence-list', 'precedence', 'precedence-scores');
    precedence_ab.init('test_a', 'test_b', 'ab-scores');
});
