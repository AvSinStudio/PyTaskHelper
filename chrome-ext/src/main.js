$(document).ready(function () {

    if (document.title.indexOf('python.task') == -1 &&
        document.title.indexOf('Perltask') == -1) {
        return;
    }
    var year = document.title.split('|')[1].trim();

    var xhr_task = new XMLHttpRequest();
    var xhr_cat = new XMLHttpRequest();
    xhr_task.onload = function () {
        var json = xhr_task.responseText;
        fill_task_info(JSON.parse(json));
        setCSS();
    };
    xhr_cat.onload = function () {
        var json = xhr_cat.responseText;
        fill_cat_info(JSON.parse(json));

        setCSS();
    };


    xhr_task.open('GET', 'http://pytask.info/db/db.json');
    xhr_task.send();
    xhr_cat.open('GET', 'http://pytask.info/db/categories/' + year + '.json');
    xhr_cat.send();

});

function fill_task_info(data) {
    $('strong, font').each(function () {

        var name = $(this).text().trim();
        if (!(name in data)) {
            return;
        }

        var max = $(this).next('span');
        var avg_percent = data[name]['average_percent'];
        var avg_points = avg_percent * max.text() / 100;
        var students = data[name]['students_amount'];
        var stud_full = data[name]['students_full_points'];
        var perc_full = data[name]['full_points_percent'];
        var link = 'http://pytask.info/tasks/' + data[name]['filename'];
        var text =
            '<div class="task_info">' +
            '<h4>' + name + '</h4>' +
            '<p>Максимальный балл: <span>' + max.text() + '</span></p>' +
            '<p>Средний балл за все года: <span>' + avg_points + ' (' + avg_percent + '%)' + '</span>' +
            '<p>Количество сдавших: <span>' + students + '</span></p>' +
            '<p>Количество сдавших на полный балл: <span>' + stud_full +
            ' (' + perc_full + '%)' + '</span></p>' +
            '<hr>' +
            '<a href="' + link + '">Подробная статистика...</a>' +
            '</div>';

        $(this).before(text);
        $(this).remove();
        max.remove();
    });
}
function fill_cat_info(data) {
    $('strong').each(function () {
        var name = $(this).text().trim();
        if (!(name in data['this_year']))
            return;
        var text_all_years = create_cat_text(data, name, true);
        var text_this_year = create_cat_text(data, name, false);
        var text =
            '<div class="task_info">' +
            '<h4>' + name + '</h4>' +
            '[<a class="disabled" id="this_year">этот год</a> | <a href="#" id="all_years">все года</a>]' +
            text_this_year + text_all_years +
            '</div>';
        $(this).before(text);
        var parent = $(this).parent();
        $(this).remove();
        $(parent).find('#this_year').click(function (e) {
            e.preventDefault();
            parent.find('.cat_info_all_years').hide();
            var other_link = parent.find('a.disabled');
            enable_link(other_link);
            disable_link($(this));
            parent.find('.cat_info_this_year').show();
        });
        $(parent).find('#all_years').click(function (e) {
            e.preventDefault();
            parent.find('.cat_info_this_year').hide();
            var other_link = parent.find('a.disabled');
            enable_link(other_link);
            disable_link($(this));
            parent.find('.cat_info_all_years').show();
        });
        $(parent).find('.cat_info_this_year').show();
        $(parent).find('.cat_info_all_years').hide();
        disable_link($(parent).find('a.disabled'));
    });
}
function disable_link(elem)
{
    elem.css({'color': 'black', 'cursor':'text', 'text-decoration': 'none'});
    elem.addClass('disabled');
    return null
}

function enable_link(elem)
{
    elem.css({'color': '', 'cursor':'pointer', 'text-decoration': 'underline'});
    elem.removeClass('disabled');
}



function create_cat_text(data, name, all_years) {
    var scope = all_years ? 'all_years' : 'this_year';
    var max_students = data[scope][name]['max_students'];
    var min_students = data[scope][name]['min_students'];
    var max_percent = data[scope][name]['max_percent'];
    var min_percent = data[scope][name]['min_percent'];
    var max_points = data[scope][name]['max_points'];
    var min_points = data[scope][name]['min_points'];
    var max_full_points = data[scope][name]['max_full_points'];
    var min_full_points = data[scope][name]['min_full_points'];
    var text =
        '<div class="cat_info_' + scope + '">' +
        '<p>Задача, которую взяло наибольшее количество людей: <b>' + max_students[1] + '</b> <span>(' + max_students[0] + ')' + '</span></p>' +
        '<p>Задача, которую взяло наименьшее количество людей: <b>' + min_students[1] + '</b> <span>(' + min_students[0] + ')' + '</span></p>' +
        '<p>Задача с наивысшим средним баллом: <b>' + max_points[1] + '</b> <span>(' + max_points[0] + ' (' + max_percent[0] + '%))' + '</span></p>' +
        '<p>Задача с самым низким средним баллом: <b>' + min_points[1] + '</b> <span>(' + min_points[0] + ' (' + max_percent[0] + '%))' + '</span></p>' +
        '<p>Задача, которую наибольшее количество людей решили на полный балл: <b>' +
        max_full_points['name'] + '</b> <span>(' + max_full_points['students_full_points'] + '/' + max_full_points['students_amount'] +
        ' (' + max_full_points['percent'] + '%))' + '</span></p>' +
        '<p>Задача, которую наименьшее количество людей решили на полный балл: <b>' +
        min_full_points['name'] + '</b> <span>(' + min_full_points['students_full_points'] + '/' + min_full_points['students_amount'] +
        ' (' + min_full_points['percent'] + '%))' + '</span></p>' +
        '</div>';
    return text;
}

function setCSS() {
    $('.task_info').css({
        'background-color': '#eee',
        'padding': '5px 10px',
        'margin-bottom': '5px',
        'border-radius': '5px'
    });

    $('.task_info hr').css({
        'margin': '2px 0px'
    });

    $('.task_info p').css({
        'margin': '3px 0px'
    });

    $('.task_info p span').css({
        'color': 'green',
        'font-weight': 'bold'
    });

    $('.task_info h4').css({
        'margin-bottom': '8px'
    });

    $('.task_info a').css({
        'font-size': '12px'
    });
}
