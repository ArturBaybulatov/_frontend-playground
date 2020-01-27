require('./index.less');


//var solution = `
//#c#f#
//#r#l#
//vasya
//#c#e#
//#k#r#`;
//
//var hor = `
//3 Generic Russian name
//`;
//
//var ver = `
//1 To break something
//2 Advertisement on a paper
//`;

var $crossword = $('[js-crossword]').first();
var $questions = $('[js-questions]').first();
var $crosswordCheckBtn = $('[js-crossword-check-btn]').first()

var html = $.crosswordCreate({
    crossword_val: solution,
    hor_val: hor,
    ver_val: ver,
});

$crossword.html(html.schema);

$questions
    .append("<h3>Across</h3>")
    .append(html.def[0])
    .append("<h3>Down</h3>")
    .append(html.def[1]);

$crossword.find('#crossword').crossword();

$crosswordCheckBtn.on('click', function() {
    $.crosswordCheck({solution: solution});
});
