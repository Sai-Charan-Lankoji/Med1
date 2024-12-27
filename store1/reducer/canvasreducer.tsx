import { fabric } from "fabric";
import { combineReducers } from "redux";
import {
  AddCircle,
  AddRectFunc,
  AddText,
  AddTriangle,
  AddSvg,
  randomId,
} from "../shared/draw";
import { clearStackFromDB, saveStackToDB } from "@/utils/indexedDButils";

interface CanvasState {
  canvas: fabric.Canvas | undefined;
  color: string;
  undoStack: any[];
  redoStack: any[];
  pauseSaving: boolean;
  initialState: any;
}

const initialState: CanvasState = {
  canvas: undefined,
  color: "#ff0000",
  undoStack: [],
  redoStack: [],
  pauseSaving: false,
  initialState: null,
};

function setReducer(state: CanvasState = initialState, action: any) {
  switch (action.type) {
    case "INIT": {
      const initialState = action.canvas?.toJSON();
      return {
        ...state,
        canvas: action.canvas,
        initialState,
        undoStack: [initialState],
        redoStack: [],
      };
    }
    case "REINIT": {
      return { ...state, canvas: action.canvas };
    }
    case "RESTORE_DESIGN": {
      if (!state.canvas) return state;
      if (action.payload != null) {
        state.canvas.loadFromJSON(action.payload, () => {
          state.canvas?.renderAll();
        });
      }
      state.undoStack = [];
      state.redoStack = [];
      return state;
    }

    case "ADD_SVG_TO_CANVAS": {
      if (!state.canvas) {
        return state;
      }
      AddSvg(state.canvas, action.payload.url, action.payload.id);
      if (!state.pauseSaving)
        state.undoStack = [...state.undoStack, state.canvas?.toJSON()];
      return { ...state };
    }
    case "ADD_CONTROLS": {
      if (!state.canvas) {
        return state;
      }
      AddSvg(state.canvas, action.payload.url, randomId() + "");
      return { ...state };
    }
    case "CURSOR": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.isDrawingMode = false;
      return { ...state };
    }
    case "SHAPE": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.isDrawingMode = false;
      switch (action.shape) {
        case "RECT":
          AddRectFunc(state.canvas, action.stroke, action.fillcolor);
          break;
        case "TRIANGLE":
          AddTriangle(state.canvas, action.stroke, action.fillcolor);
          break;
        case "CIRCLE":
          AddCircle(state.canvas, action.stroke, action.fillcolor);
          break;
        default:
          break;
      }
      if (!state.pauseSaving) state.undoStack.push(state.canvas?.toJSON());
      return { ...state };
    }
    case "PROPS": {
      if (!state.canvas) {
        return state;
      }
      switch (action.props) {
        case "fontSize":
          if (state.canvas.getActiveObject() != null) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("fontSize", action.value);
            state.canvas.renderAll();
          }
          break;
        case "fontFamily": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("fontFamily", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "fontWeight": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("fontWeight", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "fontStyle": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("fontStyle", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "underline": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("underline", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "linethrough": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("linethrough", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "overline": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("overline", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "fillcolor": {
          if (state.canvas.getActiveObject()) {
            state.canvas.getActiveObject()?.set("fill", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "charSpacing": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("charSpacing", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "textBackgroundColor": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas
              .getActiveObject()
              // @ts-ignore
              ?.set("textBackgroundColor", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "lineHeight": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("lineHeight", action.value);
            state.canvas.renderAll();
          }
          break;
        }
        case "textAlign": {
          if (state.canvas.getActiveObject()) {
            // @ts-ignore
            state.canvas.getActiveObject()?.set("textAlign", action.value);
            state.canvas.renderAll();
          }
          break;
        }
      }
      if (!state.pauseSaving) state.undoStack.push(state.canvas?.toJSON());
      return { ...state };
    }
    case "TEXT": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.isDrawingMode = false;
      AddText(state.canvas, action.text, action.color, action.props);
      if (!state.pauseSaving) state.undoStack.push(state.canvas?.toJSON());
      return { ...state };
    }
    case "BRUSH": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.freeDrawingBrush = new fabric.PencilBrush(state.canvas);
      state.canvas.freeDrawingBrush.width = 35;
      state.canvas.freeDrawingBrush.color = action.color;
      state.canvas.isDrawingMode = true;
      return { ...state };
    }
    case "COLOR": {
      if (!state.canvas) {
        return state;
      }
      const { color, width } = action;
      if (color) {
        state.color = color;
        state.canvas.freeDrawingBrush.color = color;
      }
      state.canvas.freeDrawingBrush.color = action.color;
      return { ...state };
    }
    case "SPRAY": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.isDrawingMode = true;
      // state.canvas.freeDrawingBrush = new fabric.SprayBrush(state.canvas);
      //state.canvas.freeDrawingBrush = new fabric.CircleBrush(state.canvas);
      state.canvas.freeDrawingBrush.color = action.color;
      state.canvas.freeDrawingBrush.width = 35;
      return { ...state };
    }
    case "ERASER": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.freeDrawingBrush = new fabric.PencilBrush(state.canvas);
      state.canvas.freeDrawingBrush.width = 20;
      state.canvas.freeDrawingBrush.color = "#ffffff";
      state.canvas.isDrawingMode = true;
      return { ...state };
    }
    case "IMAGE": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.isDrawingMode = false;
      fabric.Image.fromURL(
        action.payload,

        function (image) {
          if (!image.width) return;
          // @ts-ignore
          let scaleX = (state.canvas?.getWidth() - 20) / (image.width | 1);
          let scaleY = scaleX;
          image.set({
            left: 10,
            top: 10,
            angle: 0,
            padding: 0,
            cornerSize: 8,
            hasRotatingPoint: true,
            scaleX: scaleX,
            scaleY: scaleY,
            rotatingPointOffset: 10,
          });
          state.canvas?.add(image);
          state.canvas?.centerObject(image);
        },

        { crossOrigin: "anonymous" }
      );
      if (!state.pauseSaving) state.undoStack.push(state.canvas?.toJSON());
      return { ...state };
    }
    case "CLEAR": {
      if (!state.canvas) {
        return state;
      }
      state.canvas.isDrawingMode = false;
      var selection = state.canvas.getActiveObject();

      state.canvas.discardActiveObject();
      state.canvas.requestRenderAll();
      return { ...state };
    }
    case "DOWNLOAD": {
      if (!state.canvas) {
        return state;
      }
      const a = document.createElement("a");
      const uri = state.canvas.toDataURL({ format: "png", multiplier: 4 });
      a.href = uri;
      a.download = "Online_Drawer.png";
      a.click();
      return { ...state };
    }
    case "UPDATE_SVG_COLOR": {
      if (state.canvas) {
        const activeObj = state.canvas.getActiveObject();

        if (activeObj) {
          if (activeObj.type === "group" && "getObjects" in activeObj) {
            const groupObjects = (activeObj as fabric.Group).getObjects();
            if (groupObjects[action.payload.colorIndex]) {
              groupObjects[action.payload.colorIndex].set(
                "fill",
                action.payload.newColor
              );
            }
          } else {
            activeObj.set("fill", action.payload.newColor);
          }

          // Trigger canvas rendering and save design state
          state.canvas.renderAll();
        }
      }
      return state;
    }

    case "UPDATE_SHAPE_STROKE_COLOR": {
      state.canvas
        ?.getActiveObject()
        ?.set("stroke", action.payload.color)
        .setCoords();
      state.canvas?.renderAll();
      if (!state.pauseSaving) state.undoStack.push(state.canvas?.toJSON());
      return state;
    }
    case "UPDATE_SHAPE_FILL_COLOR": {
      state.canvas
        ?.getActiveObject()
        ?.set("fill", action.payload.color)
        .setCoords();
      state.canvas?.renderAll();
      if (!state.pauseSaving) state.undoStack.push(state.canvas?.toJSON());
      return state;
    }
    case "UPDATE_CANVAS_ACTIONS": {
      if (!state.pauseSaving) {
        state.undoStack.push(state.canvas?.toJSON());
      }
      return state;
    }
    case "RESET": {
      if (!state.canvas || !state.initialState) return state;

      state.canvas.loadFromJSON(state.initialState, () => {
        state.canvas?.renderAll();
      });

      // Clear undo and redo stacks in IndexedDB
      clearStackFromDB("undoStack");
      clearStackFromDB("redoStack");

      return {
        ...state,
        undoStack: [state.initialState],
        redoStack: [],
      };
    }

    case "UNDO": {
      console.log("Undo Stack:", state.undoStack);
      console.log("Redo Stack:", state.redoStack);

      state.pauseSaving = true;
      if (state.undoStack.length < 1) return state;

      const currentState = state.canvas?.toJSON();
      state.redoStack.push(currentState);

      const previousState = state.undoStack.pop();
      console.log("Restoring state:", previousState);

      state.canvas?.loadFromJSON(previousState, () => {
        state.canvas?.renderAll();
        console.log("Canvas restored after UNDO");
      });

      saveStackToDB("undoStack", state.undoStack);
      saveStackToDB("redoStack", state.redoStack);

      state.pauseSaving = false;
      return { ...state };
    }

    case "REDO": {
      state.pauseSaving = true;
      if (state.redoStack.length === 0) return state;

      const currentState = state.canvas?.toJSON();
      state.undoStack.push(currentState);

      const nextState = state.redoStack.pop();
      state.canvas?.loadFromJSON(nextState, () => {
        state.canvas?.renderAll();
      });

      // Save stacks to IndexedDB
      saveStackToDB("undoStack", state.undoStack);
      saveStackToDB("redoStack", state.redoStack);

      state.pauseSaving = false;
      return { ...state };
    }
    case "SET_UNDO_STACK": {
      return { ...state, undoStack: action.payload };
    }

    case "SET_REDO_STACK": {
      return { ...state, redoStack: action.payload };
    }
    default:
      return state;
  }
}

export const reducers = combineReducers({
  setReducer,
});
