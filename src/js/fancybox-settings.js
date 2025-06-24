$(document).ready(function () {
	Fancybox.bind('[data-fancybox="video-gallery"]', {

		// Command list for Images
		Images: {
			protected: true
		},

		// Command list for Thumbnail
		Thumbs: {
			type: 'classic',
			showOnStart: true, // thumbnail bar load immediately after fancybox launches
		},

		// Command list for Toolbar
		Toolbar: {
			display: {
				left: [],
				middle: [
				],
				right: ["close"],
			},
		},
	});
});

$(document).ready(function () {
	Fancybox.bind('[data-fancybox="image-gallery"]', {

		// Command list for Images
		Images: { protected: true },

		// Command list for Thumbnail
		Thumbs: {
			type: 'modern',
			showOnStart: true,
		},

		// Command list for Toolbar
		Toolbar: {
			display: {
				left: [],
				middle: [
					"iterateZoom",
					"thumbs",
					"fullscreen",
				],
				right: ["close"],
			},
		},

		Caption: {
			display: {
					autoHide: false,
					position: 'bottom'
			},
			template: {
					wrap: (content) => `<div class="fancybox-caption">${content}</div>`
			}
	}
	});
});

$(document).ready(function () {
	Fancybox.bind('[data-fancybox="web-gallery"]', {
		compact: true,

		// Command list for Thumbnail
		Thumbs: {
			type: 'classic',
			showOnStart: false,
		},

		// Command list for Toolbar
		Toolbar: {
			display: {
				left: [],
				middle: [
				],
				right: ["close"],
			},
		},
	});
});