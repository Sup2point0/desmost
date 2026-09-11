import { beforeAll } from "vitest";


beforeAll(() => {
	global.Desmos = {
		Colors: {
			RED:    "#c74440",
			BLUE:   "#2d70b3",
			GREEN:  "#388c46",
			PURPLE: "#6042a6",
			ORANGE: "#fa7e19",
			BLACK:  "#000000",
		},
		Styles: {
			CROSS: "CROSS",
			DASHED: "DASHED",
			DOTTED: "DOTTED",
			OPEN: "OPEN",
			POINT: "POINT",
			SOLID: "SOLID",
		},
		DragModes: {
			AUTO: "AUTO",
			X: "X",
			Y: "Y",
			XY: "XY",
			NONE: "NONE",
		},
	};
});
