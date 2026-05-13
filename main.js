var dx = 32;
var dy = 32;
var image = Array();
var data = '';

document.body.style.cursor = 'crosshair';

window.oncontextmenu = function(e){ e.preventDefault(); return false; };
document.oncontextmenu = function(e){ e.preventDefault(); return false; };
document.addEventListener('contextmenu', function(e){ e.preventDefault(); return false; }, false);

//window.screen.orientation.lock('landscape');

var GRID_X = 50;
var GRID_Y = 50;
var GRID_SIZE = 320;

var PALETTE_X = 450;
var PALETTE_Y = 50;
var PALETTE_CELL = 18;
var PALETTE_GAP = 2;
var PALETTE_COLS = 10;
var PALETTE_ROWS = 16;
var PALETTE_W = PALETTE_COLS * (PALETTE_CELL + PALETTE_GAP) - PALETTE_GAP;
var PALETTE_H = PALETTE_ROWS * (PALETTE_CELL + PALETTE_GAP) - PALETTE_GAP;

var COLOR_BOX_X = 386;
var COLOR_BOX_Y = 50;
var COLOR_BOX_SIZE = 52;
var COLOR_BOX_GAP = 82;

var color = rgb(255,0,0);
var color2 = rgb(0,0,0);

var paletteColors = [];

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function stampa() {
    var s = createsurface(320,320);
    blt(s,0,0,320,320,display,GRID_X,GRID_Y,GRID_SIZE,GRID_SIZE);

    var dataURL = s.toDataURL();

    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + dataURL + '">';
    windowContent += '</body>';
    windowContent += '</html>';

    var printWin = window.open();
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();

    printWin.onload = function(){
        printWin.print();
        printWin.close();
    };
}

function saveImage() {
    var s = createsurface(320,320);
    blt(s,0,0,320,320,display,GRID_X,GRID_Y,GRID_SIZE,GRID_SIZE);
    savePng(s);
}

