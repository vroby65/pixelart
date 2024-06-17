var dx=32;
var dy=32;
var image=Array();
document.body.style.cursor = 'crosshair';
//window.screen.orientation.lock('landscape');

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen(); 
    }
  }
}

function stampa(){
	var s=createsurface(320,320);
	blt(s,0,0,320,320,display,49,49,320,320);
	var dataURL =s.toDataURL();

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
	printWin.onload=function(){printWin.print();printWin.close();}
}

function saveImage(){
  var s=createsurface(320,320);
  blt(s,0,0,320,320,display,49,49,320,320);
  
  //saveCanvasAsImage(s);
  savePng(s);
}

function savePng(canvas) {
  var image = new Image();
  image.src = canvas.toDataURL("image/png");
  
  var link = document.createElement("a");
  link.href = image.src;

  // Aggiungi la trasparenza ai pixel neri nell'immagine
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var brightnessThreshold = 100; // Soglia di luminosità per considerare un pixel come nero
  for (var i = 0; i < data.length; i += 4) {
    // Calcola la luminosità del pixel
    var brightness = (0.2126 * data[i]) + (0.7152 * data[i + 1]) + (0.0722 * data[i + 2]);
    if (brightness < brightnessThreshold) {
      data[i + 3] = 0; // Imposta la trasparenza a zero per i pixel neri
    }
  }
  context.putImageData(imageData, 0, 0);

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

function _np_create(){
	const newFileReader = document.createElement('input');
	newFileReader.type='file';
	newFileReader.id='file-np-input';
	newFileReader.style.display='none';
	document.body.appendChild(newFileReader);
  	document.getElementById('file-np-input').addEventListener("change",readNPSingleFile, false);
}
_np_create();

function _np_load(){
	data='';
	document.getElementById('file-np-input').value="";
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
        //document.getElementById('file-np-input').remove();
	};
	reader.readAsText(file);
}

function displayNPContents(contents) {
   data = contents;
   image='';
   image=data.split(';');
   dx=image[0];
   dy=image[1];
   bar(display,50,50,320,320,'black');
   image.splice(0,2);
	for( y= 0 ;y<dy;y++){
		for(x=0;x<dx;x++){
			bar( display, 50+(x*(320/dx)), 50+(y*(320/dy)),320/dx-2,320/dy-2,image[y*dx+x])
		}
	}
}

