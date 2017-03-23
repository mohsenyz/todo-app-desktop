(function () {
    window.Helper = {};
    window.Helper.initViews = function(){
        $("remote-view").each(function (index, element) {
            $.get($(this).attr('src'), function (data){
                $(element).replaceWith(data);
            });
        });
    };
    return window.Helper;
}());