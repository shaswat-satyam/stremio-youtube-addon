# Stremio Youtube Addon

**Rustify the Code**

This is a repo for an addon for Stremio to catalogue and stream the movies, series and anime which are uploaded to youtube.
Disclaimer - Few Youtube Videos are not embeddable so they might not work.
It has yet to be Deployed

## Background

Last Year, I made the switch from torrent to stremio.
It has been great going for Popular hollywood media.
But me being from Asia, I have seen a dearth of Indian and other related media on stremio.
And if available Few Seeders were available to stream
But these movies were freely available on youtube to stream.
So, I am trying to catalogue these youtube
I would like the project to be extended to various other media that are available on youtube even Skits channels

## Contributing

Most Important to these catalogues is the YtID for the video
The Addon is not currently published as It is not that polished like other addons.

### Language and Architecture

The addon's SDK is written in JavaScript.
The whole repository is divided into 3 folders

1. Front end
   It gives a front end for adding the Youtube movies and managing them at a single place.  
   I want it to be lean so I have coded it in HTMX which uses the REST states for managing the frontend
   It also uses tailwind to give the basic UI/UX
2. Addon
   The Template for the addon is [given here](https://github.com/Stremio/addon-helloworld)
   It fetches the catalog from the Server and adds the required streams and catalogs
3. Server
   It is the main brain of the addon. It holds the data for the various movies and series.
   As I have used HTMX it gives responses mostly in the form of HTML

## Todo

- [ ] Create a Contributing Readme
- [ ] Add More Movies
- [ ] Add features to hold series data
- [ ] Update the backend to parse the playlist to yt URL
- [ ] Add More Series
- [ ] Add features to hold cable data
- [ ] Add More Cable Channels
- [ ] Create a Icon and Banner for the Addon
- [ ] Add a description to the Addon
- [ ] Add a license to the Addon

## Ideas and Feedback

Contact me on Github or [email](mailto:palmtrees2308@protonmail.com) about any Idea or Feedback
Feel Free to add issues or pull request
