import { DataStream, StateElement } from "@ts/datastream";
import { AnimationCanvas, ThreeSceneRenderCanvas } from "@ts/rendercanvas";
import { Interactor, MouseButton, OrthographicCameraTrackball } from "@ts/interaction";
import { ComplexMesh } from "@ts/threejs-utils";
import { OrthographicCamera, Scene, DirectionalLight, TorusKnotGeometry } from "three";
import { ComplexMeshConfig } from "./config";

export class AppController {
  public dataStream: DataStream;
  private scene: Scene;
  private planningSurfaceMesh: ComplexMesh;
  private camera: OrthographicCamera;
  private animationCanvas: AnimationCanvas;
  private interactor: Interactor;

  constructor() {
    this.createDataStream();
    this.createInitialSceneGraph();
    this.createAnimationCanvas();
    this.createInteractor();

    this.loadPlanningSurfaceGeometry();
  }

  private createDataStream() {
    this.dataStream = new DataStream();

    this.dataStream.add(new StateElement("viewerRef"), new StateElement("viewerSize"));

    const viewerSizeState: StateElement = this.dataStream.stateStream.viewerSize;
    viewerSizeState.subscribe(({ current: viewerRect }) => {
      this.animationCanvas.renderCanvas.setSize(viewerRect.width, viewerRect.height);
      this.interactor.setSize(viewerRect.width, viewerRect.height);

      this.animationCanvas.rerender();
    });

    const viewerRefState: StateElement = this.dataStream.stateStream.viewerRef;
    viewerRefState.subscribe(({ current: viewerRef }) => {
      this.animationCanvas.renderCanvas.mountToDom(viewerRef);
      this.interactor.mountToDom(viewerRef);

      this.animationCanvas.rerender();
    });
  }

  private createInitialSceneGraph() {
    this.scene = new Scene();

    this.camera = new OrthographicCamera();
    this.camera.position.set(0, -100, 0);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 1, 0);
    this.camera.zoom = 10;

    this.scene.add(this.camera);

    const headLight = new DirectionalLight(0xffffff, 3.75);
    headLight.position.set(0, 0, 1);
    this.camera.add(headLight);
    headLight.target = this.camera;

    this.planningSurfaceMesh = new ComplexMesh(ComplexMeshConfig.PlanningSurface);
    this.scene.add(this.planningSurfaceMesh);
  }

  private createAnimationCanvas() {
    const renderCanvas = new ThreeSceneRenderCanvas({
      getCamera: () => this.camera,
      getScene: () => this.scene,
    });

    this.animationCanvas = new AnimationCanvas({
      renderCanvas,
      autoStart: true,
      justInTime: true,
    });
  }

  private createInteractor() {
    this.interactor = new Interactor();
    this.interactor.addInteractionTool(
      new OrthographicCameraTrackball({
        getCamera: () => this.camera,
        onChange: () => this.animationCanvas.rerender(),
        panMouseButton: MouseButton.RIGHT,
        rotateMouseButton: MouseButton.LEFT,
      })
    );
  }

  private async loadPlanningSurfaceGeometry() {
    const planningSurfaceGeometry = new TorusKnotGeometry(15, 3, 256, 32);
    this.planningSurfaceMesh.setGeometry(planningSurfaceGeometry, false);

    this.animationCanvas.rerender();
  }
}
