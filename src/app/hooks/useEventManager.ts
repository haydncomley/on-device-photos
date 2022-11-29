import { useCallback, useEffect } from 'react';

const globalEvents: { [key: string]: {
    callbacks: {
        id: number,
        callback: <T>(args?: T) => void
    }[]
} } = {};
let eventCount = 0;

const createEventHandler = (id: string, callback: <T>(args?: T) => void) => {
	if (!globalEvents[id]) {
		globalEvents[id] = {
			callbacks: []
		};
	}

	const handlerID = eventCount++;

	const handler = {
		callback,
		id: handlerID,
	};

	globalEvents[id].callbacks.push(handler);

	return () => {
		globalEvents[id].callbacks.splice(globalEvents[id].callbacks.findIndex((x) => x.id === handlerID), 1);
	};
};

export const useEventManager = <T>(id: string) => {
	const globalEventsRef = globalEvents;

	return {
		listen: (callback: <T>(data?: T) => void) => {
			return createEventHandler(id, callback);
		},
		send: (args?: T) => {
			const event = globalEventsRef[id];
			if (!event) return;
			event.callbacks.forEach((x) => x.callback(args));
		}
	};
};

export const useEventListener = <T>(id: string, callback: <T>(value?: T) => void, deps: React.DependencyList) => {
	const listener = useEventManager<T>(id);
	const eventCallback = useCallback(<T>(value?: T) => callback(value), deps);

	useEffect(() => {
		const listenDispose = listener.listen(<T>(value?: T) => {
			eventCallback(value);
		});

		return () => {
			listenDispose();
		};
	}, [eventCallback]);
};