function savePng(canvas) {
    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var imgData = imageData.data;

    var brightnessThreshold = 100;

    for (var i = 0; i < imgData.length; i += 4) {
        var brightness =
            (0.2126 * imgData[i]) +
            (0.7152 * imgData[i + 1]) +
            (0.0722 * imgData[i + 2]);

        if (brightness < brightnessThreshold) {
            imgData[i + 3] = 0;
        }
    }

    context.putImageData(imageData, 0, 0);

    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function saveCanvasAsImage(canvas) {
    canvas.toBlob(function(blob) {
        var fileContentURL = URL.createObjectURL(blob);
        var downloadLink = document.createElement("a");

        downloadLink.download = "nome-del-file.png";
        downloadLink.innerHTML = "Scarica il file";
        downloadLink.href = fileContentURL;
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";

        document.body.appendChild(downloadLink);
        downloadLink.click();

        function destroyClickedElement(event) {
            document.body.removeChild(event.target);
        }
    }, "image/png");
}

function _np_create() {
    const newFileReader = document.createElement('input');

    newFileReader.type = 'file';
    newFileReader.id = 'file-np-input';
    newFileReader.style.display = 'none';

    document.body.appendChild(newFileReader);

    document.getElementById('file-np-input').addEventListener(
        "change",
        readNPSingleFile,
        false
    );
}

_np_create();

function _np_load() {
    data = '';
    document.getElementById('file-np-input').value = "";
    document.getElementById('file-np-input').click();
}

function readNPSingleFile(e) {
    var file = e.target.files[0];

    if (!file) {
        return;
    }

    var reader = new FileReader();

    reader.onload = function(e) {
        var contents = e.target.result;
        displayNPContents(contents);
    };

    reader.readAsText(file);
}

function displayNPContents(contents) {
    data = contents;

    var loaded = data.split(';');

    dx = parseInt(loaded[0]);
    dy = parseInt(loaded[1]);

    image = loaded.slice(2);

    redrawAllPixels();
}

function NPdownload(textToSave, filename, type) {
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");

    downloadLink.download = filename;
    downloadLink.innerHTML = "Scarica il file";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";

    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function risoluzione(x, y) {
    dx = x;
    dy = y;
    cancella();
}

function cellRect(x, y) {
    var x0 = Math.round(GRID_X + (x * GRID_SIZE) / dx);
    var y0 = Math.round(GRID_Y + (y * GRID_SIZE) / dy);

    var x1 = Math.round(GRID_X + ((x + 1) * GRID_SIZE) / dx);
    var y1 = Math.round(GRID_Y + ((y + 1) * GRID_SIZE) / dy);

    return {
        x: x0,
        y: y0,

        fullw: Math.max(1, x1 - x0),
        fullh: Math.max(1, y1 - y0),

        w: Math.max(1, x1 - x0 - 1),
        h: Math.max(1, y1 - y0 - 1)
    };
}

function drawPixelCell(x, y, col) {
    var r = cellRect(x, y);
    bar(display, r.x, r.y, r.w, r.h, col);
}

function getMouseCell() {
    for (var y = 0; y < dy; y++) {
        for (var x = 0; x < dx; x++) {
            var r = cellRect(x, y);

            if (
                mouseX >= r.x &&
                mouseX < r.x + r.fullw &&
                mouseY >= r.y &&
                mouseY < r.y + r.fullh
            ) {
                return { x: x, y: y };
            }
        }
    }

    return null;
}

function redrawAllPixels() {
    bar(display, GRID_X, GRID_Y, GRID_SIZE, GRID_SIZE, 'black');

    for (var yy = 0; yy < dy; yy++) {
        for (var xx = 0; xx < dx; xx++) {
            var c = image[yy * dx + xx];

            if (!c || c === 'undefined') {
                c = 'white';
            }

            image[yy * dx + xx] = c;
            drawPixelCell(xx, yy, c);
        }
    }
}

function cancella() {
    bar(display, GRID_X, GRID_Y, GRID_SIZE, GRID_SIZE, 'black');

    image = [];

    for (var yy = 0; yy < dy; yy++) {
        for (var xx = 0; xx < dx; xx++) {
            drawPixelCell(xx, yy, rgb(255,255,255));
            image[yy * dx + xx] = 'white';
        }
    }
}

function salva() {
    data = '';

    data = dx + ';';
    data = data + dy + ';';

    for (var yy = 0; yy < dy; yy++) {
        for (var xx = 0; xx < dx; xx++) {
            data = data + image[yy * dx + xx] + ';';
        }
    }

    NPdownload(data, "file.pixelart", 'text');
}

function carica() {
    data = '';
    _np_load();
}

function mix(a, b, t) {
    return Math.round(a + (b - a) * t);
}

function rgbArrayToHex(c) {
    return rgb(c[0], c[1], c[2]);
}

function mixColor(c1, c2, t) {
    return rgb(
        mix(c1[0], c2[0], t),
        mix(c1[1], c2[1], t),
        mix(c1[2], c2[2], t)
    );
}

function buildPalette() {
    var bases = [
        [255,255,255],
        [255,0,0],
        [255,128,0],
        [255,255,0],
        [0,255,0],
        [0,255,255],
        [0,128,255],
        [0,0,255],
        [160,0,255],
        [255,0,255]
    ];

    paletteColors = [];

    for (var x = 0; x < PALETTE_COLS; x++) {
        paletteColors[x] = [];

        for (var y = 0; y < PALETTE_ROWS; y++) {
            var t = y / (PALETTE_ROWS - 1);

            if (x === 0) {
                var g = Math.round(255 * (1 - t));
                paletteColors[x][y] = rgb(g, g, g);
            } else {
                if (t <= 0.5) {
                    paletteColors[x][y] = mixColor(
                        [255,255,255],
                        bases[x],
                        t * 2
                    );
                } else {
                    paletteColors[x][y] = mixColor(
                        bases[x],
                        [0,0,0],
                        (t - 0.5) * 2
                    );
                }
            }
        }
    }
}

function drawPalette() {
    for (var y = 0; y < PALETTE_ROWS; y++) {
        for (var x = 0; x < PALETTE_COLS; x++) {
            var px = PALETTE_X + x * (PALETTE_CELL + PALETTE_GAP);
            var py = PALETTE_Y + y * (PALETTE_CELL + PALETTE_GAP);

            bar(
                display,
                px,
                py,
                PALETTE_CELL,
                PALETTE_CELL,
                paletteColors[x][y]
            );
        }
    }
}

function drawSelectedColors() {
    box(
        display,
        COLOR_BOX_X - 3,
        COLOR_BOX_Y - 3,
        COLOR_BOX_SIZE + 6,
        COLOR_BOX_SIZE + 6,
        "white"
    );

    bar(
        display,
        COLOR_BOX_X,
        COLOR_BOX_Y,
        COLOR_BOX_SIZE,
        COLOR_BOX_SIZE,
        color
    );

    box(
        display,
        COLOR_BOX_X - 3,
        COLOR_BOX_Y + COLOR_BOX_GAP - 3,
        COLOR_BOX_SIZE + 6,
        COLOR_BOX_SIZE + 6,
        "white"
    );

    bar(
        display,
        COLOR_BOX_X,
        COLOR_BOX_Y + COLOR_BOX_GAP,
        COLOR_BOX_SIZE,
        COLOR_BOX_SIZE,
        color2
    );
}

function pickPaletteColor(button) {
    for (var y = 0; y < PALETTE_ROWS; y++) {
        for (var x = 0; x < PALETTE_COLS; x++) {
            var px = PALETTE_X + x * (PALETTE_CELL + PALETTE_GAP);
            var py = PALETTE_Y + y * (PALETTE_CELL + PALETTE_GAP);

            if (
                mouseX >= px &&
                mouseX < px + PALETTE_CELL &&
                mouseY >= py &&
                mouseY < py + PALETTE_CELL
            ) {
                if (button === 1) {
                    color = paletteColors[x][y];
                }

                if (button === 3) {
                    color2 = paletteColors[x][y];
                }

                return;
            }
        }
    }
}

function paintGrid(button) {
    var cell = getMouseCell();

    if (!cell) {
        return;
    }

    var c = button === 3 ? color2 : color;

    drawPixelCell(cell.x, cell.y, c);

    image[cell.y * dx + cell.x] = c;
}

setdisplay(700,420);

display.oncontextmenu = function(e){
    e.preventDefault();
    return false;
};

display.addEventListener('contextmenu', function(e){
    e.preventDefault();
    return false;
}, false);

cls(display, 0);

buildPalette();
drawPalette();
cancella();

function update() {
    if (mousezone(GRID_X, GRID_Y, GRID_SIZE, GRID_SIZE)) {
        if (mouseB === 1 || mouseB === 3) {
            paintGrid(mouseB);
        }
    }

    if (mousezone(PALETTE_X, PALETTE_Y, PALETTE_W, PALETTE_H)) {
        if (mouseB === 1 || mouseB === 3) {
            pickPaletteColor(mouseB);
        }
    }

    box(
        display,
        GRID_X - 2,
        GRID_Y - 2,
        GRID_SIZE + 4,
        GRID_SIZE + 4,
        "white"
    );

    box(
        display,
        PALETTE_X - 2,
        PALETTE_Y - 2,
        PALETTE_W + 4,
        PALETTE_H + 4,
        "white"
    );

    drawSelectedColors();
}

function analyzeImage() {
    var colore = '';
    var volte = 0;
    var n = 0;

    var s = createsurface(480, 16 * dy + 30);

    text(s, 50, 18, 18, "black", "analisi Immagine");

    for (var yy = 0; yy < dy; yy++) {
        n = 0;

        text(s, 5, 25 + (yy * 16) + 8, 12, 'black', yy);

        colore = image[yy * dx];
        volte = 0;

        for (var xx = 0; xx < dx; xx++) {
            if (colore != image[yy * dx + xx]) {
                text(s, 50 + n, 25 + (yy * 16) + 8, 12, 'black', volte);

                n = n + 16;

                bar(s, 50 + n, 25 + (yy * 16), 14, 14, colore);
                box(s, 50 + n, 25 + (yy * 16), 14, 14, 'black');

                n = n + 20;

                volte = 1;
                colore = image[yy * dx + xx];
            } else {
                volte++;
            }
        }

        text(s, 50 + n, 25 + (yy * 16) + 8, 12, 'black', volte);

        n = n + 16;

        bar(s, 50 + n, 25 + (yy * 16), 14, 14, colore);
        box(s, 50 + n, 25 + (yy * 16), 14, 14, "black");
    }

    var dataURL = s.toDataURL();

    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head><title>Print analisi</title></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + dataURL + '">';
    windowContent += '</body>';
    windowContent += '</html>';

    var printWin = window.open();

    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();

    printWin.onload = function(){
        printWin.print();
        printWin.close();
    };
}
