module.exports.selectedSocialMedias = socialMedias => {

	const empty = socialMedias.every(link => link === '');

	if (!empty) {
			
		const socialMediasFilter = [];

		socialMedias.forEach((link, index) => {
			
			let newLink = {};

			switch (index) {

				case 0: newLink = link !== '' ? {title: 'Sitio Web', link} : {}; break;

				case 1:
					newLink = link !== ''
					? {title: 'Twitter', link: `http://twitter.com/${link}`} : {};
				break;

				case 2:
					newLink = link !== ''
					? {title: 'Facebook', link: `http://www.facebook.com/${link}`} : {};
				break;

				case 3: newLink = link !== ''
					? {title: 'Instagram', link: `https://www.instagram.com/${link}`} : {};
				break;

				case 4: newLink = link !== ''
					? {title: 'Youtube', link: `http://www.youtube.com/${link}`} : {};
				break;
			}
			
			Object.keys(newLink).length !== 0 ? socialMediasFilter.push(newLink) : '';
		});
		
		return socialMediasFilter;
	}

	return [];
}