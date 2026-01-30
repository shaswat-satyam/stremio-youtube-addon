const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const env = require("env");

const manifest = {
  id: "org.stremio.youtube-media",
  name: "Youtube Media",
  version: "1.0.0",
  description: "Watch Youtube Media available on youtube",
  resources: ["catalog", "stream", "meta"],
  types: ["movie", "series", "tv"],
  catalogs: [
    {
      type: "movie",
      id: "helloworldmovies",
    },
    {
      type: "series",
      id: "helloworldseries",
    },
  ],
  idPrefixes: ["tt"],
};

const builder = new addonBuilder(manifest);
const baseAPIurl = env["baseAPIurl"];

const METAHUB_URL = "https://images.metahub.space";

const generateMetaPreview = function (value, key) {
  // To provide basic meta for our movies for the catalog
  // we'll fetch the poster from Stremio's MetaHub
  // see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/meta.md#meta-preview-object

  getData();
  const imdbId = key.split(":")[0];
  return {
    id: imdbId,
    type: value.type,
    name: value.name,
    poster: METAHUB_URL + "/poster/medium/" + imdbId + "/img",
  };
};

builder.defineCatalogHandler(function (args, cb) {
  // filter the dataset object and only take the requested type
  const metas = Object.entries(data)
    .filter(([_, value]) => value.type === args.type)
    .map(([key, value]) => generateMetaPreview(value, key));

  return Promise.resolve({ metas: metas });
});

async function getStreamsFromDatabase(id, type) {
  const response = await fetch(`${ApiURL}/${type}?id=${id}`);

  if (!response.ok) {
    console.error("Failed to fetch streams:", response.statusText);
    return [];
  }

  const results = await response.json();

  return results.map((r) => ({
    id: r._id.toString(),
    youtube_id: r.youtube_id,
    imdb: r.imdb_id,
  }));
}

builder.defineStreamHandler(async ({ id, type }) => {
  const streamsFromDB = await getStreamsFromDatabase(id, type);
  const streams = streamsFromDB.map((stream) => ({
    id: stream.id,
    imdb: stream.imdb_id,
    title: "from Youtube " + type,
    ytId: stream.youtube_id,
    type: type,
  }));
  return { streams };
});

serveHTTP(builder.getInterface(), { port: 7001 });
