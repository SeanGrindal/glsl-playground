uniform sampler2D uImage;
uniform vec2 uSize;

varying vec2 vCoordinates;
varying vec3 vPos;

void main() {  
   float alpha = 1.0 - clamp(0.0, 1.0, abs(vPos.z/400.0));

   vec2 uv = vec2(vCoordinates.x / uSize.x, vCoordinates.y / uSize.y);
   vec4 image = texture2D(uImage, uv);

   gl_FragColor = vec4(image.xyz, alpha);
}