import vt from '../glsl/line.vert';
import fg from '../glsl/line.frag';
import { Mesh } from 'three/src/objects/Mesh';
import { Color } from 'three/src/math/Color';
import { Vector3 } from 'three/src/math/Vector3';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { MyObject3D } from "../webgl/myObject3D";
import { Func } from '../core/func';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Util } from '../libs/util';

export class Line extends MyObject3D {

  private _id: number;
  private _mesh: Array<Mesh> = [];
  private _noise: Array<Vector3> = [];

  constructor(opt: {geo: PlaneGeometry, id: number}) {
    super();

    this._id = opt.id;

    for (let i = 0; i < 50; i++) {
      this._noise.push(new Vector3(
        Util.instance.random(1, 1),
        1,
        1
      ));

      const mesh = new Mesh(
        opt.geo,
        new ShaderMaterial({
          vertexShader:vt,
          fragmentShader:fg,
          transparent:true,
          depthTest:false,
          uniforms:{
            color:{value:new Color(0xffffff)},
            alpha:{value: 0.5},
            time:{value: opt.id * 2 + i * 10},
          }
        })
      );
      this.add(mesh);
      this._mesh.push(mesh);
    }
  }

  protected _update():void {
    super._update();

    const maxSize = Math.max(Func.instance.sw(), Func.instance.sh())
    const sw = maxSize;
    const sh = maxSize;

    const hutosa = this._id == 0 ? 0.25 : 0.25;

    this._mesh.forEach((val,i) => {
      const n = this._noise[i];

      val.scale.set((sw / this._mesh.length) * hutosa * n.x, sh, 1);
      val.position.x = i * (sw / this._mesh.length) - sw * 0.5 + (sw / this._mesh.length) * 0.5;

      if(this._id == 1) {
        val.position.x += val.scale.x * 0.65;
      }

      const uni = this._getUni(val);
      uni.time.value += 1;
    });
  }
}