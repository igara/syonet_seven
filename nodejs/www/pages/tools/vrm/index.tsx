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
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  divElementRef.current.appendChild(renderer.domElement);

  // camera
  const camera = new THREE.PerspectiveCamera(30.0, width / height, 0.1, 20.0);
  camera.position.set(0.0, 1.0, 5.0);

  // camera controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.screenSpacePanning = true;
  controls.target.set(0.0, 1.0, 0.0);
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
  loader.load(
    // URL of the VRM you want to load
    "/static/vrm/igarashi.vrm",

    // called when the resource is loaded
    gltf => {
      // calling this function greatly improves the performance
      VRMUtils.removeUnnecessaryJoints(gltf.scene);

      // generate VRM instance from gltf
      VRM.from(gltf).then(vrm => {
        console.log(vrm);
        scene.add(vrm.scene);

        if (vrm.humanoid) {
          const boneNode = vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips);
          if (boneNode) boneNode.rotation.y = Math.PI;
        }
      });
    },

    // called while loading is progressing
    progress => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),

    // called when loading has errors
    error => console.error(error),
  );

  const animate = () => {
    window.requestAnimationFrame(animate);

    renderer.render(scene, camera);
  };

  animate();
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
        <div ref={vrmElementRef} />
      </WrapperComponent>
    </>
  );
};

ToolsVRMPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  const state: AppState = context.store.getState();
  return { ...state };
};

export default ToolsVRMPageComponent;
