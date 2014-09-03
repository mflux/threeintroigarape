var Util = {
  extractCountyName: function( id ){
    return id.split(',')[0];
  },

  svgToShape: function( svg ){
    var type = 'svg';
    var two = new Two({
      type: Two.Types[type],
      fullscreen: false,
      autostart: false
    });
    return two.interpret( svg );
  },

  parseChildren: function( group ){
    var children = group.children;
    var container = new THREE.Object3D();
    for( var i in group.children ){
      var child = group.children[i];
      if( child instanceof Two.Polygon ){
        var vertices = child.vertices;
        var mesh = Util.createMesh( vertices );
        container.add( mesh );

        mesh.id = Util.extractCountyName( child.id );
        // Util.getCentroid( mesh );
      }
      else
      if( child instanceof Two.Group ){
        var meshes = Util.parseChildren( child );
        container.add( meshes );
      }
    }
    return container;
  },

  createMesh: function( vertices ){
    if( vertices.length <= 3 ){
      return new THREE.Object3D();
    }

    var geo = new THREE.Geometry();
    for( var i in vertices ){
      var p = Util.vectorToSpherical( vertices[i].x, vertices[i].y );
      geo.vertices.push( p );
    }

    var mat = new THREE.LineBasicMaterial();
    var mesh = new THREE.Line( geo, mat );
    // console.log( mesh );
    return mesh;

    // //  note that we must flip y axis here
    // var sh = new THREE.Shape();
    // sh.moveTo( vertices[0].x, -vertices[0].y );
    // for( var i=1; i<vertices.length; i++ ){
    //   var p = vertices[i];
    //   sh.lineTo( p.x, -p.y );
    // }

    // var zoneMaterial = new THREE.MeshPhongMaterial({
    //   color: Math.random() * 10000000,
    //   side: THREE.DoubleSide
    // });

    // var geometry = sh.extrude({
    //   height: 1,
    //   size: 1,
    //   amount: 5,
    //   steps: 1,
    //   bevelEnabled: false,
    // });

    // var mesh = new THREE.Mesh( geometry, zoneMaterial );

    // return mesh;
  },

  toSpherical: function( lon, lat, rad ){
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lon) * Math.PI / 180;

    var position = new THREE.Vector3();
    position.x = rad * Math.sin(phi) * Math.cos(theta);
    position.y = rad * Math.cos(phi);
    position.z = rad * Math.sin(phi) * Math.sin(theta);
    return position;
  },

  vectorToSpherical: function( vx, vy ){
    var svgWidth = 856;
    var svgHeight = 433;
    var tx = vx / svgWidth;
    var ty = vy / svgHeight;

    console.log( vx, vy );
    console.log( tx, ty );

    var lon = tx * Math.PI * 2;
    var lat = -Math.PI + ty * Math.PI * 2;

    var absPos = Util.toSpherical( lon * 57.2957795 , lat * 57.2957795, 120 );
    return absPos;
  }


}