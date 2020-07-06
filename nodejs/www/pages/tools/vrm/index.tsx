import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next/app";
import { AppState } from "@www/stores";
import Head from "next/head";
import { useState, useEffect, useRef, RefObject } from "react";
import { useDispatch, useStore } from "react-redux";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import * as THREE from "three";
import { VRM, VRMUtils, VRMSchema } from "@pixiv/three-vrm";

const vrmLoad = async (divElementRef: RefObject<HTMLDivElement>) => {
  if (!divElementRef || !divElementRef.current) return;

  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls");

  const width = window.innerWidth;
  const height = window.innerHeight / 2;

  // renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  divElementRef.current.appendChild(renderer.domElement);

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
  let currentVrm: VRM;

  const load = (url: string) =>
    loader.load(
      // URL of the VRM you want to load
      url,

      // called when the resource is loaded
      gltf => {
        // calling this function greatly improves the performance
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        // generate VRM instance from gltf
        VRM.from(gltf).then(vrm => {
          if (currentVrm) {
            scene.remove(currentVrm.scene);
            currentVrm.dispose();
          }

          currentVrm = vrm;
          scene.add(vrm.scene);

          if (vrm.humanoid) {
            const hipBoneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips);
            if (hipBoneNode) hipBoneNode.rotation.y = Math.PI;

            const leftUpperArmBoneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm);
            if (leftUpperArmBoneNode) leftUpperArmBoneNode.rotation.z = 1;

            const rightUpperArmBoneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm);
            if (rightUpperArmBoneNode) rightUpperArmBoneNode.rotation.z = -1;

            const animate = () => {
              window.requestAnimationFrame(animate);

              renderer.render(scene, camera);
            };

            animate();
          }
        });
      },

      // called while loading is progressing
      progress => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),

      // called when loading has errors
      error => console.error(error),
    );

  load("/static/vrm/igarashi.vrm");

  divElementRef.current.addEventListener("dragover", event => {
    event.preventDefault();
  });

  divElementRef.current.addEventListener("drop", event => {
    console.log(123);
    event.preventDefault();

    if (!event.dataTransfer) return;
    console.log(123);
    // read given file then convert it to blob url
    const files = event.dataTransfer.files;
    if (!files) return;
    console.log(123);
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

  const vrmElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.browser) {
      (async () => {
        await vrmLoad(vrmElementRef);

        await loadCheckAuth();
        setState(store.getState());
      })();
    }
  }, []);

  const title = "VRM Reader";
  const description = "VRMの読み込みをおこなう";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/static/pages/tools/vrm/ogp.png`} />
        <meta property="og:description" content={description} />
      </Head>
      <WrapperComponent {...state}>
        <h2>{title}</h2>
        <div>{description}</div>
        <div ref={vrmElementRef} style={{ background: "greenyellow" }} />
      </WrapperComponent>
    </>
  );
};

ToolsVRMPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsVRMPageComponent;
