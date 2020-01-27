import './index.html';
import './index.less';


const log = function(val) { console.log(val); return val }; // Debug


const init = function() {
    const canvas = document.querySelector('[js-canvas]');
    const ctx = canvas.getContext('2d');


    const img = new Image();

    img.src = '../../assets/canvas-test/forest.jpg';

    img.addEventListener('load', () => ctx.drawImage(img, 0, 0, 200, 200));


    const exportBtn = document.querySelector('[js-export-btn]');

    exportBtn.addEventListener('click', function() {
        canvas.toBlob(function(image) {
            const img = new Image();
            img.src = URL.createObjectURL(image);
    
            const div = document.createElement('div');
            div.appendChild(img);
    
            document.body.appendChild(div);
        }, 'image/jpeg', 1);
    });
};


init();
