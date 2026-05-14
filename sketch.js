// 3595u
// 3500u

var physics;

const WORDS = "T H E R E E  I R E  Y 'R E".split(" ");

const NODE_SIZE = 25;

const EDGE_STRENGTH = 0.01;
const SPACER_STRENGTH = 100;

const MOUSE_RADIUS = 200;
const MOUSE_FORCE = 2.5;

var gr, pi;

function setup() {
  createCanvas(windowWidth, windowHeight*0.85);

  physics = new ParticleSystem(0, 0.1);

  initializeNetwork();
  
  textFont('parabolica-light');
  textAlign(CENTER, CENTER);
  textSize(24);

  strokeCap(ROUND);
  
  pi = color(246, 180, 206);
  gr = color(40, 117, 87);
  
  pi = color(40, 117, 87);
  gr = color(245);
}

function draw() {
  background(gr);

  repelParticles();
  
  constrainParticles();
   
  physics.tick();

  translate(width / 2, height / 2);

  drawSprings();
  drawParticles();
}

function initializeNetwork() {

  physics.clear();

  var particles = [];
  
  var p = createParticle();

  particles.push(p);
  
  p.connections = 0;

  for (var i = 1; i < WORDS.length; i++) {

    var p = createParticle();

    particles.push(p);

    // skip first node
    // if (i === 0) continue;

    var parent;

    if (i === 2 || i === 5 || i === 9) {

      parent = particles[1];

    } else {

      parent = particles[i - 1];
    }

    connectParticles(parent, p);

    addSpacers(p);
  }
}

function createParticle() {

  var p = physics.makeParticle();

  p.position.set(
    random(-200, 200),
    random(-200, 200),
    0
  );

  return p;
}

function connectParticles(a, b) {

  physics.makeSpring(
    a,
    b,
    EDGE_STRENGTH,
    EDGE_STRENGTH,
    100
  );
}

function addSpacers(particle) {

  for (var other of physics.particles) {

    if (particle !== other) {

      physics.makeAttraction(
        particle,
        other,
        -SPACER_STRENGTH,
        20
      );
    }
  }
}

function drawSprings() {

  noFill();
  stroke(pi);
  strokeWeight(2);
  
  var count = 0

  for (var spring of physics.springs) {

    var a = spring.a.position;
    var b = spring.b.position;

    // drawCurvedEdge(a.x, a.y, b.x, b.y);
    dottedCurve(a.x, a.y, b.x, b.y, count);
    count++;
  }
}

function drawCurvedEdge(x1, y1, x2, y2) {

  var mx = (x1 + x2) * 0.5;
  var my = (y1 + y2) * 0.5;

  var dx = x2 - x1;
  var dy = y2 - y1;

  var distance = dist(x1, y1, x2, y2);

  var nx = -dy / distance;
  var ny = dx / distance;

  var curveOffset = distance * 0.15;

  var cx = mx + nx * curveOffset;
  var cy = my + ny * curveOffset;

  bezier(
    x1, y1,
    cx, cy,
    cx, cy,
    x2, y2
  );
}

function drawParticles() {

  for (var i = 0; i < physics.particles.length; i++) {

    var p = physics.particles[i];

    fill(gr);
    stroke(gr);
    strokeWeight(2);

    text(WORDS[i], p.position.x, p.position.y);

    noStroke();
    fill(pi);

    text(WORDS[i], p.position.x, p.position.y);
  }
}

function repelParticles() {

  var mx = mouseX - width / 2;
  var my = mouseY - height / 2;

  for (var p of physics.particles) {

    var dx = p.position.x - mx;
    var dy = p.position.y - my;

    var d = sqrt(dx * dx + dy * dy);

    if (d < MOUSE_RADIUS && d > 0.01) {

      var force = (1 - d / MOUSE_RADIUS) * MOUSE_FORCE;

      p.velocity.x += (dx / d) * force;
      p.velocity.y += (dy / d) * force;
    }
  }
}

function constrainParticles() {

  var padding = 80;
  var wallStrength = 0.5;

  var left = -width / 2 + padding;
  var right = width / 2 - padding;
  var top = -height / 2 + padding;
  var bottom = height / 2 - padding;

  for (var p of physics.particles) {

    // LEFT
    if (p.position.x < left) {
      p.velocity.x += (left - p.position.x) * wallStrength;
    }

    // RIGHT
    if (p.position.x > right) {
      p.velocity.x -= (p.position.x - right) * wallStrength;
    }

    // TOP
    if (p.position.y < top) {
      p.velocity.y += (top - p.position.y) * wallStrength;
    }

    // BOTTOM
    if (p.position.y > bottom) {
      p.velocity.y -= (p.position.y - bottom) * wallStrength;
    }
  }
}

function dottedCurve(x1, y1, x2, y2, dir) {

  var mx = (x1 + x2) * 0.5;
  var my = (y1 + y2) * 0.5;

  var dx = x2 - x1;
  var dy = y2 - y1;
  var d = sqrt(dx * dx + dy * dy);

  var nx = -dy / d;
  var ny = dx / d;
  
  var thing = 0.25;
  
  // if(dir%2==0){
  //   thing = 0.25;
  // } else {
  //   thing = -0.25;
  // }

  var cx = mx + nx * d * thing;
  var cy = my + ny * d * thing;

  var steps = int(d / 5); // dot spacing

  noStroke();
  fill(pi);

  for (var i = 0; i <= steps; i++) {

    var t = i / steps;

    var x =
      (1 - t) * (1 - t) * x1 +
      2 * (1 - t) * t * cx +
      t * t * x2;

    var y =
      (1 - t) * (1 - t) * y1 +
      2 * (1 - t) * t * cy +
      t * t * y2;

    circle(x, y, 2);
  }
}
