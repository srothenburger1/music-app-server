type Props = {
	file: string;
	year: number;
};

export const sortYTData = ({ file, year }: Props) => {
	let parsedFile: any;

	// convert file to json object
	try {
		parsedFile = JSON.parse(file);
	} catch (error) {
		console.log('Error Creating Object');
	}

	return countUniqueItems(parsedFile, year);
};
const getArtistName = (value) => {
	let returnName = value.subtitles[0].name;

	if (returnName.includes('Topic')) {
		returnName = returnName.slice(0, -8);
	}
	if (returnName.includes('VEVO') || returnName.includes('Vevo')) {
		returnName = returnName.slice(0, -4);
		if (returnName.includes('Official')) {
			returnName = returnName.slice(0, -8);
		}
	}

	return returnName;
};

const countUniqueItems = (parsedFile, year) => {
	const sortedActivity = parsedFile.reduce(
		(acc, val) => {
			if (
				!val.header.includes('YouTube Music') ||
				!val.title.includes('Watched ') ||
				!val.subtitles ||
				!val.time.includes(year.toString())
			) {
				return acc;
			}

			// slice the Watched - off the title
			const title = val.title.slice(8);
			const artist = getArtistName(val);

			// titles
			if (!acc.uniqueTitles.find((item) => item.title === title)) {
				acc.uniqueTitles.push({
					title,
					artist,
					numberOfListens: 1,
				});
			} else {
				const selectedTitle = acc.uniqueTitles.find(
					(item) => item.title === title
				);
				selectedTitle.numberOfListens += 1;
			}

			// artists
			if (
				val.subtitles &&
				!acc.uniqueArtists.find((item) => item.artist === artist)
			) {
				acc.uniqueArtists.push({
					artist,
					numberOfListens: 1,
				});
			} else {
				const selectedArtist = acc.uniqueArtists.find(
					(item) => item.artist === artist
				);
				selectedArtist.numberOfListens += 1;
			}
			return acc;
		},
		{
			uniqueTitles: [],
			uniqueArtists: [],
		}
	);

	const { uniqueArtists, uniqueTitles } = sortedActivity;

	// sort
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
