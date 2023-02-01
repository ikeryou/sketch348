uniform float time;

void main(){
  vec3 p = position;
  float t = position.y * 5.0 + time * 0.025;
  p.z += sin(t) * 100.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
