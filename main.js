var dx=32;
var dy=32;
var image=Array();
document.body.style.cursor = 'crosshair';

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
  saveCanvasAsImage(s);
}

function saveCanvasAsImage(canvas) {
  const imageData = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = imageData;
  a.download = 'immagine.png';
  a.click();
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
	for( y= 0 ;y<dy;y++){
		for(x=0;x<dx;x++){
			bar( display, 50+(x*(320/dx)), 50+(y*(320/dy)),320/dx-2,320/dy-2,image[y*dx+x+2])
		}
	}
}

function NPdownload(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a");
        url = window.URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
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


var i=0;
for( y= 0 ;y<8;y++){
	for(x=0;x<3;x++){
    	bar( display, 450+(x*40), 50+(y*40),38,38,bcolor[i]);
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

 	if(mousezone(450,50,160,320)){
   		if (mouseB == 1){
          	var x =parseInt((mouseX -50) /10)-1;
          	var y =parseInt((mouseY -50) /10)-1;
	    	color=getpixel(display, 50+(x*10), 50+(y*10));
        } 
    }  
	box(display,48,48,322,322,"white");
	box(display,448,48,122,322,"white");
	box(display,399,49,42,42,"white");	
	bar(display,400,50,40,40,color);	
}
