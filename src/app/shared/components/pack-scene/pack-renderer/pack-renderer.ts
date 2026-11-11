import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  DirectionalLight,
  DoubleSide,
  Euler,
  FrontSide,
  Group,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Raycaster,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  PACK_CAMERA,
  PACK_GEOMETRY,
  PACK_LAYOUT,
  PACK_TEAR,
  PACK_TEXTURE,
  PACK_TIMING,
} from '../../../constants/ui.const';
import {
  PackCard,
  PackPalette,
  PackPose,
  PackRendererOptions,
  PackSceneApi,
} from '../../../models/pack.model';
import { PackFlow } from '../pack-flow/pack-flow';
import {
  drawCardBack,
  drawCardFront,
  drawGlow,
  drawPackFront,
  drawRoundedMask,
  drawSealMask,
  loadImage,
  readPalette,
} from '../pack-art/pack-art';
import {
  cameraFit,
  clamp01,
  deckPose,
  easeInCubic,
  easeInOutCubic,
  Easing,
  easeLinear,
  easeOutBack,
  easeOutCubic,
  fanPose,
  flapPose,
  inspectPose,
  packPose,
  packSurfaceZ,
  slotPose,
  stackedCardPose,
  tearFromDrag,
} from '../pack-math/pack-math';

interface Tween {
  elapsed: number;
  duration: number;
  easing: Easing;
  apply: (progress: number) => void;
  done: () => void;
}

interface CardObject {
  group: Group;
  front: Mesh<PlaneGeometry, MeshPhysicalMaterial>;
  /** Posizione nell'ordine di rivelazione: 0 è la prima carta girata (l'ultima in classifica) */
  revealIndex: number;
  inPack: boolean;
}

/** Scena 3D della busta: si carica solo quando serve, perché porta con sé three */
export class PackRenderer implements PackSceneApi {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(PACK_CAMERA.fov, 1, 0.1, 60);
  private readonly key = new DirectionalLight(0xffffff, 1.5);
  private readonly packGroup = new Group();
  private readonly hinge = new Group();
  private readonly bodyMeshes: Mesh[] = [];
  private readonly flapMeshes: Mesh[] = [];
  private readonly flapMaterials: (MeshPhysicalMaterial | MeshStandardMaterial)[] = [];
  private readonly cards: CardObject[] = [];
  private readonly textures: CanvasTexture[] = [];
  private readonly glow: Sprite;
  private readonly flow: PackFlow;
  private readonly palette: PackPalette;
  private readonly raycaster = new Raycaster();
  private readonly pointer = new Vector2();
  private readonly resizeObserver: ResizeObserver;
  private readonly tweens: Tween[] = [];
  private readonly matrix = new Matrix4();
  private readonly position = new Vector3();
  private readonly scale = new Vector3();
  private readonly rotation = new Quaternion();

  private covers = new Map<string, HTMLImageElement | null>();
  private cardData: readonly PackCard[] = [];
  private glowFollow: Object3D | null = null;
  private inspectBase: PackPose | null = null;
  private fit = 1;
  private distance: number = PACK_CAMERA.distance;
  private clock = 0;
  private intro = 0;
  private tear = 0;
  private rise = 0;
  private leave = 0;
  private lookX = 0;
  private lookY = 0;
  private targetX = 0;
  private targetY = 0;
  private drag: { startX: number; width: number; progress: number } | null = null;
  private tapStart: { x: number; y: number } | null = null;
  private frameId = 0;
  private lastFrame = 0;
  private disposed = false;

