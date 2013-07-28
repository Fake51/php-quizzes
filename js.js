var operator_test_module = {
    operators: {
        0: "clone, new",
        1: "[",
        2: "++, --, ~, (bool), (int), (string), (float), (object), (array), (unset), @",
        3: "instanceof",
        4: "!",
        5: "*, /, %",
        6: "+, -, .",
        7: "<<, >>",
        8: "<, <=, >=, >",
        9: "==, ===, !=, !==, <>",
        10: "&",
        11: "^",
        12: "|",
        13: "&&",
        14: "||",
        15: "? :",
        16: "=, +=, -=, *=, /=, %= <<=, >>=, .=, &=, |=, ^=, =>",
        17: "and",
        18: "xor",
        19: "or",
        20: ","
    },
    associativity: {
        non: ["clone", "new", "instanceof", "<", "<=", ">=", ">", "==", "===", "!=", "!==", "<>"],
        left: ["[", "*", "/", "%", "+", "-", ".", "<<", ">>", "&", "^", "|", "&&", "||", "? :", "and", "xor", "or", ","],
        right: ["++", "--", "~", "(bool)", "(int)", "(string)", "(float)", "(object)", "(array)", "(unset)", "@", "!", "=", "+=", "-=", "*=", "/=", "%= <<=", ">>=", ".=", "&=", "|=", "^=", "=>"]
    },

    type: {
        unary: ["clone", "new", "!", "++", "--", "~", "(bool)", "(int)", "(string)", "(float)", "(object)", "(array)", "(unset)", "@"],
        binary: ["instanceof", "<", "<=", ">=", ">", "==", "===", "!=", "!==", "<>", "*", "/", "%", "+", "-", ".", "<<", ">>", "&", "^", "|", "&&", "||", "and", "xor", "or", ","],
        ternary: ['? :'],
        ranged_comparison: ["<", "<=", ">=", ">"],
        non_ranged_comparison: ["==", "===", "!=", "!==", "<>"],
        bool: ["<", "<=", ">=", ">", "==", "===", "!=", "!==", "<>", "&&", "||", "and", "xor", "or"]
    },

    expression_generator_operators: ["<", "<=", ">=", ">", "==", "===", "!=", "!==", "<>", "*", "/", "%", "+", "-", "<<", ">>", "&", "^", "|", "&&", "||", "? :", "and", "xor", "or", "~", "(bool)", "(int)", "(string)", "(float)", "(unset)", "!"],

    isUnary: function(operator) {
        return this.type.unary.indexOf(operator) !== -1;
    },

    isBool: function(operator) {
        return this.type.bool.indexOf(operator) !== -1;
    },

    isRangedComparison: function(operator) {
        return this.type.ranged_comparison.indexOf(operator) !== -1;
    },

    isNonRangedComparison: function(operator) {
        return this.type.non_ranged_comparison.indexOf(operator) !== -1;
    },

    updateScoreboard: function() {
        this.scoreboard.text("Correct / tests: " + this.times_correct + ' / ' + this.times_run);
    },

    precedence: {
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

        fillList: function() {
            var operators = operator_test_module.operators,
                last;

            for (var index in operators) {
                if (operators.hasOwnProperty(index)) {
                    this.list.append('<li data-index="' + (parseInt(index, 10) + 1) + '">' + operators[index] + '</li>');
                }
            }

            this.list.children().last().addClass('last');
        },

        init: function(list_id, button_id, scoreboard_id) {
            var that = this;

            this.updateScoreboard = operator_test_module.updateScoreboard;

            this.button     = $('#' + button_id);
            this.list       = $('#' + list_id);
            this.scoreboard = $('#' + scoreboard_id);

            this.fillList();

            this.list.sortable();
            this.button.click(function(e) {
                that.interaction(e);
            });

            this.updateScoreboard();
        }
    },
    precedence_ab: {
        test_a: null,
        test_b: null,
        scoreboard: null,
        showing_answer: false,
        base_height: 0,
        current_winner: 0,
        times_run: 0,
        times_correct: 0,

        setupTest: function() {
            var a = Math.floor(Math.random() * 20),
                b,
                temp;

            do {
                b = Math.floor(Math.random() * 20);
            } while (a == b);

            temp = operator_test_module.operators[a].split(/, /);
            temp = temp.length > 1 ? temp[Math.floor(Math.random() * temp.length)] : temp[0];

            this.test_a.text(temp)
                .attr('data-index', a);

            temp = operator_test_module.operators[b].split(/, /);
            temp = temp.length > 1 ? temp[Math.floor(Math.random() * temp.length)] : temp[0];

            this.test_b.text(temp)
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

        init: function(test_a_id, test_b_id, scoreboard_id) {
            var that = this;

            this.updateScoreboard = operator_test_module.updateScoreboard;

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
    },

    expression_calculation: {
        times_run: 0,
        times_correct: 0,
        expression: null,
        input: null,
        scoreboard: null,
        operator_limit_field: null,
        use_bool_field: null,
        operator_limit: 4,
        use_bool: true,
        current_expression: '',

        clearCalculation: function() {
            this.input.removeAttr('disabled')
                .css('background-color', '#fff')
                .val('');
        },

        setCalculation: function() {
            var limit = this.operator_limit,
                operator,
                last_operator,
                expression = Math.floor(Math.random() * 10),
                last_seen_unary,
                use_ternary = false,
                can_use_non_ranged_comparison = true,
                can_use_ranged_comparison = true,
                operators = operator_test_module.expression_generator_operators;

            while (limit) {
                operator = operators[Math.floor(Math.random() * operators.length)];

                if (!this.use_bool && operator_test_module.isBool(operator)) {
                    continue;
                }

                if (last_operator && operator_test_module.isNonAssociative(last_operator) && operator_test_module.isNonAssociative(operator)) {
                    continue;
                }

                if (operator_test_module.isUnary(operator)) {
                    last_seen_unary = operator;
                    continue;
                }

                if (operator === '? :') {
                    use_ternary = true;
                    continue;
                }

                if (operator_test_module.isNonRangedComparison(operator)) {
                    if (!can_use_non_ranged_comparison) {
                        continue;
                    } else {
                        can_use_non_ranged_comparison = false;
                    }
                } else if (operator_test_module.isRangedComparison(operator)) {
                    if (!can_use_ranged_comparison) {
                        continue;
                    } else {
                        can_use_ranged_comparison = false;
                    }
                }

                expression += ' ' + operator + ' ';

                if (last_seen_unary) {
                    expression += last_seen_unary + ' ';
                    last_seen_unary = null;
                }

                expression += Math.floor(Math.random() * 10);

                limit--;
            }

            this.current_expression = expression;
            this.expression.text(this.current_expression);
        },

        checkCalculation: function() {
            var that = this;

            this.input.attr('disabled', true);
            this.times_run++;

            $.ajax({
                url: 'test_expression.php',
                data: {expression: this.current_expression, answer: this.input.val()},
                success: function(data) {
                    if (data.result) {
                        that.input.css('background-color', '#afa');
                        that.times_correct++;
                    } else {
                        that.input.css('background-color', '#faa');
                        that.input.val(data.answer);
                    }
                },
                complete: function() {
                    window.setTimeout(function() {
                        that.clearCalculation();
                        that.setCalculation();
                        that.updateScoreboard();
                    }, 2000);

                }
            });
        },

        init: function(expression_field_id, input_field_id, scoreboard_id, settings_parent_id) {
            var that = this,
                settings_parent = $('#' + settings_parent_id);

            this.expression           = $('#' + expression_field_id);
            this.input                = $('#' + input_field_id);
            this.scoreboard           = $('#' + scoreboard_id);
            this.operator_limit_field = settings_parent.find('input').eq(0);
            this.use_bool_field       = settings_parent.find('input').eq(1);

            this.operator_limit_field.val(this.operator_limit)
                .change(function(e) {
                    that.operator_limit = $(this).val();
                });

            this.use_bool_field.attr('checked', true)
                .change(function(e) {
                    that.use_bool = $(this).is(':checked');
                    that.setCalculation();
                });

            this.input.keyup(function(e) {
                if (e.keyCode == 0x0d) {
                    that.checkCalculation();
                    that.setCalculation();
                }
            });

            this.setCalculation();

            this.updateScoreboard = operator_test_module.updateScoreboard;
            this.updateScoreboard();
        }

    }
};

$(function() {
    operator_test_module.precedence.init('precedence-list', 'precedence', 'precedence-scores');
    operator_test_module.precedence_ab.init('test_a', 'test_b', 'ab-scores');
    operator_test_module.expression_calculation.init('expression', 'calculation', "calculation-scores", 'expression-parts');
});
