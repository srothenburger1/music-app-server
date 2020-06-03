export interface UserActivities {
	readonly artistCount: number;
	readonly songCount: number;
	readonly songs: [
		{
			title: string;
			artist: string;
			numberOfListens: number;
		}
	];
	readonly artists: [
		{
			artist: string;
			numberOfListens: number;
		}
	];
}
