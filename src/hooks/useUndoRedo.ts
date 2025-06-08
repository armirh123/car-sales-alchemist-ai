
import { useState, useCallback } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialValue: T) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialValue,
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;

    setState(currentState => {
      const { past, present, future } = currentState;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    setState(currentState => {
      const { past, present, future } = currentState;
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    });
  }, [canRedo]);

  const set = useCallback((newValue: T) => {
    setState(currentState => ({
      past: [...currentState.past, currentState.present],
      present: newValue,
      future: []
    }));
  }, []);

  const reset = useCallback((newValue: T) => {
    setState({
      past: [],
      present: newValue,
      future: []
    });
  }, []);

  return {
    state: state.present,
    set,
    reset,
    undo,
    redo,
    canUndo,
    canRedo
  };
}
