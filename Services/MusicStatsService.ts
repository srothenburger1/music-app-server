// const jsonMusicFile = "../../../Desktop/Test_Data/jenna.json";
// const fs = require("fs");
import { UserActivities } from '../Interfaces/Models/IUserActivity';

export const sortMusicData = ({ file, year }) => {
	let parsedFile: UserActivities | null;

	// convert file to json object
	try {
		parsedFile = JSON.parse(file);
	} catch (error) {
		console.log('Error Creating Object');
	}

	return countUniqueItems(parsedFile, year);
};

// this function should be easy to stitched in after the JSON has been read and parsed.
const countUniqueItems = (sortedActivity, year) => {
	const uniqueTitles = [];
	const uniqueArtists = [];

	sortedActivity.forEach((activity) => {
		if (
			activity.title.includes('Listened to') &&
			activity.time.includes(year.toString())
		) {
			if (
				!uniqueTitles.find((item) => item.title === activity.title.slice(12))
			) {
				uniqueTitles.push({
					title: activity.title.slice(12),
					artist: activity.description,
					numberOfListens: 1,
				});
			} else {
				const selectedTitle = uniqueTitles.find(
					(item) => item.title === activity.title.slice(12)
				);
				selectedTitle.numberOfListens += 1;
			}

			////
			if (!uniqueArtists.find((item) => item.artist === activity.description)) {
				uniqueArtists.push({
					artist: activity.description,
					numberOfListens: 1,
				});
			} else {
				const selectedArtist = uniqueArtists.find(
					(item) => item.artist === activity.description
				);
				selectedArtist.numberOfListens += 1;
			}
		}
	});
	uniqueArtists.sort((a, b) =>
		a.numberOfListens > b.numberOfListens
			? -1
			: b.numberOfListens > a.numberOfListens
			? 1
			: 0
	);
	uniqueTitles.sort((a, b) =>
		a.numberOfListens > b.numberOfListens
			? -1
			: b.numberOfListens > a.numberOfListens
			? 1
			: 0
	);

	// This is so that the count doesnt get changed when we prune the lists
	const finalArtistCount = uniqueArtists.length;
	const finalTitleCount = uniqueTitles.length;

	// Prune data down to top 50
	uniqueArtists.length = uniqueArtists.length > 50 ? 50 : uniqueArtists.length;
	uniqueTitles.length = uniqueTitles.length > 50 ? 50 : uniqueTitles.length;

	return {
		songCount: finalTitleCount,
		artistCount: finalArtistCount,
		songs: uniqueTitles,
		artists: uniqueArtists,
	};
};

// const run = () => {
// 	const parsedMusicFile = read(jsonMusicFile);
// 	console.log(countUniqueItems(parsedMusicFile));
// };

// run();

/////////////////////////////////////////////////////////////////

// import { MyActivity } from '../Interfaces/Models/IMyActivity';

// class MusicStatsService {
// 	//#region Properties
// 	public sortedData: Array<{ title: string; artist: string }> = new Array();

// 	uniqueTitles: Array<{ title: string; artist: string }> = [];
// 	uniqueArtists: Array<{}> = [];

// 	totalTitles: string = '';
// 	totalArtists: string = '';

// 	titleCount: object = {};
// 	artistCount: object = {};

// 	artistsSorted: Array<[string, number]> = [];
// 	titlesSorted: Array<[string, string, number]> = [];
// 	//#endregion
// 	//#region Constructors
// 	constructor(
// 		jsonFile: Array<{ title: string; description: string }>,
// 		year: number
// 	) {
// 		try {
// 			this.sortRawData(jsonFile, year);
// 			this.initSort();
// 		} catch (error) {
// 			console.log('Error Sorting Data');
// 		}
// 	}
// 	//#endregion
// 	//#region Methods

// 	initSort(): void {
// 		this.sortInfo();
// 		this.countArtists();
// 		this.sortArtists();
// 		this.countTitles();
// 		this.sortTitles();
// 	}

// 	static createObj(data): MyActivity {
// 		let file: { title: string; description: string }[];
// 		try {
// 			file = JSON.parse(data.file);
// 		} catch (error) {
// 			console.log('Error Creating Object');
// 		}

// 		const statsObj = new MusicStatsService(file, data.year);

// 		const activity: MyActivity = {
// 			totalTitles: statsObj.uniqueTitles.length.toString(),
// 			totalArtists: statsObj.uniqueArtists.length.toString(),

// 			titleCount: statsObj.titleCount,
// 			artistCount: statsObj.artistCount,

// 			artistsSorted: statsObj.artistsSorted,
// 			titlesSorted: statsObj.titlesSorted,
// 		};

// 		// if there are no titles, there will be no data to display. return null
// 		if (activity.totalTitles === '0') {
// 			return null;
// 		} else {
// 			return activity;
// 		}
// 	}

// 	sortRawData(
// 		jsonFile: Array<{ title: string; description: string }>,
// 		year: number
// 	): void {
// 		const yearVar: string = year.toString();
// 		jsonFile.forEach((element) => {
// 			if (element.hasOwnProperty('title')) {
// 				if (
// 					JSON.stringify(element).includes(yearVar) &&
// 					JSON.stringify(element).includes('Listened to')
// 				) {
// 					this.sortedData.push({
// 						title: JSON.stringify(element.title).slice(13, -1),
// 						artist: element.description,
// 					});
// 				}
// 			}
// 		});
// 	}

// 	sortInfo(): void {
// 		this.sortedData.forEach((item) => {
// 			if (!this.uniqueArtists.includes(item.artist)) {
// 				this.uniqueArtists.push(item.artist);
// 			}
// 			if (!this.uniqueTitles.find(({ title }) => title === item.title)) {
// 				this.uniqueTitles.push({ title: item.title, artist: item.artist });
// 			}
// 		});
// 	}

// 	/// Counts the number of times a song shows up in the list
// 	// If it isn't already in the list it will add the item.
// 	countTitles(): void {
// 		this.sortedData.forEach((item) => {
// 			if (!this.titleCount.hasOwnProperty(`${item.title} `)) {
// 				this.titleCount[`${item.title} `] = [`${item.artist} `, 1];
// 			} else {
// 				this.titleCount[`${item.title} `][1] += 1;
// 			}
// 		});
// 	}

// 	/// Counts the number of times a artist shows up in the list
// 	// If it isn't already in the list it will add the item.
// 	countArtists(): void {
// 		this.sortedData.forEach((item) => {
// 			this.artistCount[`${item.artist} `] = !this.artistCount.hasOwnProperty(
// 				`${item.artist} `
// 			)
// 				? 1
// 				: this.artistCount[`${item.artist} `] + 1;
// 		});
// 	}

// 	sortArtists(): void {
// 		let sortable = [];
// 		for (let item in this.artistCount) {
// 			sortable.push([item, this.artistCount[item]]);
// 		}

// 		sortable.sort((a, b) => {
// 			return b[1] - a[1];
// 		});
// 		sortable.length = sortable.length > 25 ? 25 : sortable.length;
// 		this.artistsSorted = sortable;
// 	}

// 	sortTitles(): void {
// 		let sortable = [];
// 		for (let item in this.titleCount) {
// 			sortable.push([item, this.titleCount[item][0], this.titleCount[item][1]]);
// 		}

// 		sortable.sort((a, b) => {
// 			return b[2] - a[2];
// 		});
// 		sortable.length = sortable.length > 25 ? 25 : sortable.length;
// 		this.titlesSorted = sortable;
// 	}
// 	//#endregion
// }

// export default MusicStatsService;
