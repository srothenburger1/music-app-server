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

const countUniqueItems = (sortedActivity, year) => {
	const uniqueTitles: any = [];
	const uniqueArtists: any = [];

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
