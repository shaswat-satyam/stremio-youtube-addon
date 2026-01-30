const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
require("dotenv").config();

const BaseAPIurl = process.env.BaseAPIurl;

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
      id: "Youtube-Media-Movies",
    },
    {
      type: "series",
      id: "Youtube-Media-Series",
    },
    {
      type: "tv",
      id: "Youtube-Media-tv",
    },
  ],
  idPrefixes: ["tt", "youtube-tv-channel-"],
};

const builder = new addonBuilder(manifest);

const METAHUB_URL = "https://images.metahub.space";

const generateMetaPreview = function (imdb_id, name, type) {
  // To provide basic meta for our movies for the catalog
  // we'll fetch the poster from Stremio's MetaHub
  // see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/meta.md#meta-preview-object

  if (type == "tv") {
    return {
      id: imdb_id,
      type: type,
      name: name,
    };
  }

  return {
    id: imdb_id.split(":")[0],
    type: type,
    name: name,
    poster: METAHUB_URL + "/poster/medium/" + imdb_id + "/img",
  };
};

builder.defineMetaHandler(async ({ id, type }) => {
  return {
    meta: {
      id,
      type,
      name: id,
    },
  };
});

builder.defineCatalogHandler(async (args, cb) => {
  // filter the dataset object and only take the requested type
  let result = await getStreamsFromDatabase(args.type);
  let metas;
  if (result.length > 0) {
    if (args.type == "tv") {
      console.log(result);
      metas = result.map(({ id, name }) =>
        generateMetaPreview("youtube-tv-channel-" + id, name, args.type),
      );
    } else {
      metas = result.map(({ imdb_id, name }) =>
        generateMetaPreview(imdb_id, name, args.type),
      );
    }
  }
  return Promise.resolve({ metas: metas });
});

async function getStreamsFromDatabase(type) {
  let response;
  if (type == "series") {
    response = await fetch(`${BaseAPIurl}/${type}`);
  } else {
    response = await fetch(`${BaseAPIurl}/${type}s`);
  }
  if (!response.ok) {
    console.error("Failed to fetch streams:", response.statusText);
    return [];
  }

  const result = await response.json();

  if (type == "tv") {
    return result.data.map((r) => ({
      id: r.id,
      poster: r.poster
        ? r.poster
        : "https://www.lifeinabreakdown.com/wp-content/uploads/2023/01/older-television-on-spindly-legs-with-large-dials-image-licensed-via-canva-pro-and-copyright-via-Getty-Images-Signature-and-shaunl.jpg",
      type: "tv",
      name: r.name,
    }));
  }
  return result.data.map((r) => ({
    youtube_id: r.youtube_id,
    imdb_id: r.imdb_id,
    name: r.name,
  }));
}
async function getStreamsFromDatabaseForParticularId(id, type, name) {
  let response;
  if (type == "movie" || type == "series") {
    response = await fetch(`${BaseAPIurl}/${type}/${id}`);
  } else if (type == "tv") {
    response = await fetch(`${BaseAPIurl}/${type}/${id.split("-").at(-1)}`);
    if (!response.ok) {
      console.error("Failed to fetch streams:", response.statusText);
      return [];
    }
    let result = await response.json();
    return {
      id: id,
      title: result.data.title,
      name: result.data.name,
      youtube_id: result.data.youtube_id,
    };
  }

  if (!response.ok) {
    console.error("Failed to fetch streams:", response.statusText);
    return [];
  }

  const result = await response.json();

  return result.data.map((r) => ({
    id: r.id.split("-").at(-1),
    title: "Live Stream",
    youtube_id: r.youtube_id,
    imdb: r.imdb_id,
  }));
}

builder.defineStreamHandler(async ({ id, type }) => {
  let streamsFromDB;
  if (type == "tv") {
    streamsFromDB = await getStreamsFromDatabaseForParticularId(id, type);
    return {
      id: id,
      title: "from youtube " + type,
      ytId: streamsFromDB.youtube_id,
      name: streamsFromDB.name,
      type: "tv",
      name: streamsFromDB.title,
      behaviorHints: {
        notWebReady: true,
      },
    };
  } else {
    streamsFromDB = await getStreamsFromDatabaseForParticularId(id, type);
  }

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
