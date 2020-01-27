import './index.less';

const { ensure } = util;


export const renderMenu = function($menu, pages) {
    ensure.jqElement($menu);
    ensure.nonEmptyArray(pages);

    $menu.html(pages.map(x => $('<a>', { class: 'menu__item', text: x.name, href: x.path })));

    $menu.append([
        $('<div>', { css: { flexGrow: 1 } }),
        $('<button>', { class: 'k-button k-primary', attr: { type: 'button', 'js-log-in-btn': '' }, text: 'Log in' }),
        $('<button>', { class: 'k-button k-primary', attr: { type: 'button', 'js-log-out-btn': '' }, text: 'Log out' }).hide(),
    ]);
};
