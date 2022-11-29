import { useRef } from 'react';

const globalEvents: { [key: string]: {
    callbacks: {
        id: number,
        callback: (args?: any) => void
    }[]
} } = {};
let eventCount = 0;

const createEventHandler = <T>(id: string, callback: (args?: T) => void) => {
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
	const globalEventsRef = useRef(globalEvents);

	return {
		listen: (callback: (data?: T) => void) => {
			return createEventHandler(id, callback);
		},
		send: (args?: T) => {
			const event = globalEventsRef.current[id];
			if (!event) return;
			event.callbacks.forEach((x) => x.callback(args));
		}
	};
};