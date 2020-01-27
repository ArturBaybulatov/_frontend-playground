'use strict';


var ckeditorCustomConfig = {
    toolbarGroups: [
        { name: 'styles', groups: ['styles'] },
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'others', groups: ['others'] },
        { name: 'paragraph', groups: ['list', 'blocks', 'indent', 'align', 'bidi', 'paragraph'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'links', groups: ['links'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'about', groups: ['about'] },
    ],

    removeButtons: 'Subscript,Superscript,Cut,Copy,Paste,PasteFromWord,Scayt,Anchor,SpecialChar,Redo,Undo',
    format_tags: 'p;h1;h2;h3;pre',
    //removeDialogTabs: 'image:advanced;link:advanced',
};

$.extend(CKEDITOR.config, ckeditorCustomConfig);

var ckeditorCustomStyleSet = [
    { name: 'Marker', element: 'span', attributes: { class: 'marker' } },
    { name: 'Monospaced', element: 'code' },

    { name: '#e67e22', element: 'span', styles: { color: '#e67e22' } },
    { name: '#2ecc71', element: 'span', styles: { color: '#2ecc71' } },
    { name: '#bb8fce', element: 'span', styles: { color: '#bb8fce' } },
    { name: '#3498db', element: 'span', styles: { color: '#3498db' } },
    { name: '#2980b9', element: 'span', styles: { color: '#2980b9' } },
    { name: '#e74c3c', element: 'span', styles: { color: '#e74c3c' } },

    { name: 'Bg #2ecc71', element: 'span', styles: { color: 'white', 'background-color': '#2ecc71' } },
    { name: 'Bg #bb8fce', element: 'span', styles: { color: 'white', 'background-color': '#bb8fce' } },
    { name: 'Bg #3498db', element: 'span', styles: { color: 'white', 'background-color': '#3498db' } },
    { name: 'Bg #2980b9', element: 'span', styles: { color: 'white', 'background-color': '#2980b9' } },
    { name: 'Bg #e74c3c', element: 'span', styles: { color: 'white', 'background-color': '#e74c3c' } },
    { name: 'Bg #f5b041', element: 'span', styles: { color: 'white', 'background-color': '#f5b041' } },
];

CKEDITOR.replace('ckeditor', {
    customConfig: false,
    language: 'ru',
    stylesSet: ckeditorCustomStyleSet,
});
