import { reducerWithInitialState } from "typescript-fsa-reducers";
import { setImages, getImages, SpeakerdeckImages } from "@www/actions/blogs/speakerdeck/images";

export type SpeakerdeckImagesData<T> = {
  data: T;
  loading?: boolean;
  error: null | Error;
};

export type SpeakerdeckImagesState = {
  images: SpeakerdeckImagesData<SpeakerdeckImages>;
};

const initialState: SpeakerdeckImagesState = {
  images: { data: { images: [] }, loading: false, error: null },
};

export const speakerdeckImagesReducer = reducerWithInitialState(initialState)
  .case(getImages.async.started, state => {
    return {
      ...state,
      images: {
        ...state.images,
        data: { images: [] },
        loading: true,
        error: null,
      },
    };
  })
  .case(getImages.async.done, (state, payload) => {
    return {
      ...state,
      images: {
        ...state.images,
        data: {
          ...state.images.data,
          images: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  })
  .case(getImages.async.failed, (state, payload) => {
    return {
      ...state,
      images: {
        ...state.images,
        data: { images: [] },
        loading: false,
        error: payload.error,
      },
    };
  })
  .case(setImages.async.done, (state, payload) => {
    return {
      ...state,
      images: {
        ...state.images,
        data: {
          ...state.images.data,
          images: payload.result,
        },
        loading: false,
        error: null,
      },
    };
  });