function NPdownload(textToSave, filename, type){
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

function destroyClickedElement(event){
    document.body.removeChild(event.target);
}

function risoluzione(x,y){
	dx=x;
	dy=y;
	bar(display,50,50,320,320,'black');
	cancella();
}

function cancella(){
	for( y= 0 ;y<dy;y++){
		for(x=0;x<dx;x++){
    		bar( display, 50+(x*(320/dx)), 50+(y*(320/dy)),320/dx-2,320/dy-2,rgb(255,255,255));
    		image[y*dx+x]='white';
    	}
    }
}

function salva(){
	data='';
	data=dx+';';
	data=data+dy+';';
    for( y= 0 ;y<dy;y++){
		for(x=0;x<dy;x++){
    		data=data+image[y*dx+x]+';';
    	}
    }
    NPdownload(data,"file.pixelart",'text');
}

function carica(){
	data='';
    _np_load();          
}
 

setdisplay(600,400);
cls(display,0);

for( y= 0 ;y<dy;y++){
	for(x=0;x<dx;x++){
    	bar( display, 50+(x*(320/dx)), 50+(y*(320/dy)),320/dx-2,320/dy-2,rgb(255,255,255))
        image[y*dx+x]='white';
    }
}

var bcolor=Array();
/*
bcolor[0]='aqua';	
bcolor[1]='black';	
bcolor[2]='blue';
bcolor[3]='fuchsia';	
bcolor[4]='gray';	
bcolor[5]='green';	
bcolor[6]='lime';	
bcolor[7]='maroon';	
bcolor[8]='navy';	
bcolor[9]='olive';
bcolor[10]='purple';	
bcolor[11]='red';	
bcolor[12]='silver';	
bcolor[13]='teal';	
bcolor[14]='white';	
bcolor[15]='yellow';
bcolor[16]='Tomato';
bcolor[17]='Orange';
bcolor[18]='DodgerBlue';
bcolor[19]='MediumSeaGreen';
bcolor[20]='Gray';
bcolor[21]='SlateBlue';
bcolor[22]='Violet';
bcolor[23]='LightGray';
*/
bcolor[0]='AliceBlue';
bcolor[1]='AntiqueWhite';
bcolor[2]='Aqua';
bcolor[3]='Aquamarine';
bcolor[4]='Azure';
bcolor[5]='Beige';
bcolor[6]='Bisque';
bcolor[7]='Black';
bcolor[8]='BlanchedAlmond';
bcolor[9]='Blue';
bcolor[10]='BlueViolet';
bcolor[11]='Brown';
bcolor[12]='BurlyWood';
bcolor[13]='CadetBlue';
bcolor[14]='Chartreuse';
bcolor[15]='Chocolate';
bcolor[16]='Coral';
bcolor[17]='CornflowerBlue';
bcolor[18]='Cornsilk';
bcolor[19]='Crimson';
bcolor[20]='Cyan';
bcolor[21]='DarkBlue';
bcolor[22]='DarkCyan';
bcolor[23]='DarkGoldenRod';
bcolor[24]='DarkGray';
bcolor[25]='DarkGrey';
bcolor[26]='DarkGreen';
bcolor[27]='DarkKhaki';
bcolor[28]='DarkMagenta';
bcolor[29]='DarkOliveGreen';
bcolor[30]='DarkOrange';
bcolor[31]='DarkOrchid';
bcolor[32]='DarkRed';
bcolor[33]='DarkSalmon';
bcolor[34]='DarkSeaGreen';
bcolor[35]='DarkSlateBlue';
bcolor[36]='DarkSlateGray';
bcolor[37]='DarkSlateGrey';
bcolor[38]='DarkTurquoise';
bcolor[39]='DarkViolet';
bcolor[40]='DeepPink';
bcolor[41]='DeepSkyBlue';
bcolor[42]='DimGray';
bcolor[43]='DimGrey';
bcolor[44]='DodgerBlue';
bcolor[45]='FireBrick';
bcolor[46]='FloralWhite';
bcolor[47]='ForestGreen';
bcolor[48]='Fuchsia';
bcolor[49]='Gainsboro';
bcolor[50]='GhostWhite';
bcolor[51]='Gold';
bcolor[52]='GoldenRod';
bcolor[53]='Gray';
bcolor[54]='Grey';
bcolor[55]='Green';
bcolor[56]='GreenYellow';
bcolor[57]='HoneyDew';
bcolor[58]='HotPink';
bcolor[59]='IndianRed';
bcolor[60]='Indigo';
bcolor[61]='Ivory';
bcolor[62]='Khaki';
bcolor[63]='Lavender';
bcolor[64]='LavenderBlush';
bcolor[65]='LawnGreen';
bcolor[66]='LemonChiffon';
bcolor[67]='LightBlue';
bcolor[68]='LightCoral';
bcolor[69]='LightCyan';
bcolor[70]='LightGoldenRodYellow';
bcolor[71]='LightGray';
bcolor[72]='LightGrey';
bcolor[73]='LightGreen';
bcolor[74]='LightPink';
bcolor[75]='LightSalmon';
bcolor[76]='LightSeaGreen';
bcolor[77]='LightSkyBlue';
bcolor[78]='LightSlateGray';
bcolor[79]='LightSlateGrey';
bcolor[80]='LightSteelBlue';
bcolor[81]='LightYellow';
bcolor[82]='Lime';
bcolor[83]='LimeGreen';
bcolor[84]='Linen';
bcolor[85]='Magenta';
bcolor[86]='Maroon';
bcolor[87]='MediumAquaMarine';
bcolor[88]='MediumBlue';
bcolor[89]='MediumOrchid';
bcolor[90]='MediumPurple';
bcolor[91]='MediumSeaGreen';
bcolor[92]='MediumSlateBlue';
bcolor[93]='MediumSpringGreen';
bcolor[94]='MediumTurquoise';
bcolor[95]='MediumVioletRed';
bcolor[96]='MidnightBlue';
bcolor[97]='MintCream';
bcolor[98]='MistyRose';
bcolor[99]='Moccasin';
bcolor[100]='NavajoWhite';
bcolor[101]='Navy';
bcolor[102]='OldLace';
bcolor[103]='Olive';
bcolor[104]='OliveDrab';
bcolor[105]='Orange';
bcolor[106]='OrangeRed';
bcolor[107]='Orchid';
bcolor[108]='PaleGoldenRod';
bcolor[109]='PaleGreen';
bcolor[110]='PaleTurquoise';
bcolor[111]='PaleVioletRed';
bcolor[112]='PapayaWhip';
bcolor[113]='PeachPuff';
bcolor[114]='Peru';
bcolor[115]='Pink';
bcolor[116]='Plum';
bcolor[117]='PowderBlue';
bcolor[118]='Purple';
bcolor[119]='RebeccaPurple';
bcolor[120]='Red';
bcolor[121]='RosyBrown';
bcolor[122]='RoyalBlue';
bcolor[123]='SaddleBrown';
bcolor[124]='Salmon';
bcolor[125]='SandyBrown';
bcolor[126]='SeaGreen';
bcolor[127]='SeaShell';
bcolor[128]='Sienna';
bcolor[129]='Silver';
bcolor[130]='SkyBlue';
bcolor[131]='SlateBlue';
bcolor[132]='SlateGray';
bcolor[133]='SlateGrey';
bcolor[134]='Snow';
bcolor[135]='SpringGreen';
bcolor[136]='SteelBlue';
bcolor[137]='Tan';
bcolor[138]='Teal';
bcolor[139]='Thistle';
bcolor[140]='Tomato';
bcolor[141]='Turquoise';
bcolor[142]='Violet';
bcolor[143]='Wheat';
bcolor[144]='White';
bcolor[145]='Color Mixer';
bcolor[146]='Color Picker';
bcolor[147]='WhiteSmoke';
bcolor[148]='Yellow';
bcolor[149]='YellowGreen';
bcolor[150]='#ff0000';
bcolor[151]='#00ff00';
bcolor[152]='#0000ff';
bcolor[153]='#ff00ff';
bcolor[154]='#00ffff';
bcolor[155]='#ffff00';
bcolor[156]='#800000';
bcolor[157]='#008000';
bcolor[158]='#000080';
//bcolor[159]='#800080';
bcolor[159]='rgba(255,0,255,1)';


var i=0;
for( y= 0 ;y<20;y++){
	for(x=0;x<8;x++){
    	bar( display, 450+(x*13), 50+(y*13),11,11,bcolor[i]);
		i++;
    }
}

color=(rgb(255,0,0));
var data='';


function update() {
  
	if (dx<=16){
		if(mousezone(50,50,320,320)){
			if (mouseB == 1){
				var x =parseInt((mouseX - 50 - (80/dx))/(320/dx));
				var y =parseInt((mouseY - 50 - (80/dy))/(320/dy));
				bar( display, 50+(x*(320/dx)), 50+(y*(320/dy)),320/dx-2,320/dx-2,color ) ;
				image[y*dx+x]=color;
			}
		}
	}
	else{
		if(mousezone(50,50,320+(320/dx),320+(320/dy))){
			if (mouseB == 1){
				var x =parseInt((mouseX - 50 - (320/dx))/(320/dx));
				var y =parseInt((mouseY - 50 - (320/dy))/(320/dy));
				bar( display, 50+(x*(320/dx)), 50+(y*(320/dy)),320/dx-2,320/dx-2,color ) ;
				image[y*dx+x]=color;
			}
		}
	 }

 	if(mousezone(450,50,106,263)){
   		if (mouseB == 1){
          	var x =parseInt((mouseX -450-7) /13);
          	var y =parseInt((mouseY -50-7) /13);
	    	color=getpixel(display, 450+(x*13), 50+(y*13));
        } 
    }  
    
	box(display,48,48,322,322,"white");
	box(display,448,48,106,263,"white");
	box(display,399,49,42,42,"white");	
	bar(display,400,50,40,40,color);	
}


function analyzeImage(){
    var colore='';
    var volte=0;
    var n=0;
   	var s=createsurface(480 ,16 * dy + 30);

    text ( s, 50, 18,18, "black", "analisi Immagine");

	for( y= 0 ;y<dy;y++){
        var n=0;
        text ( s, 5, 25+(y*16)+8, 12, 'black', y);
        colore=image[y*dx];
        volte=0;
        
		for(x=0;x<dx;x++){
    		if (colore !=image[y*dx+x]){
                text ( s, 50+n, 25+(y*16)+8, 12, 'black', volte);
                n=n+16;
                bar( s, 50+n, 25+(y*16),14,14,colore);
                box( s, 50+n, 25+(y*16),14,14,'black');
                n=n+ 20;
                volte=1;
                colore=image[y*dx+x];
            }
            else {
                volte++;
            }
    	}
        text ( s, 50+n, 25+(y*16)+8, 12, 'black', volte);
        n=n+16;
        bar( s, 50+n, 25+(y*16), 14, 14, colore);
        box( s, 50+n, 25+(y*16), 14, 14, "black");
    } 
	var dataURL =s.toDataURL();

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
	printWin.onload=function(){printWin.print();printWin.close();}
}
