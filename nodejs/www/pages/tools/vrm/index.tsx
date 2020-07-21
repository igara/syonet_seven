import { WrapperComponent } from "@www/components/wrapper";
import vrmStyle from "@www/styles/tools/vrm.module.css";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import * as THREE from "three";
import { VRM, VRMUtils, VRMSchema } from "@pixiv/three-vrm";
import * as facemesh from "@tensorflow-models/facemesh";
import { SelectComponent } from "@www/components/common/input/select";
import { createOGPImage } from "@www/libs/ogp_image";

const ogp = {
  title: "VRM Reader",
  path: "ogp/tools/vrm",
};

const estimatePose = (annotations: any) => {
  const faces = annotations.silhouette;
  const x1 = new THREE.Vector3().fromArray(faces[9]);
  const x2 = new THREE.Vector3().fromArray(faces[27]);
  const y1 = new THREE.Vector3().fromArray(faces[18]);
  const y2 = new THREE.Vector3().fromArray(faces[0]);
  const xaxis = x2.sub(x1).normalize();
  const yaxis = y2.sub(y1).normalize();
  const zaxis = new THREE.Vector3().crossVectors(xaxis, yaxis);
  const mat = new THREE.Matrix4()
    .makeBasis(xaxis, yaxis, zaxis)
    .premultiply(new THREE.Matrix4().makeRotationZ(Math.PI));
  return new THREE.Quaternion().setFromRotationMatrix(mat);
};

const execFacemesh = async (videoElement: HTMLVideoElement, clock: THREE.Clock, vrm: VRM, model: facemesh.FaceMesh) => {
  if (!vrm || !vrm.humanoid || !vrm.blendShapeProxy) return;

  vrm.update(clock.getDelta());
  const faces = await model.estimateFaces(videoElement, false, false);

  faces.forEach(face => {
    if (!(face.scaledMesh instanceof Array)) return;
    if (!vrm || !vrm.humanoid || !vrm.blendShapeProxy) return;

    // @ts-ignore
    const annotations = face.annotations;
    const q = estimatePose(annotations);
    const head = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Head);
    if (!head) return;
    if (!clock) return;

    head.quaternion.slerp(q, 0.1);
    const blink = Math.max(0.0, 1.0 - 10.0 * Math.abs((clock.getElapsedTime() % 4.0) - 2.0));
    vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Blink, blink);
    const lipsLowerInner = annotations.lipsLowerInner[5];
    const lipsUpperInner = annotations.lipsUpperInner[5];
    const expressionA = Math.max(0, Math.min(1, (lipsLowerInner[1] - lipsUpperInner[1]) / 10.0));
    vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.A, expressionA);
  });
};

const vrmLoad = async (divElement: HTMLDivElement, videoElement: HTMLVideoElement) => {
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls");

  const width = 320;
  const height = 240;

  // renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  divElement.appendChild(renderer.domElement);

  // camera
  const camera = new THREE.PerspectiveCamera(30.0, width / height, 0.1, 20.0);
  camera.position.set(0.0, 1.5, 1.0);

  // camera controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.screenSpacePanning = true;
  controls.target.set(0.0, 1.5, 0.0);
  controls.update();

  // scene
  const scene = new THREE.Scene();

  // light
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1.0, 1.0, 1.0).normalize();
  scene.add(light);

  // gltf and vrm
  const loader = new GLTFLoader();
  loader.crossOrigin = "anonymous";
  let currentVRM: VRM;
  const model = await facemesh.load({ maxFaces: 1 });

  const load = (url: string) =>
    loader.load(
      url,
      gltf => {
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        VRM.from(gltf).then(vrm => {
          if (currentVRM) {
            scene.remove(currentVRM.scene);
            currentVRM.dispose();
          }

          currentVRM = vrm;
          scene.add(vrm.scene);

          if (!vrm.humanoid) return;
          const hipBoneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips);
          if (hipBoneNode) hipBoneNode.rotation.y = Math.PI;

          const leftUpperArmBoneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm);
          if (leftUpperArmBoneNode) leftUpperArmBoneNode.rotation.z = 1;

          const rightUpperArmBoneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm);
          if (rightUpperArmBoneNode) rightUpperArmBoneNode.rotation.z = -1;

          const clock = new THREE.Clock();
          clock.start();

          const animate = async () => {
            window.requestAnimationFrame(animate);

            await execFacemesh(videoElement, clock, vrm, model);
            renderer.render(scene, camera);
          };

          animate();
        });
      },

      progress => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),
      error => console.error(error),
    );

  load("/static/vrm/igarashi.vrm");

  divElement.addEventListener("dragover", event => {
    event.preventDefault();
  });

  divElement.addEventListener("drop", event => {
    event.preventDefault();

    if (!event.dataTransfer) return;

    const files = event.dataTransfer.files;
    if (!files) return;

    const file = files[0];
    if (!file) return;

    const blob = new Blob([file], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    load(url);
  });
};

type Props = AppState;

const ToolsVRMPageComponent = (props: Props) => {
  const [state, setState] = useState(props);
  const dispatch = useDispatch();
  const store = useStore();
  const [loadCheckAuth] = useLazyQuery<CheckAuth>(CHECK_AUTH, {
    onCompleted: async checkAuth => {
      if (!checkAuth.checkAuth) {
        await db.access_tokens.clear();
      } else {
        await dispatch(authActions.checkAuth(checkAuth.checkAuth));
        setState(store.getState());
      }
    },
  });

  const vrmBackgroundColors = [
    { name: "緑", value: "greenyellow" },
    { name: "青", value: "blue" },
    { name: "白", value: "white" },
  ];
  const [vrmBackgroundColor, setVRMBackgroundColor] = useState(vrmBackgroundColors[0].value);

  const vrmElementRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (process.browser) {
      (async () => {
        if (!videoElementRef.current) return;
        if (!vrmElementRef.current) return;

        const videoElement = videoElementRef.current;

        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        videoElement.srcObject = userMedia;

        videoElement.onloadedmetadata = async () => {
          await videoElement.play();
        };

        const vrmElement = vrmElementRef.current;
        await vrmLoad(vrmElement, videoElement);

        await loadCheckAuth();
        setState(store.getState());
      })();
    }
  }, []);

  const description = "VRMの読み込みをおこなう";

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${encodeURI(ogp.title)}.png`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent {...state}>
        <h2>{ogp.title}</h2>
        <div>{description}</div>
        <div ref={vrmElementRef} style={{ background: vrmBackgroundColor }} className={vrmStyle.vrm} />
        <video ref={videoElementRef} controls={true} autoPlay={true} playsInline={true} className={vrmStyle.video} />
        <div>
          背景色変更
          <SelectComponent
            OnChangeHandler={(e: ChangeEvent<HTMLSelectElement>) => {
              setVRMBackgroundColor(e.target.value);
            }}
          >
            {vrmBackgroundColors.map(backgroundColor => (
              <option key={backgroundColor.value} value={backgroundColor.value}>
                {backgroundColor.name}
              </option>
            ))}
          </SelectComponent>
        </div>
      </WrapperComponent>
    </>
  );
};

ToolsVRMPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();

  if (context.isServer) {
    await createOGPImage({
      path: ogp.path,
      title: ogp.title,
    });
  }

  return { ...state };
};

export default ToolsVRMPageComponent;
