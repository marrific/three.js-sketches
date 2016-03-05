var renderer	= new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var updateFcts	= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 3;

	//////////////////////////////////////////////////////////////////////////////////
	//		add an object and make it move					//
	//////////////////////////////////////////////////////////////////////////////////

	var dynamicTexture	= new THREEx.DynamicTexture(512,512)
	dynamicTexture.context.font	= "bolder 90px Verdana";
	dynamicTexture.texture.anisotropy = renderer.getMaxAnisotropy()
	updateFcts.push(function(delta, now){
		// build the text which contains the time
		var present	= new Date()
		var text	= pad(present.getHours(), 2, '0')
		+ ':' + pad(present.getMinutes(), 2, '0')
		+ ':' + pad(present.getSeconds(), 2, '0')
		function pad(n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		}

		// update the text
		dynamicTexture.clear('cyan')
		.drawText(text, undefined, 256, 'red')

	})


	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	var geometry	= new THREE.BoxGeometry( 1, 1, 1);
	var material	= new THREE.MeshBasicMaterial({
		map	: dynamicTexture.texture
	})
	var mesh	= new THREE.Mesh( geometry, material );
	scene.add( mesh );
	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0}
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
		mouse.y	= (event.clientY / window.innerHeight) - 0.5
	}, false)
	updateFcts.push(function(delta, now){
		camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
		camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
		camera.lookAt( scene.position )
	})


	var tempMaterial = new THREE.MeshPhongMaterial({color: 'white', shininess: 0});


	var geometryLoader = new THREE.JSONLoader();

  // load our rock and create a ring of rocks
  geometryLoader.load('assets/rock.js', function ( rockGeometry, materials ) {
  	var numRocks = 20;
  	var ringRadius = 1.5;
  	for(var i = 0; i < numRocks; ++i) {
  		var rock = new THREE.Mesh(rockGeometry, material);

  		rock.position.x = ringRadius * Math.sin(i / numRocks * 2 * Math.PI);
  		rock.position.z = ringRadius * Math.cos(i / numRocks * 2 * Math.PI);

  		rock.rotation.y = Math.random() * Math.PI * 2;
  		rock.scale.x = rock.scale.y = rock.scale.z = Math.random() * 0.1 + 1;

  		scene.add(rock);
  	}
  }
  );






	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	updateFcts.push(function(){
		renderer.render( scene, camera );
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		updateFcts.forEach(function(updateFn){
			updateFn(deltaMsec/1000, nowMsec/1000)
		})
	})