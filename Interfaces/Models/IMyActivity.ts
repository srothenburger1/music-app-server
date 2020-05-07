interface MyActivity {

	readonly totalTitles: string;
	readonly totalArtists: string;

	readonly titleCount: object;
	readonly artistCount: object;

	readonly artistsSorted: Array<[string,number]>;
	readonly titlesSorted: Array<[string,string,number]>;
}

export {MyActivity};