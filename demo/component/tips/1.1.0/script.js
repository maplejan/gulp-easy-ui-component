(function (window, document) {
    var template = '{{template}}',
        style = '{{style}}';

    function init() {
        return {
            name: 'tips',
            version: '1.1.0'
        };
    }

    window.tips = init();
})(window, document);