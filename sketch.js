let NODE_SIZE = 100;
let EDGE_LENGTH = 150;
let EDGE_STRENGTH = 0.1;
let SPACER_STRENGTH = 100;

let physics;
let zoom = 1;
let centroidX = 0;
let centroidY = 0;

let plants = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  smooth();
  strokeWeight( 2 );
  ellipseMode( CENTER );       
  
  physics = new ParticleSystem( 0, 0.1 );
  
  angleMode(RADIANS)
    
  initialize();
}

function draw() {
  physics.tick(); 
  if ( physics.particles.length > 1 ) {
    updateCentroid();
  }
  background( 10 );
  // fill( 0 );
  // translate( 0,0 );
  // scale( zoom );
  // translate( -centroidX, -centroidY );
  drawNetwork(); 
  
}

function drawNetwork()
{      
  

  // draw edges 
  stroke( 255 );
  strokeWeight(8);
  curveTightness(0);
  // noFill();
  
  for ( let i = 0; i < physics.springs.length; ++i )
  {
    let e = physics.springs[ i ];
    let a = e.a;
    let b = e.b;
    // strokeWeight(2)
    
    // ellipse(a.position.x, a.position.y, 10,10)
    // line(a.position.x, a.position.y, 0, b.position.x, b.position.y, 0)
    beginShape();
    
    vertex( a.position.x, a.position.y, 0 );
    // curveVertex( (a.position.x + b.position.x)/2 , (a.position.y + b.position.y)/2 );
    vertex( b.position.x, b.position.y, 0 );
    // curveVertex( b.position.x, b.position.y );
    endShape();
  }
 
  
}



function updateCentroid()
{
    let xMax = -999999.9, 
    xMin = +999999.9, 
    yMin = +999999.9, 
    yMax = -999999.9;

  for ( let i = 0; i <  physics.particles.length; ++i )
  {
    let p = physics.particles[i];
    xMax = max( xMax, p.position.x );
    xMin = min( xMin, p.position.x );
    yMin = min( yMin, p.position.y );
    yMax = max( yMax, p.position.y );
    if(p.position.x-NODE_SIZE/2 < -width/2 ) {
      // console.log(p.velocity.x)
      p.velocity.x *= -1;
    }
    
    if(p.position.x+NODE_SIZE/2 > width/2 ) {
      p.velocity.x *= -1;
    }
    
     if(p.position.y-NODE_SIZE/2 < -height/2 ) {
      p.velocity.y *= -1;
    }
    
    if(p.position.y+NODE_SIZE/2 > height/2 ) {
      p.velocity.y *= -1;
    }
  }
  let deltaX = xMax-xMin;
  let deltaY = yMax-yMin;
  
  centroidX = xMin + 0.5*deltaX;
  centroidY = yMin +0.5*deltaY;
  
  if ( deltaY > deltaX )
    zoom = height/(deltaY+50);
  else
    zoom = width/(deltaX+50);
}

function addSpacersToNode(  p,  r )
{
  for ( let i = 0; i <  physics.particles.length; ++i )
  {
    let q = physics.particles[i];
    if ( p != q && p != r )
      physics.makeAttraction( p, q, -SPACER_STRENGTH, 20 );
  }
}

function makeEdgeBetween( a, b )
{
  physics.makeSpring( a, b, EDGE_STRENGTH, EDGE_STRENGTH, random(10,50) );
}

function initialize()
{
  physics.clear();
  // physics.makeParticle();
  // for(var i =0; i< 40; i++) {
  // 	addNode();
  // }
  for(var i =0; i < 2; i++) {
    createPlant()
  }
}

function addNode(plant,here)
{ 
  let p = physics.makeParticle();
  p.connections = 0;
  
  let q = here ? here : plant[ plant.length-1 ];
  while ( q == p ) {
    q = plant[ round(random( 0,  plant.length-1)) ];
  }
  plant.push(p);
  addSpacersToNode( p, q );
  makeEdgeBetween( p, q );
  p.connections++;
  q.connections++;
  p.position.set( q.position.x + random( -1, 1 ), q.position.y + random( -1, 1 ), 0 );
}



function createPlant() {
  let p = physics.makeParticle();
  p.connections = 0;
  let plant = [];
  plant.push(p);
  plants.push(plant);
  for(var i =0; i< 150; i++) {
  	addNode(plant);
  }
  // addNode(plant,plant[ 0 ]);
  // addNode(plant,plant[ 0 ]);
}

