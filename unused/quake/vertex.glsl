uniform float time;
uniform vec3 ripples[MAX_RIPPLES];
varying vec3 vecPos;
varying vec3 vecNormal;
attribute vec2 objectIndex;

void main() {
  vecPos = (modelMatrix * vec4(position, 1.0 )).xyz;
  vecNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

  float totalRippleEffect = 0.0;
  
  for (int i = 0; i < MAX_RIPPLES; i++){
    if (ripples[i].x < float(NUMBER_OF_CYLINDERS_PER_SIDE)){
      float distance = sqrt((pow(objectIndex.x - ripples[i].x, 2.0) + pow(objectIndex.y - ripples[i].y,2.0)) / (2.0 * pow(float(NUMBER_OF_CYLINDERS_PER_SIDE),2.0))) * float(NUMBER_OF_CYLINDERS_PER_SIDE);
      // equation comes from the Damped Sine Wave https://en.wikipedia.org/wiki/Damped_sine_wave
      // y = -A * e^ ( B * -x) * cos( C * x)
      // where
      // A is an amplification constant. (how large the ripples are above or below the horizontal plane)
      // B is a decay constant. (how quickly the size of the ripple approaches 0 as it gets farther from the center)
      // C is a proxmity constant that determines the distance between ripples
      // x is the distance from the center of the ripple
      // subtracting the count in the cos factor simulating the waves radiating outward
      float rippleEffect = -8.0 * exp(0.2 * - distance ) * cos(2.0 * (distance - ripples[i].z));
  
      // given the equation of a ripple, we then multiple it by e^(-x) * sin(x) which is a function 
      // that goes from 0 to 1 quickly and then back down to 0 slower. 
      // visually, this is so that  when a user clicks it doesn't immediatley show the ripple, but 
      // shows the ripple form and then over time dissipate
      totalRippleEffect += exp(-ripples[i].z + 2.0) * sin(0.5 * ripples[i].z) * rippleEffect;
    }
  }

  float totalSplashEffect = 0.0;
  // this is separated from above because the ripples from a coin toss get smaller over time while this ripple is constant
  vec2 center = vec2(50.0,25.0);
  float distance = sqrt((pow(objectIndex.x - center.x, 2.0) + pow(objectIndex.y - center.y,2.0)) / (2.0 * pow(float(NUMBER_OF_CYLINDERS_PER_SIDE),2.0))) * float(NUMBER_OF_CYLINDERS_PER_SIDE);
  totalSplashEffect += -10.0 * exp(0.05 * - distance ) * cos(1.0 * (distance - time));

  float totalEffect = totalRippleEffect + totalSplashEffect;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y + totalEffect, position.z, 1.0);
}