  public constructor(private readonly options: PackRendererOptions) {
    const { canvas } = options;
    this.renderer = this.createGl(canvas);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.palette = readPalette(document.documentElement);
    this.flow = new PackFlow(options.count, options.mode);

    this.scene.environment = this.createEnvironment(this.renderer);
    this.key.position.set(2, 3, 6);
    this.scene.add(this.key, this.packGroup);

    this.buildPack();
    this.buildCards();
    this.glow = this.buildGlow();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerCancel);
    this.resize();
  }

  public get hasCards(): boolean {
    return this.cardData.length > 0;
  }

  public start(): void {
    if (this.options.mode === 'review') {
      this.packGroup.visible = false;
      this.intro = 1;
      this.leave = 1;
      this.tear = 1;
      this.cards.forEach((card) => {
        card.inPack = false;
        this.applyPose(card.group, fanPose(card.revealIndex, this.options.count, this.fit));
      });
    } else {
      void this.tween(PACK_TIMING.intro, (t) => (this.intro = t), easeLinear).then(() => {
        if (this.flow.introDone()) this.emit();
      });
    }
    this.emit();
    this.lastFrame = performance.now();
    this.frameId = requestAnimationFrame(this.frame);
  }

  /** Le carte arrivano dal server dopo lo strappo: ognuna ha la sua texture, con la copertina che si aggiunge appena carica */
  public setCards(cards: readonly PackCard[]): void {
    this.cardData = cards;
    cards.forEach((card, rankIndex) => {
      const target = this.cards[this.options.count - 1 - rankIndex];
      if (!target) return;
      const texture = this.paint(
        (ctx) => drawCardFront(ctx, card, this.covers.get(card.comic.coverUrl) ?? null, this.options.labels, this.palette),
        PACK_TEXTURE.cardWidth,
        PACK_TEXTURE.cardHeight,
      );
      const material = target.front.material;
      material.map = texture;
      // Le carte con un'edizione speciale cambiano colore con l'angolo, come una lamina
      const rare = card.comic.editionType !== null;
      material.iridescence = rare ? 1 : 0;
      material.iridescenceIOR = 1.7;
      material.iridescenceThicknessRange = [120, 700];
      material.envMapIntensity = rare ? 0.9 : 0.5;
      material.needsUpdate = true;
      void loadImage(card.comic.coverUrl).then((cover) => {
        if (this.disposed || !cover) return;
        this.covers.set(card.comic.coverUrl, cover);
        const canvas = texture.image as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCardFront(ctx, card, cover, this.options.labels, this.palette);
        texture.needsUpdate = true;
      });
    });
  }

  /** Strappo da tastiera o da pulsante, senza trascinare */
  public tearOpen(): void {
    if (this.drag || !this.flow.tear()) return;
    this.emit();
    const from = this.tear;
    void this.tween(
      PACK_TIMING.tear,
      (t) => (this.tear = from + (PACK_TEAR.hold - from) * t),
      easeInOutCubic,
    ).then(() => this.finishTear());
  }

  public flip(): void {
    const index = this.flow.nextIndex;
    if (!this.hasCards || !this.flow.flip()) return;
    this.emit();
    const card = this.cards[index];
    const base = card.group.position.clone();
    const rare = this.isRare(index);
    this.glowFollow = card.group;
    this.glow.material.color.set(rare ? this.palette.primary300 : this.palette.primary500);
    void Promise.all([
      this.tween(
        PACK_TIMING.flip,
        (t) => {
          const lift = Math.sin(Math.PI * t);
          card.group.rotation.set(0, Math.PI * (1 - t), 0);
          card.group.position.set(base.x, base.y + 0.08 * lift, base.z + 0.9 * lift);
          card.group.scale.setScalar(PACK_LAYOUT.deckScale * (1 + 0.07 * lift));
        },
        easeInOutCubic,
      ),
      this.tween(PACK_TIMING.flip, (t) => (this.glow.material.opacity = (rare ? 0.95 : 0.4) * t), easeOutCubic),
    ]).then(() => {
      if (this.flow.shown()) this.emit();
    });
  }

  /** Mette da parte la carta girata; dopo l'ultima apre il ventaglio */
  public next(): void {
    const index = this.flow.focusIndex;
    if (index === null || !this.flow.collect()) return;
    this.emit();
    const card = this.cards[index];
    const glowFrom = this.glow.material.opacity;
    void Promise.all([
      this.moveCard(card, slotPose(index, this.options.count), PACK_TIMING.collect, easeInOutCubic, 0, 0.25),
      this.tween(0.5, (t) => (this.glow.material.opacity = glowFrom * (1 - t)), easeOutCubic),
    ]).then(() => {
      this.glowFollow = null;
      this.flow.collected();
      this.emit();
      if (this.flow.phase === 'finale') void this.finale();
    });
  }

  /** `rankIndex`: 0 è la prima in classifica */
  public inspect(rankIndex: number): void {
    const index = this.options.count - 1 - rankIndex;
    if (!this.flow.inspect(index)) return;
    this.emit();
    const card = this.cards[index];
    this.inspectBase = this.poseOf(card.group);
    this.glowFollow = card.group;
    this.glow.material.color.set(this.isRare(index) ? this.palette.primary300 : this.palette.primary500);
    void Promise.all([
      this.moveCard(card, inspectPose(), PACK_TIMING.inspect, easeOutCubic),
      this.tween(PACK_TIMING.inspect, (t) => (this.glow.material.opacity = 0.7 * t), easeOutCubic),
    ]);
  }

  public closeInspect(): void {
    const index = this.flow.focusIndex;
    const base = this.inspectBase;
    if (index === null || !base || !this.flow.closeInspect()) return;
    this.emit();
    const glowFrom = this.glow.material.opacity;
    void Promise.all([
      this.moveCard(this.cards[index], base, PACK_TIMING.inspect, easeInOutCubic),
      this.tween(0.4, (t) => (this.glow.material.opacity = glowFrom * (1 - t)), easeOutCubic),
    ]).then(() => {
      this.glowFollow = null;
    });
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.tweens.length = 0;
    this.resizeObserver.disconnect();
    const { canvas } = this.options;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('pointercancel', this.onPointerCancel);
    this.scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
    this.glow.material.dispose();
    this.textures.forEach((texture) => texture.dispose());
    this.renderer.dispose();
  }

  // ---------- Costruzione ----------

  protected createGl(canvas: HTMLCanvasElement): WebGLRenderer {
    return new WebGLRenderer({ canvas, antialias: true, alpha: true });
  }

  // La luce riflessa dalle superfici metalliche: senza, la busta sembra di plastica opaca
  protected createEnvironment(gl: WebGLRenderer): Texture | null {
    const generator = new PMREMGenerator(gl);
    const texture = generator.fromScene(new RoomEnvironment(), 0.04).texture;
    generator.dispose();
    return texture;
  }

  private paint(draw: (ctx: CanvasRenderingContext2D) => void, width: number, height: number, color = true): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) draw(ctx);
    const texture = new CanvasTexture(canvas);
    if (color) texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    this.textures.push(texture);
    return texture;
  }

  private buildPack(): void {
    const { halfHeight, tearAt } = PACK_GEOMETRY;
    const tearY = tearAt * halfHeight;
    const art = this.paint(
      (ctx) => drawPackFront(ctx, this.options.wordmark, this.options.labels, this.palette),
      PACK_TEXTURE.packWidth,
      PACK_TEXTURE.packHeight,
    );
    const bodyMask = this.paint((ctx) => drawSealMask(ctx, 'body'), PACK_TEXTURE.maskWidth, PACK_TEXTURE.maskHeight, false);
    const flapMask = this.paint((ctx) => drawSealMask(ctx, 'flap'), PACK_TEXTURE.maskWidth, PACK_TEXTURE.maskHeight, false);
    const body = this.buildSheets(-halfHeight, tearY + 0.1, art, bodyMask, this.bodyMeshes);
    const flap = this.buildSheets(tearY - 0.1, halfHeight, art, flapMask, this.flapMeshes);
    this.packGroup.add(body);
    this.hinge.position.set(PACK_GEOMETRY.halfWidth, tearY, 0);
    flap.position.set(-PACK_GEOMETRY.halfWidth, -tearY, 0);
    this.hinge.add(flap);
    this.packGroup.add(this.hinge);
    this.flapMeshes.forEach((mesh) => {
      const material = mesh.material as MeshPhysicalMaterial | MeshStandardMaterial;
      material.transparent = true;
      this.flapMaterials.push(material);
    });
  }

  // Due fogli (davanti e dietro) uniti ai lati, ognuno con l'esterno stampato e l'interno scuro
  private buildSheets(y0: number, y1: number, art: CanvasTexture, mask: CanvasTexture, into: Mesh[]): Group {
    const group = new Group();
    const front = this.sheetGeometry(y0, y1, 1);
    const back = this.sheetGeometry(y0, y1, -1);
    const outer = (side: typeof FrontSide | typeof BackSide) =>
      new MeshPhysicalMaterial({
        map: art,
        alphaMap: mask,
        alphaTest: 0.5,
        side,
        metalness: 0.7,
        roughness: 0.3,
        clearcoat: 0.7,
        clearcoatRoughness: 0.18,
        envMapIntensity: 1.25,
        emissive: 0xffffff,
        emissiveMap: art,
        emissiveIntensity: 0.45,
      });
    const inner = (side: typeof FrontSide | typeof BackSide) =>
      new MeshStandardMaterial({
        color: this.palette.primary950,
        alphaMap: mask,
        alphaTest: 0.5,
        side,
        metalness: 0.3,
        roughness: 0.6,
      });
    [
      new Mesh(front, outer(FrontSide)),
      new Mesh(front, inner(BackSide)),
      new Mesh(back, outer(BackSide)),
      new Mesh(back, inner(FrontSide)),
    ].forEach((mesh) => {
      group.add(mesh);
      into.push(mesh);
    });
    return group;
  }

  private sheetGeometry(y0: number, y1: number, side: 1 | -1): PlaneGeometry {
    const { halfWidth, halfHeight, segmentsX, segmentsY } = PACK_GEOMETRY;
    const height = y1 - y0;
    const geometry = new PlaneGeometry(
      halfWidth * 2,
      height,
      segmentsX,
      Math.max(8, Math.round((segmentsY * height) / (halfHeight * 2))),
    );
    const positions = geometry.attributes['position'];
    const uvs = geometry.attributes['uv'];
    const centerY = (y0 + y1) / 2;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i) + centerY;
      positions.setY(i, y);
      positions.setZ(i, side * packSurfaceZ(x, y));
      uvs.setXY(i, (x + halfWidth) / (2 * halfWidth), (y + halfHeight) / (2 * halfHeight));
    }
    geometry.computeVertexNormals();
    return geometry;
  }

  private buildCards(): void {
    const mask = this.paint(
      (ctx) => drawRoundedMask(ctx, PACK_TEXTURE.cardWidth / 2, PACK_TEXTURE.cardHeight / 2),
      PACK_TEXTURE.cardWidth / 2,
      PACK_TEXTURE.cardHeight / 2,
      false,
    );
    const back = this.paint((ctx) => drawCardBack(ctx, this.options.logo, this.palette), PACK_TEXTURE.cardWidth, PACK_TEXTURE.cardHeight);
    const geometry = new PlaneGeometry(PACK_GEOMETRY.cardWidth, PACK_GEOMETRY.cardHeight);
    for (let revealIndex = 0; revealIndex < this.options.count; revealIndex++) {
      const frontMaterial = new MeshPhysicalMaterial({
        alphaMap: mask,
        alphaTest: 0.5,
        side: DoubleSide,
        metalness: 0.1,
        roughness: 0.6,
        clearcoat: 0.15,
        clearcoatRoughness: 0.35,
        envMapIntensity: 0.5,
      });
      const backMaterial = new MeshPhysicalMaterial({
        map: back,
        alphaMap: mask,
        alphaTest: 0.5,
        metalness: 0.2,
        roughness: 0.5,
        clearcoat: 0.25,
        envMapIntensity: 0.6,
      });
      const front = new Mesh(geometry, frontMaterial);
      const backFace = new Mesh(geometry, backMaterial);
      backFace.rotation.y = Math.PI;
      const group = new Group();
      group.add(front, backFace);
      this.scene.add(group);
      this.cards.push({ group, front, revealIndex, inPack: this.options.mode === 'open' });
    }
  }

  private buildGlow(): Sprite {
    const texture = this.paint(drawGlow, PACK_TEXTURE.glowSize, PACK_TEXTURE.glowSize, false);
    const sprite = new Sprite(
      new SpriteMaterial({
        map: texture,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        opacity: 0,
      }),
    );
    sprite.scale.set(5.2, 5.2, 1);
    this.scene.add(sprite);
    return sprite;
  }

  // ---------- Animazione ----------

  private tween(duration: number, apply: (progress: number) => void, easing: Easing = easeOutCubic, delay = 0): Promise<void> {
    return new Promise((resolve) => {
      this.tweens.push({ elapsed: -delay, duration, easing, apply, done: resolve });
    });
  }

  private advance(dt: number): void {
    for (const tween of this.tweens.slice()) {
      tween.elapsed += dt;
      if (tween.elapsed < 0) continue;
      const progress = clamp01(tween.elapsed / tween.duration);
      tween.apply(tween.easing(progress));
      if (progress >= 1) {
        this.tweens.splice(this.tweens.indexOf(tween), 1);
        tween.done();
      }
    }
  }

  private frame = (now: number): void => {
    if (this.disposed) return;
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.clock += dt;
    this.advance(dt);
    this.followDrag();
    this.update();
    this.lookX += (this.targetX - this.lookX) * 0.06;
    this.lookY += (this.targetY - this.lookY) * 0.06;
    this.camera.position.set(this.lookX, 0.5 - this.lookY, this.distance);
    this.camera.lookAt(0, 0.5, 0);
    this.key.position.x = 2 + this.lookX * 3;
    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.frame);
  };

  private update(): void {
    this.applyPose(
      this.packGroup,
      packPose({ intro: this.intro, tear: this.tear, leave: this.leave, clock: this.clock }),
    );
    this.packGroup.updateMatrixWorld(true);
    const { pose, opacity } = flapPose(this.tear);
    this.applyPose(this.hinge, pose);
    this.flapMaterials.forEach((material) => (material.opacity = opacity));
    this.hinge.visible = opacity > 0;
    for (const card of this.cards) {
      if (!card.inPack) continue;
      const stacked = stackedCardPose(card.revealIndex, this.options.count, this.rise);
      this.matrix
        .compose(
          this.position.set(stacked.x, stacked.y, stacked.z),
          this.rotation.setFromEuler(new Euler(stacked.rotX, stacked.rotY, stacked.rotZ)),
          this.scale.set(1, 1, 1),
        )
        .premultiply(this.packGroup.matrixWorld);
      this.matrix.decompose(card.group.position, card.group.quaternion, card.group.scale);
    }
    if (this.glowFollow) {
      const { x, y, z } = this.glowFollow.position;
      this.glow.position.set(x, y, z - 0.1);
    }
  }

  private applyPose(object: Object3D, pose: PackPose): void {
    object.position.set(pose.x, pose.y, pose.z);
    object.rotation.set(pose.rotX, pose.rotY, pose.rotZ);
    object.scale.setScalar(pose.scale);
  }

  private poseOf(object: Object3D): PackPose {
    const euler = new Euler().setFromQuaternion(object.quaternion);
    return {
      x: object.position.x,
      y: object.position.y,
      z: object.position.z,
      rotX: euler.x,
      rotY: euler.y,
      rotZ: euler.z,
      scale: object.scale.x,
    };
  }

  private moveCard(card: CardObject, target: PackPose, duration: number, easing: Easing, delay = 0, arc = 0): Promise<void> {
    const group = card.group;
    const fromPosition = group.position.clone();
    const fromRotation = group.quaternion.clone();
    const fromScale = group.scale.x;
    const toPosition = new Vector3(target.x, target.y, target.z);
    const toRotation = new Quaternion().setFromEuler(new Euler(target.rotX, target.rotY, target.rotZ));
    return this.tween(
      duration,
      (t) => {
        group.position.lerpVectors(fromPosition, toPosition, t);
        group.position.y += Math.sin(Math.PI * t) * arc;
        group.quaternion.copy(fromRotation).slerp(toRotation, t);
        group.scale.setScalar(fromScale + (target.scale - fromScale) * t);
      },
      easing,
      delay,
    );
  }

  /** Una carta è rara se ha un'edizione speciale; senza i dati dal server nessuna lo è */
  private isRare(revealIndex: number): boolean {
    return !!this.cardData[this.options.count - 1 - revealIndex]?.comic.editionType;
  }

  // ---------- Rito ----------

  private async finishTear(): Promise<void> {
    const from = this.tear;
    await this.tween(
      PACK_TIMING.tearFinish * (1 + (1 - from)),
      (t) => (this.tear = from + (1 - from) * t),
      easeOutCubic,
    );
    if (!this.flow.tearDone()) return;
    this.emit();
    this.options.onTearComplete();
    await this.tween(PACK_TIMING.tearPause, () => {}, easeLinear);
    await this.tween(PACK_TIMING.rise, (t) => (this.rise = t), easeInOutCubic);
    this.cards.forEach((card) => (card.inPack = false));
    await Promise.all([
      ...this.cards.map((card) =>
        this.moveCard(card, deckPose(card.revealIndex, this.options.count), PACK_TIMING.toDeck, easeInOutCubic),
      ),
      this.tween(PACK_TIMING.leave, (t) => (this.leave = t), easeInCubic),
    ]);
    if (this.flow.deckReady()) this.emit();
  }

  private async finale(): Promise<void> {
    await Promise.all(
      this.cards.map((card) =>
        this.moveCard(
          card,
          fanPose(card.revealIndex, this.options.count, this.fit),
          PACK_TIMING.finale,
          easeInOutCubic,
          card.revealIndex * PACK_TIMING.finaleStagger,
        ),
      ),
    );
    if (this.flow.finaleDone()) this.emit();
  }

  private emit(): void {
    const state = this.flow.snapshot();
    this.options.onState({
      ...state,
      focus: state.focus === null ? null : this.options.count - 1 - state.focus,
    });
  }

  // ---------- Puntatore ----------

  private resize(): void {
    const { canvas } = this.options;
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    const view = cameraFit(width / height);
    this.distance = view.distance;
    this.fit = view.fit;
    this.camera.updateProjectionMatrix();
  }

  private ndc(event: PointerEvent): void {
    const rect = this.options.canvas.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    // Le matrici si aggiornano a ogni fotogramma, ma il tocco può arrivare tra un fotogramma e l'altro
    this.scene.updateMatrixWorld();
    this.camera.updateMatrixWorld();
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  private hitsPackTop(event: PointerEvent): boolean {
    this.ndc(event);
    const hit = this.raycaster.intersectObjects([...this.bodyMeshes, ...this.flapMeshes], false)[0];
    return !!hit && this.packGroup.worldToLocal(hit.point.clone()).y > 0.2;
  }

  private packWidthPx(): number {
    const { halfWidth } = PACK_GEOMETRY;
    const left = new Vector3(-halfWidth, 0, 0).applyMatrix4(this.packGroup.matrixWorld).project(this.camera);
    const right = new Vector3(halfWidth, 0, 0).applyMatrix4(this.packGroup.matrixWorld).project(this.camera);
    return (Math.abs(right.x - left.x) / 2) * this.options.canvas.clientWidth;
  }

  private followDrag(): void {
    if (!this.drag || this.flow.phase !== 'closed') return;
    this.tear += (tearFromDrag(this.drag.progress) - this.tear) * 0.4;
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (this.flow.phase === 'closed' && this.hitsPackTop(event)) {
      this.drag = { startX: event.clientX, width: this.packWidthPx() * PACK_TEAR.threshold, progress: 0 };
      this.options.canvas.setPointerCapture(event.pointerId);
      return;
    }
    this.tapStart = { x: event.clientX, y: event.clientY };
  };

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.options.canvas.getBoundingClientRect();
    this.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.2;
    this.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.8;
    if (this.drag) {
      this.drag.progress = clamp01((event.clientX - this.drag.startX) / this.drag.width);
    }
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (this.drag) {
      const progress = this.drag.progress;
      this.drag = null;
      if (progress >= PACK_TEAR.threshold && this.flow.tear()) {
        this.emit();
        void this.finishTear();
      } else {
        const from = this.tear;
        void this.tween(0.45, (t) => (this.tear = from * (1 - t)), easeOutBack);
      }
      return;
    }
    const start = this.tapStart;
    this.tapStart = null;
    if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) return;
    this.onTap(event);
  };

  private onPointerCancel = (): void => {
    if (!this.drag) return;
    this.drag = null;
    const from = this.tear;
    void this.tween(0.45, (t) => (this.tear = from * (1 - t)), easeOutBack);
  };

  private onTap(event: PointerEvent): void {
    switch (this.flow.phase) {
      case 'deck':
        this.flip();
        break;
      case 'shown':
        this.next();
        break;
      case 'inspecting':
        this.closeInspect();
        break;
      case 'collection': {
        this.ndc(event);
        const hit = this.raycaster.intersectObjects(
          this.cards.map((card) => card.group),
          true,
        )[0];
        const card = this.cards.find((c) => hit && c.group === hit.object.parent);
        if (card) this.inspect(this.options.count - 1 - card.revealIndex);
        break;
      }
    }
  }
}
