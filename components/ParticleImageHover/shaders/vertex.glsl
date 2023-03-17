attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;
attribute float aPress;
attribute float aDirection;

uniform float uMove;
uniform float uTime;
uniform vec2 uMouse;
uniform float uPR;
uniform float uArea;
uniform float uXEffect;
uniform float uYEffect;
uniform float uZEffect;
uniform float uSpeed;
uniform float uParticleSize;

varying vec2 vUv;
varying vec2 vCoordinates;
varying vec3 vPos;

void main() {
   vUv = uv;

   vec3 pos = position;

   vec3 stable = position;
   float dist = distance(stable.xy, uMouse);
   float area = 1.0 - smoothstep(0., uArea, dist);

   stable.x += uXEffect * sin(uSpeed * uTime * aPress) * aDirection * area;
   stable.y += uYEffect * cos(uSpeed * uTime * aPress) * aDirection * area;
   stable.z += uZEffect * cos(uSpeed * uTime * aPress) * aDirection * area;

   vec4 mvPosition = modelViewMatrix * vec4( stable, 1.0 );

   gl_PointSize = 2000. * uPR * uParticleSize * (1.0 / - mvPosition.z);
   gl_Position = projectionMatrix * mvPosition;

   vPos = pos;
   vCoordinates = aCoordinates.xy;
}