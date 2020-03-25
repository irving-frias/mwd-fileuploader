params = new URLSearchParams(window.location.search);
if (params.has('tag')) {
    $('#tag').val(params.get('tag'));
} else {
    $('#tag').val('');
}

$('.clear-filters').on('click', function (e) {
    $('#tag').val('');
    $('#filter-by-tag').submit();
});

if ($('#tag').val() !== null) {
    $('.clear-filters').css('display', 'inline');
}