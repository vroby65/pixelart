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
   image=data.split(';');
          for( y= 0 ;y<32;y++){
			for(x=0;x<32;x++){
    				bar( display, 50+(x*10), 50+(y*10),8,8,image[y*32+x])
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

function cancella(){
	for( y= 0 ;y<32;y++){
		for(x=0;x<32;x++){
    		bar( display, 50+(x*10), 50+(y*10),8,8,rgb(255,255,255))
    	}
    }
}

function salva(){
	data='';
    for( y= 0 ;y<32;y++){
		for(x=0;x<32;x++){
    		data=data+image[y*32+x]+';';
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

var image=Array();
for( y= 0 ;y<32;y++){
	for(x=0;x<32;x++){
    	bar( display, 50+(x*10), 50+(y*10),8,8,rgb(255,255,255))
        image[y*32+x]='white';
    }
}

var bcolor=Array();
bcolor[0]='aqua';	
bcolor[1]='black';	
bcolor[2]='blue';
bcolor[3]='fuchsia';	
bcolor[4]='gray';	
bcolor[5]='green';	
bcolor[6]='orange';	
bcolor[7]='maroon';	
bcolor[8]='navy';	
bcolor[9]='olive';
bcolor[10]='purple';	
bcolor[11]='red';	
bcolor[12]='silver';	
bcolor[13]='teal';	
bcolor[14]='white';	
bcolor[15]='yellow';

var i=0;
for( y= 0 ;y<8;y++){
	for(x=0;x<2;x++){
    	bar( display, 450+(x*40), 50+(y*40),38,38,bcolor[i]);
		i++;
    }
}
color=(rgb(255,0,0));
var data='';
function update() {
  
	if(mousezone(56,56,320,320)){
   		if (mouseB == 1){
          	var x =parseInt( (mouseX -46) /10)-1;
          	var y =parseInt( (mouseY -46) /10)-1;
	    	bar( display, 50+(x*10), 50+(y*10),8,8,color ) ;
	        image[y*32+x]=color;
        } 
    }

 	if(mousezone(450,50,160,320)){
   		if (mouseB == 1){
          	var x =parseInt( (mouseX -50) /10)-1;
          	var y =parseInt( (mouseY -50) /10)-1;
	    	color=getpixel( display, 50+(x*10), 50+(y*10) ) ;
        } 
    }  
	bar(display,400,10,40,40,color);	
}
