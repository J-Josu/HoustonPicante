precision highp float;
varying vec3 vecPos;
varying vec3 vecNormal;

struct PointLight {
  vec3 color;
  vec3 position;
  float decay;
  float distance;
  int shadow;
  float shadowBias;
  float shadowRadius;
  vec2 shadowMapSize;
};
uniform PointLight pointLights[1];
uniform vec3 ambientLightColor;

void main(){
  vec4 addedLights = vec4(ambientLightColor,1.0);
  vec3 lightDirection = normalize(vecPos - pointLights[0].position);
  addedLights.rgb += clamp(dot(-lightDirection, vecNormal), 0.0, 1.0) * pointLights[0].color;

  gl_FragColor = vec4(0.1294,0.5803,0.8078 , 1.0) * addedLights;
}

