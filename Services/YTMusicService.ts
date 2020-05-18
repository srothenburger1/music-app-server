import { MyActivity } from '../Interfaces/Models/IMyActivity';

export function sortYTData(payload) {
	const { id, file, year } = payload;

	let parsedFile;

	// convert file to json object
	try {
		parsedFile = JSON.parse(file);
	} catch (error) {
		console.log('Error Creating Object');
	}
	//

	const sortedData = sortRawData(parsedFile, year);

	const uniqueLists = sortInfo(sortedData);

	const artistCount = countArtists(sortedData);

	const titleCount = countTitles(sortedData);

	const activity: MyActivity = {
		totalTitles: uniqueLists.uniqueTitles.length.toString(),
		totalArtists: uniqueLists.uniqueArtists.length.toString(),

		titleCount: countTitles(sortedData),
		artistCount: countArtists(sortedData),

		artistsSorted: sortArtists(artistCount),
		titlesSorted: sortTitles(titleCount),
	};

	return activity;
}

const sortRawData = (musicObject, year) => {
	const yearVar: string = year.toString();
	let sortedData: Array<{ title: string; artist: string }> = new Array();
	musicObject.forEach((element) => {
		if (element.hasOwnProperty('title')) {
			// Filter out any youtube music watch activitys and not videos
			if (
				element.header === 'YouTube Music' &&
				JSON.stringify(element.title).includes('Watched ') &&
				!JSON.stringify(element.title).includes('https://') &&
				element.time.includes(yearVar.toString())
			) {
				// for some reason there is activity with the title of a url
				sortedData.push({
					title: JSON.stringify(element.title).slice(9, -1),
					// filter out any cases where the artist name contains ' - Topic'
					artist: JSON.stringify(element.subtitles[0].name).includes(' - Topic')
						? element.subtitles[0].name.slice(0, -8)
						: element.subtitles[0].name, //element.subtitles[0].name,
				});
			}
		}
	});
	return sortedData;
};

const sortInfo = (sortedData) => {
	let returnData = {
		uniqueArtists: [],
		uniqueTitles: [],
	};
	sortedData.forEach((item) => {
		if (!returnData.uniqueArtists.includes(item.artist)) {
			returnData.uniqueArtists.push(item.artist);
		}
		if (!returnData.uniqueTitles.find(({ title }) => title === item.title)) {
			returnData.uniqueTitles.push({ title: item.title, artist: item.artist });
		}
	});
	return returnData;
};

const countArtists = (sortedData) => {
	let artistCount = {};
	sortedData.forEach((item) => {
		artistCount[`${item.artist} `] = !artistCount.hasOwnProperty(
			`${item.artist} `
		)
			? 1
			: artistCount[`${item.artist} `] + 1;
	});
	return artistCount;
};

const sortArtists = (artistCount) => {
	let sortable = [];
	for (let item in artistCount) {
		sortable.push([item, artistCount[item]]);
	}

	sortable.sort((a, b) => {
		return b[1] - a[1];
	});
	sortable.length = sortable.length > 25 ? 25 : sortable.length;
	return sortable;
};

const countTitles = (sortedData) => {
	let titleCount = {};
	sortedData.forEach((item) => {
		if (!titleCount.hasOwnProperty(`${item.title} `)) {
			titleCount[`${item.title} `] = [`${item.artist} `, 1];
		} else {
			titleCount[`${item.title} `][1] += 1;
		}
	});
	return titleCount;
};

const sortTitles = (titleCount) => {
	let sortable = [];
	for (let item in titleCount) {
		sortable.push([item, titleCount[item][0], titleCount[item][1]]);
	}

	sortable.sort((a, b) => {
		return b[2] - a[2];
	});
	sortable.length = sortable.length > 25 ? 25 : sortable.length;
	return sortable;
};
