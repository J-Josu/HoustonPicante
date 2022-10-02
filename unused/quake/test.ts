
const geometry = new PlaneGeometry(10, 10, 100, 100);


var NUMBER_OF_CYLINDERS_PER_SIDE = 100
var MAX_RIPPLES = 10
var RADIUS_SEGMENTS = 16
var RADIUS = 5.0
var CYLINDER_HEIGHT = 15.0
var PLANE_WIDTH = NUMBER_OF_CYLINDERS_PER_SIDE * 2 * RADIUS
var PLANE_HEIGHT = NUMBER_OF_CYLINDERS_PER_SIDE * 2 * RADIUS
var vertices = []
var normals = []
var uvs = []
var indices = []

var vertexShader = `
    uniform float time;
    varying vec3 pos;
    void main()	{
      pos = position;
      vec3 p = position;
      //p.y = sin(p.x * .1 - time) * cos(p.z * .1 - time) * 5.;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
    }
  `;
var fragmentShader = `
    /* based on http://madebyevan.com/shaders/grid/ */
  
    varying vec3 pos;
    uniform float time;
    
    float line(float width, vec3 step){
      vec3 tempCoord = pos / step;
      
      vec2 coord = tempCoord.xz;

      vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord * width);
      float line = min(grid.x, grid.y);
      
      return 1. - min(line, 1.0);
    }
    
    void main() {
      float v = line(1., vec3(1.)) + line(1.5, vec3(10.));      
      vec3 c = v * vec3(0., 1., 1.) * (sin(time * 5. - length(pos.xz) * .5) * .5 + .5);
      c = mix(vec3(0.5), c, v);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `;
export const uniforms = {
  time: {
    value: 0
  }
};
const MESH_TABLE_BY_COLOR: { [magnitud in MagnitudGrade]: ShaderMaterial } = {
  H: new ShaderMaterial({
    // color: `hsl(${0}, 100%, 50%)`,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: { derivatives: true }
  }),
  M: new ShaderMaterial({
    // color: `hsl(${64}, 100%, 50%)`,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: { derivatives: true }
  }),
  L: new ShaderMaterial({
    // color: `hsl(${128}, 100%, 50%)`,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    extensions: { derivatives: true }
  }),
};
