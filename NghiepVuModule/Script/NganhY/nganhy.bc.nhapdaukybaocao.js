$(".upload-this").on('click', (e) => {
    e.preventDefault();
    var element = $(e.target);
    var parent = element.closest(".div-upload-parent");
    var upload = parent.find("input[type='file']:not(:disabled)");
    $(upload).trigger('click');
});