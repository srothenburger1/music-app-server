import { UserActivities } from '../Interfaces/Models/IUserActivity';

type Props = {
	file: string;
	year: number;
};

export const sortYTData = ({ file, year }: Props): UserActivities => {
	let parsedFile: UserActivities | null;

	// convert file to json object
	try {
		parsedFile = JSON.parse(file);
	} catch (error) {
		console.log('Error Creating Object');
	}

	return countUniqueItems(parsedFile, year);
};

const countUniqueItems = (sortedActivity, year): UserActivities => {
	const uniqueTitles: any = [];
	const uniqueArtists: any = [];

	sortedActivity.forEach((activity) => {
		if (
			activity.header.includes('YouTube Music') &&
			activity.title.includes('Watched ') &&
			activity.subtitles &&
			activity.time.includes(year.toString())
		) {
			if (
				!uniqueTitles.find((item) => item.title === activity.title.slice(8))
			) {
				uniqueTitles.push({
					title: activity.title.slice(8),
					artist: activity.subtitles[0].name.slice(0, -8),
					numberOfListens: 1,
				});
			} else {
				const selectedTitle = uniqueTitles.find(
					(item) => item.title === activity.title.slice(8)
				);
				selectedTitle.numberOfListens += 1;
			}

			// some activities dont contain a subtitle property. These are often just urls.
			if (
				activity.subtitles &&
				!uniqueArtists.find(
					(item) => item.artist === activity.subtitles[0].name.slice(0, -8)
				)
			) {
				uniqueArtists.push({
					artist: activity.subtitles[0].name.slice(0, -8),
					numberOfListens: 1,
				});
			} else {
				const selectedArtist = uniqueArtists.find(
					(item) => item.artist === activity.subtitles[0].name.slice(0, -8)
				);
				selectedArtist.numberOfListens += 1;
			}
		}
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
	});

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
